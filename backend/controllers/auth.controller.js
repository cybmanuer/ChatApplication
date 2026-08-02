//controllers holds the logic code development of the routers 
// all logic is defined and exported to router making the code easy top read at router

// signup : 
// Accepts fullName, email, and password from the client (frontend form)
// Validates the data , Hashes the password securely , Saves the user to MongoDB , Generates a JWT token 



import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import bcrypt from "bcryptjs"

import {generateToken} from "../lib/utils.js"

import cloudinary from "../lib/cloudinary.js"

import { logSecurityEvent } from "../lib/splunkLogger.js"

// Signup page logic
export const signup = async (req, res)=>{
    const {fullName,email,password} = req.body;
    try{
        if(!fullName || !password || !email ){
            return res.status(400).json({message : "All fields are Required"});

        }
        // Guard against NoSQL injection: without this, a body like
        // straight into a Mongo query as an operator instead of a value.
        if (typeof email !== "string" || typeof password !== "string" || typeof fullName !== "string") {
            logSecurityEvent("injection_attempt", req, { reason: "non_string_field", endpoint: "signup" });
            return res.status(400).json({message : "Invalid input"});
        }
        if(password.length < 6){
            return res.status(400).json({message : "Password Must Be Atleast 6 Character"});
        }

        // check if the user Already exsits.
        const user = await User.findOne({email});
        if(user){
            logSecurityEvent("signup_failure", req, { reason: "user_exists", email });
            return res.status(400).json({message : "User Already Exisits, Please Login "});
        }

        // generate hashed passsword 
        const salt = await bcrypt.genSalt(10);  //creates a random salt with 10 rounds of computation.
        const hashedPassword = await bcrypt.hash(password,salt)  //hashes the password using the salt.

        // store the data of the new user
        const newUser = new User({
            fullName : fullName,
            email : email,
            password : hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res); // generating the JWT token / from the file /lib/utils.js -> complete code is written
            await newUser.save(); // save the stored data of the new user.

            logSecurityEvent("signup_success", req, { userId: newUser._id, email: newUser.email });

            // sharing the response, data 
            res.status(201).json({
                _id : newUser._id,
                fulName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilepic
            });
        }
        else{
            res.status(400).json({message : "Invalid User Data"});
        }

    }
    catch(e){
        console.log("Error in signup controler ", e.message);
        res.status(500).json({message : `Internal Server Error :  ${e.message}`});

    }
}

//login page logic code
export const login = async (req, res)=>{
    const {email,password} = req.body;
    try{
        if(!password ||!email){
            return res.status(400).json({message : "All fields are Required"});
        }
        if (typeof email !== "string" || typeof password !== "string") {
            logSecurityEvent("injection_attempt", req, { reason: "non_string_field", endpoint: "login" });
            return res.status(400).json({message : "Invalid input"});
        }
        if(password.length < 6){
            return res.status(400).json({message : "Password Must Be Atleast 6 Character"});
        }
        // check if the user Already exsits.
        const user = await User.findOne({email});
        if(!user){
            logSecurityEvent("login_failure", req, { reason: "user_not_found", email });
            return res.status(400).json({message : "User Not Found"});
        }
        const isCorrectPass = await bcrypt.compare(password , user.password);
        if(!isCorrectPass){
            logSecurityEvent("login_failure", req, { reason: "invalid_password", email, userId: user._id });
            return res.status(400).json({message : "Invalid  Password"});
        }
        generateToken(user._id,res); // generating the JWT token / from the file /lib/utils.js -> complete code is written
        logSecurityEvent("login_success", req, { userId: user._id, email: user.email });
        // sharing the response, data 
        res.status(200).json({
            _id : user._id,
            fulName : user.fullName,
            email : user.email,
            profilePic : user.profilepic
        });
    }
    catch(e){
        console.log("Error in signup controler ", e.message);
        res.status(500).json({message : `Internal Server Error :  ${e.message}`});
    }
    
}


export const logout = (req, res)=>{
    try
    {
        res.cookie("jwt" , "" , {maxAge : 0})
        logSecurityEvent("logout", req, { userId: req.user?._id });
        res.status(200).json({message : "Logged Out Successfuly"});
    }
    catch(e){
        res.status(500).json({message : `Internal Server Error :  ${e.message}`});
    }
}

// Updating UserName and profile pic
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    let updateData = {};

    // If profile pic provided → upload to cloudinary
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    // If fullName provided → update it
    if (fullName) {
      updateData.fullName = fullName;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid data provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (e) {
        console.log("Error in CheckAuth Controller" ,e.message);
        res.status(500).json({message : "Internal Server Error"});
    }
};


export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
 
        // 2) Delete messages sent OR received by user
        await Message.deleteMany({
            $or: [{ senderId: userId }, { reciverId: userId }],
        });

    //  Delete the user
        await User.findByIdAndDelete(userId);
        res.cookie("jwt", "", { maxAge: 0 });
        logSecurityEvent("account_deleted", req, { userId });
        res.status(200).json({ message: "User deleted successfully" });
        // 6) Clear the JWT token from the client-side
        // res.cookie("jwt", "", { maxAge: 0 });
    } catch (error) {
        console.log("Error in deleteUser controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// for disappering messages after 24 hours
// implimentedin cleanup.js

// export const deleteOldMessages = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 1) calculate the 24hr cutoff
//     const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     // const cutoffTime = new Date(Date.now() - 60 * 1000);
//     // 2) Delete messages where:
//     // - senderId OR reciverId matches current user
//     // - createdAt is older than cutoff
//     const result = await Message.deleteMany({
//       $and: [
//         { $or: [{ senderId: userId }, { reciverId: userId }] },
//         { createdAt: { $lt: cutoffTime } }
//       ]
//     });
//     res.status(200).json({
//       message: "Old messages deleted successfully",
//       deletedCount: result.deletedCount,
//     });
//   } catch (error) {
//     console.error("Error deleting messages:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const updateDisappearing = async (req, res) => {
    try {
        const { isDisappearing } = req.body;
        const userId = req.user._id; // from protectRoute middleware (JWT)

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isDisappearing },
            { new: true }
        ).select("-password"); // don’t return password

        res.json(updatedUser);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update setting" + err });
    }
};