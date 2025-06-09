import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const onlyadmin = async (req, res, next) => {
  try {
    const  token  = req.cookies.access_token;
    if (!token) {
      return next(403, "Unauthorized");
    }
    console.log('inside the admin middleware ',token)
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decode token  ',decodeToken)

    if (decodeToken.role === "admin") {
      req.user = decodeToken;
      next();
    } else {
      return next(403, "Unauthorized");
    }
  } catch (error) {
    next(500, error.message);
  }
};
