import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors"
import mongoose from 'mongoose';
import database from "./config/database.js"
import AuthRoute from './routes/Auth.route.js';
import UserRoute from './routes/User.route.js';
import CategoryRoute from './routes/Category.route.js';
import BlogRoute from './routes/Blog.route.js';
import CommentRoute from './routes/Comment.route.js';
import BlogLikeRoute from './routes/Like.route.js';

dotenv.config();
const PORT = process.env.PORT || 3000

const app = express();

app.use(cookieParser());
app.use(express.json())


// app.use(cors({
//   origin: process.env.FRONTEND_URL, 
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],

// }));
app.use(cors({
  origin: 'https://nomadic-dev.vercel.app', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],

}));

// route setup // auth
app.use("/api/auth",AuthRoute)
// user profile route setup
app.use("/api/user",UserRoute)
// category route
app.use("/api/category",CategoryRoute)
// blog routes
app.use("/api/blog",BlogRoute)
// comment routes
app.use("/api/blog",CommentRoute)
// like routes
app.use("/api/blog-like",BlogLikeRoute)

// database connection
database();



app.listen(PORT,()=>{
    console.log("Server running onn port ",PORT)
})
app.get("/",(req,res)=>{
    res.send(
        "<h1>Hello server running successfully</h1>"
    )
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})


 