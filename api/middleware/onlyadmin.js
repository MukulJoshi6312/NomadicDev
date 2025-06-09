import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const onlyadmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
