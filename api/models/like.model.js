import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
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
    
},{timestamps:true})

const Like = mongoose.model("Like",likeSchema)
export default Like