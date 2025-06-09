import { handleError } from "../helpers/handleErros.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

export const Register = async (req,res,next)=>{
    try{

        const {name,email,password} = req.body;
        
        const checkuser = await User.findOne({email});
        if(checkuser){
            // user already register
            next(handleError(409,"user already registered."));
        }

        // has the password using the bcryptjs library
        const hashedPassword = bcryptjs.hashSync(password,10)

        // register user
        const user = new User({
            name,email,password:hashedPassword
        })

        await user.save();

        res.status(200).json({
            success:true,
            message:"Registration successful.",
            user,
        })

    }catch(error){
            next(handleError(500,error.message));

    }
}

export const Login = async (req,res,next)=>{

    try{

        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            next(handleError(404,"Invalid login credentials."));
        }
        const hashedPassword = user.password;
        const comparePassword = bcryptjs.compareSync(password,hashedPassword)
        if(!comparePassword){
            next(handleError(404,"Invalid login credentials."));
            return;
        }

        const token = jwt.sign({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        },process.env.JWT_SECRET)



        // res.cookie("access_token",token,{
        //     httpOnly:true,
        //     secure:process.env.NODE_ENV==="production",
        //     sameSite:process.env.NODE_ENV==="production" ? "none" :"strict",
        //     path:"/"
        // })
        res.cookie("access_token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            path:"/"
        })

        const newUser = user.toObject({getters:true})
        delete  newUser.password

        res.status(200).json({
            success:true,
            user:newUser,
            message:"Login Successful"
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const GoogleLogin = async (req,res,next)=>{

    try{

        const {name,email,avatar} = req.body;
        
        let user;
        user = await User.findOne({email});

        if(!user){
            // if not user find the create the user
            const password = Math.random().toString();
            const hashedPassword = bcryptjs.hashSync(password);
            const newUser = new User({
                name,email,password:hashedPassword,avatar
            })
            user = await newUser.save();
        }

        const token = jwt.sign({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
        },process.env.JWT_SECRET)

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production" ? "none" :"strict",
            path:"/"
        })

        const newUser = user.toObject({getters:true})
        delete  newUser.password

        res.status(200).json({
            success:true,
            user:newUser,
            message:"Login Successful"
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}



export const Logout = async (req,res,next)=>{

    try{
        res.clearCookie("access_token",{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production" ? "none" :"strict",
            path:"/"
        })
        
        res.status(200).json({
            success:true,
            message:"Logout Successful"
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}
