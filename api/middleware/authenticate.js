import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      return next(error);
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodeToken;
    next();

  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
