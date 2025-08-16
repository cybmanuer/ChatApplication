import User from "../models/user.model.js" 
import Message from "../models/message.model.js" 
import cloudinary from "../lib/cloudinary.js";

import { io, getReceiverSocketId } from "../lib/socket.js";



//used to find all the users (contact) to show in left side bar 
export const getUsersForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{ $ne : loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("ProtectRoute Error:", error.message);
        res.status(500).json({ message: `Server Error ${error.message}` });
    }
}

export const getMessages = async (req,res) =>{
    try {
        const {id:userToChatId} = req.params; // id:usertoChatId -> renaming the id from the user res to userChatId
        const myId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId:myId , reciverId : userToChatId},
                {senderId:userToChatId , reciverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("ProtectRoute Error:", error.message);
        res.status(500).json({ message: `Server Error ${error.message}` }); 
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text , image } = req.body;
        const { id:reciverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            //uploading the image in message to cloudnary 
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        
        const newMessage = new Message({
            senderId, //==  senderId : senderId
            reciverId,
            text,
            image : imageUrl,
        })
        await newMessage.save(); // saving to db

        
        const receiverSocketId = getReceiverSocketId(reciverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage); // sending the new message to the receiver via socket.io
        }
        res.status(200).json(newMessage);
        // above code is for sending message to the receiver using socket.io in real time using websockets


    } catch (error) {
        console.error("ProtectRoute Error:", error.message);
        res.status(500).json({ message: `Server Error ${error.message}` }); 
    }
}



