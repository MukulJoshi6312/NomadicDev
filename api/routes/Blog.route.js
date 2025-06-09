import express from "express"
import { addBlog, editBlog, updateBlog, deleteBlog,showAllBlog,getBlog,getRelatedBlog,getBlogByCategory,search,getAllBlogs} from "../controllers/Blog.controller.js";
import upload from "../config/multer.js";
import { authenticate } from "../middleware/authenticate.js";

const BlogRoute = express.Router();

BlogRoute.post("/add", upload.single("file"), addBlog)
BlogRoute.get("/edit/:blogId", editBlog)
BlogRoute.put("/update/:blogId", upload.single("file"),updateBlog)
BlogRoute.delete("/delete/:blogId", deleteBlog)
BlogRoute.get("/get-all",showAllBlog)
BlogRoute.get("/get-blog/:slug",getBlog)
BlogRoute.get("/get-related-blog/:category/:blog",getRelatedBlog)
BlogRoute.get("/get-blog-by-category/:category",getBlogByCategory)
BlogRoute.get("/search",search)
BlogRoute.get("/blogs",getAllBlogs)


export default BlogRoute