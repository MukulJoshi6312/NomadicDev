import express from "express"
import {doLike,likeCount} from "../controllers/BlogLike.controller.js"
import { authenticate } from "../middleware/authenticate.js";

const BlogLikeRoute = express.Router();

BlogLikeRoute.post("/do-like", doLike)
BlogLikeRoute.get("/get-like/:blogId/:userId", likeCount)

export default BlogLikeRoute
