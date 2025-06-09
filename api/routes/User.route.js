import express from "express"
import { getUser,updateUser,getAllUsers,deleteUser } from "../controllers/User.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const UserRoute = express.Router();

UserRoute.use(authenticate)
UserRoute.get("/get-user/:userId", getUser)
UserRoute.put("/update-user/:userId",upload.single("file"), updateUser)
UserRoute.get("/get-all-users", getAllUsers)
UserRoute.delete("/delete/:userId", deleteUser)

export default UserRoute