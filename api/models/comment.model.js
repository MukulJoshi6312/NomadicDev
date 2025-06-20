import mongoose, { Schema } from "mongoose";


const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Blog",
    },
    comment:{
        type:String,
        required:true,
        trim:true,
    }
    
},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema)
export default Comment