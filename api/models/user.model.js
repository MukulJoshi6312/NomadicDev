import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        default:"user",
        enum:['user','admin'],
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
        
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    bio:{
        type:String,
        trim:true,
    },
    avatar:{
        type:String,
        trim:true,
    },
    password:{
        type:String,
        trim:true,
    },

},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User