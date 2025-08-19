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

// Signup page logic
export const signup = async (req, res)=>{
    const {fullName,email,password} = req.body;
    try{
        if(!fullName || !password || !email ){
            return res.status(400).json({message : "All fields are Required"});

        }
        if(password.length < 6){
            return res.status(400).json({message : "Password Must Be Atleast 6 Character"});
        }

        // check if the user Already exsits.
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User Already Exisits "});
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
        if(password.length < 6){
            return res.status(400).json({message : "Password Must Be Atleast 6 Character"});
        }
        // check if the user Already exsits.
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "User Not Found"});
        }
        const isCorrectPass = await bcrypt.compare(password , user.password);
        if(!isCorrectPass){
            res.status(400).json({message : "Invalid  Password"});
        }
        generateToken(user._id,res); // generating the JWT token / from the file /lib/utils.js -> complete code is written
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
        res.status(200).json({message : "Logged Out Successfuly"});
    }
    catch(e){
        res.status(500).json({message : `Internal Server Error :  ${e.message}`});
    }
}

// the profile pic updating is working good
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


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



// export const deleteUser = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         await User.findByIdAndDelete(userId);
//         res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.log("Error in deleteUser controller:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

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
        res.status(200).json({ message: "User deleted successfully" });
        // 6) Clear the JWT token from the client-side
        // res.cookie("jwt", "", { maxAge: 0 });
    } catch (error) {
        console.log("Error in deleteUser controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};