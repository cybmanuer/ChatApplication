//Ther authentication middleware before moving / giving the user info or make changes to db 
// ✅ Middleware to protect routes by verifying JWT token

// used in updateProfile route

import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;  //Get token from browser cookie

        // check if the user loged in with token
        if(!token){
            return res.status(401).json({message : "Unauthorized - No token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);// Verify the token using secret key


        if(!decoded){
            return res.status(401).json({message : "Unauthorized - Invalid Token "});
        }

        const user = await User.findById(decoded.userId).select("-password");  // Get user from DB using decoded userId, exclude password

        if(!user){
            return res.status(404).json({message : "User Not Found"});
        }

        req.user = user; // ading the user name before forwording the request to the next function (updateProfile)

        next(); //Move to the next middleware/route  -> updateProfile


    } catch (error) {
        console.error("ProtectRoute Error:", error.message);
        res.status(500).json({ message: "Server Error" });
        
    }
}

