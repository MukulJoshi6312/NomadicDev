import User from "../models/user.model.js";
import { handleError } from "../helpers/handleErros.js";
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"
import cloudinary from "../config/cloudinary.js";
dotenv.config();

export const getUser = async (req,res,next)=>{
    try{
        const {userId} = req.params
        const user = await User.findOne({_id:userId}).lean().exec();

        if(!user)
        {
            next(handleError(404,"User Not Found!"));
        }
        res.status(200).json({
            success:true,
            message:"User data found",
            user,
        })


    }catch(error){
        next(handleError(500,error.message));
    }
}

export const updateUser = async (req, res, next) => {
  try {
    // console.log("Uploaded file:", req.file); // ✅ Now this will not be undefined
    // console.log("Form data:", req.body.data); // values will be JSON string

    const data = JSON.parse(req.body.data);

    const {userId} = req.params;
    const user = await User.findById(userId);

    if (
      user.name === data.name &&
      user.email === data.email &&
      user.bio === data.bio &&
      !req.file
    ) {
      return res.status(204).json({
        success: false,
        message: "No changes detected.",
      });
    }

    user.name = data.name;
    user.email = data.email;
    user.bio = data.bio

    if(data.password && data.password.length >= 8){
        const hashPassword = bcryptjs.hashSync(data.password,10);
        user.password = hashPassword;
    }

    if(req.file){
     const uploadResult = await cloudinary.uploader
       .upload(
           req.file.path,{
            folder:"Blogs",resource_type:'auto'
           }
       )
       .catch((error) => {
            next(handleError(500, error.message));
       });
       user.avatar = uploadResult.secure_url;
    
    }

    await user.save();
        const newUser = user.toObject({getters:true})
        delete  newUser.password
    return res.status(200).json({
      success: true,
      message: "Data updated successfully!",
      user:newUser,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAllUsers = async (req,res,next)=>{
  try{

    const users = await User.find().sort({createAt:-1});
    res.status(200).json({
      success:true,
      message:"get all user data",
      users
    })

  }catch(error){
     next(handleError(500,error.message));
  }
}

export const deleteUser = async (req,res,next)=>{
  try{  

    const {userId} = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success:true,
      message:"user deleted successfully",
      
    })

  }catch(error){
     next(handleError(500,error.message));
  }
}