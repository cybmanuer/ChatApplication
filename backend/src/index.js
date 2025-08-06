import express from 'express';
import cookieParser from "cookie-parser"
const app = express();

import {connectDB } from '../lib/db.js'

import authRoutes from '../routes/auth.route.js';
app.use(express.json()) //middle ware 

//env configration 
import dotenv from "dotenv";
dotenv.config()
const PORT = process.env.PORT;



app.use('/api/auth',authRoutes)  // -> extended code in route/auth.route.js
app.use(cookieParser()), // used to parse the cookie , that helps to grab the values from the cooke in jwt tokens




app.listen(PORT,()=>{
    console.log(`App is running at http://localhost:` + PORT);
    connectDB();
});