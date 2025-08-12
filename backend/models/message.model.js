
// This schema defines how a chat message is stored in MongoDB:
// Each message has a sender, receiver, optional text, and optional image.
// Timestamps track when the message was created/updated.



import mongoose from 'mongoose';

// Define the schema for storing chat messages
const messageSchema = new mongoose.Schema(
    {
        // Sender's user ID (linked to User model)
        senderId:{
            type:mongoose.Schema.Types.ObjectId,  // ID of sender (ObjectId)
            ref : "User",   // Reference to User collection
            required : true,
        },
        // Receiver's user ID (linked to User model)
        reciverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        text: {
            type : String,
        },
        image: {
            type : String,
        },
    },        
    {timestamps : true}
);

const Message = mongoose.model("Message",messageSchema);

export default Message;
