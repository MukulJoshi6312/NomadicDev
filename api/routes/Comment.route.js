import express from "express"
import { addComment,getComments,commentCount,getAllComments,deleteComments} from "../controllers/Comment.controller.js"
import { authenticate } from "../middleware/authenticate.js";

const CommentRoute = express.Router();

CommentRoute.post("/comment", addComment)
CommentRoute.get("/get/:blogId", getComments)
CommentRoute.get("/get-count/:blogId", commentCount)
CommentRoute.get("/get-all-comment",authenticate,getAllComments)
CommentRoute.delete("/commentDelete/:commentId", deleteComments)

export default CommentRoute