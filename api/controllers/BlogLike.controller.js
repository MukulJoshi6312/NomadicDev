import { handleError } from "../helpers/handleErros.js";
import Like from "../models/like.model.js";

export const doLike = async(req,res,next)=>{
     try{    
        const {user,blogId} = req.body;
        let like;
        like = await Like.findOne({user,blogId});
        if(!like){
            const saveLike = new Like({
                user:user,
                blogId:blogId,
            });
            like = await saveLike.save();
        }else{
            await Like.findByIdAndDelete(like._id);
        }
        const likeCount = await Like.countDocuments({blogId});
        res.status(200).json({
            likeCount
        })

    }   
    catch(error){
        next(handleError(500,error.message))
    }
}

export const likeCount = async(req,res,next)=>{
 try{    
        const {blogId,userId} = req.params
        const likeCount = await Like.countDocuments({blogId});
        let isUserLiked
        if(userId){
            const getUserLiked = await Like.countDocuments({ blogId,user:userId });
            if(getUserLiked > 0){
                isUserLiked = true;
            }
        }
        res.status(200).json({ 
        likeCount,isUserLiked
        })


    }   
    catch(error){
        next(handleError(500,error.message))
    }
}