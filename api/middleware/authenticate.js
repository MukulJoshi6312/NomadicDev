import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const authenticate = async (req,res,next)=>{
    try{
    const token  = req.cookies.access_token;
    console.log("Kya hai token m",token)
    if(!token){
        return next(403,'Unauthorized')
    }
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
    console.log("Decode ",decodeToken)
    req.user = decodeToken;
    console.log('after deconde  ',decodeToken)
    next();
    }catch(error){
        next(500,error.message)
    }
}