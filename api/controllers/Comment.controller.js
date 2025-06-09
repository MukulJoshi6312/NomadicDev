import { handleError } from "../helpers/handleErros.js";
import Comment from "../models/comment.model.js";


export const addComment = async (req,res,next)=>{
      try{

        const {user,blogId,comment} = req.body;
        const newComment = new Comment({
            user:user,
            blogId:blogId,
            comment:comment,
        })
        await newComment.save();

        res.status(200).json({
            success:true,
            message:"Comment added successfully",
            comment:newComment,
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const getComments = async (req,res,next)=>{
      try{

        const {blogId} = req.params;
        const comments = await Comment.find({blogId}).populate('user','name avatar').sort({createdAt:-1}).lean().exec()
        res.status(200).json({
            comments
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const commentCount = async (req,res,next)=>{
      try{
        const {blogId} = req.params;
        const commentCount = await Comment.countDocuments({blogId});
        res.status(200).json({
            commentCount
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const getAllComments = async (req,res,next)=>{
      try{
        const user = req.user;
        console.log('get all comment user ',user);
        let comments;
        if(user.role=== 'admin'){
        comments = await Comment.find({}).populate('blogId','title').populate('user','name').lean().exec();

        }else{
        comments = await Comment.find({user:user._id}).populate('blogId','title').populate('user','name').lean().exec();

        }
        res.status(200).json({
            comments
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const deleteComments = async (req,res,next)=>{
      try{
        const {commentId} = req.params;
        console.log("Comment id ",commentId)
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({
            success:true,
            message:"Comment delete successfully"
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}