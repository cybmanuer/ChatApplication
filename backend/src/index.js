import express from 'express';
import cookieParser from "cookie-parser"

import cors from "cors"; // for cross-origin resource sharing,allows the server to accept requests from different origins like frontend and backend

const app = express();

import {connectDB } from '../lib/db.js'

import authRoutes from '../routes/auth.route.js';
import messageRoutes from '../routes/message.route.js'
 //middleware 
// app.use(express.json())
app.use(express.json({ limit: '10mb' })); // to parse json request body with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // to parse form-data request body with size limit

app.use(cookieParser()) // used to parse the cookie , that helps to grab the values from the cooke in jwt tokens
app.use(cors({ //middleware for cross-origin resource sharing) allows the server to accept requests from different origins like frontend and backend
    origin: "http://localhost:5173", //  frontend URL
    credentials: true                // allow cookies if needed
}));

//env configration 
import dotenv from "dotenv";
dotenv.config()
const PORT = process.env.PORT;

app.use('/api/auth',authRoutes);  // -> extended code in route/auth.route.js
app.use("/api/message",messageRoutes);  // message related code  -> logic is defined at route/message.route.js



app.listen(PORT,()=>{
    console.log(`App is running at http://localhost:` + PORT);
    connectDB();
});