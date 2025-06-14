import { handleError } from "../helpers/handleErros.js";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import cloudinary from "../config/cloudinary.js";
import {encode}  from 'entities'
import { response } from "express";
import { marked } from 'marked';

export const addBlog = async(req,res,next)=>{
    try{

        const data = JSON.parse(req.body.data);
        let featuredImage = ''

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
               featuredImage = uploadResult.secure_url;
            }
        
        // blogContent = encode(data.blogContent)
        const blogContentMarkdown = data.blogContent;

        const blog = new Blog({
            author:data.author,
            category:data.category,
            title:data.title,
            slug:data.slug,
            featuredImage:featuredImage,
            blogContent:blogContentMarkdown,
        })
        await blog.save();

        res.status(200).json({
            success:true,
            message:"Blog created successfully",
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}

export const editBlog = async(req,res,next)=>{
     try{
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId).populate("category","name").exec();
        if(!blog){
            next(handleError(404,"Category not found"))
        }
        return res.status(200).json({
            blog,
        })
    }
    catch(error){
    next(handleError(500,error.message))

    }
}
export const updateBlog = async(req,res,next)=>{
     try{
        
        const {blogId} = req.params
        const data = JSON.parse(req.body.data);
        const blog = await Blog.findById(blogId);

        blog.title = data.title;
        blog.slug = data.slug;
        blog.blogContent = encode(data.blogContent);

        let featuredImage = blog?.featuredImage

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
               featuredImage = uploadResult.secure_url;
            }

        blog.featuredImage = featuredImage;
        
        await blog.save();
        
        res.status(200).json({
            success:true,
            message:"Blog updated successfully",
        })

    }catch(error){
        next(handleError(500,error.message));
    }
}
export const deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    await Comment.deleteMany({ blogId }); 
    await Like.deleteMany({ blogId });    

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({
      success: true,
      message: "Blog and all associated comments and likes deleted successfully.",
    });

  } catch (error) {
    next(handleError(500, error.message));
  }
};
export const showAllBlog = async(req,res,next)=>{
    try{
        const user = req.user;
        let blog;
        if(user.role === 'admin'){
        blog = await Blog.find().populate('author','name avatar role').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        }else{
        blog = await Blog.find({author:user._id}).populate('author','name avatar role').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        }
        res.status(200).json({
            success:true,
            message:"Data fetch successfully blogs",
            blog,
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}


export const getBlog = async (req,res,next)=>{
     try{

        const {slug} = req.params;

        const blog = await Blog.findOne({slug}).
        populate('author','name avatar role').
        populate('category','name slug').lean().exec();
        res.status(200).json({
            success:true,
            message:"Data fetch successfully blogs",
            blog,
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}

export const getRelatedBlog = async (req,res,next)=>{
     try{

        const {category,blog} = req.params;
        const categoryData = await Category.findOne({slug:category});
        if(!categoryData){
            return next(404,"category data not found")
        }

        const categoryId = categoryData._id;
        const relatedBlog = await Blog.find({category:categoryId,slug:{$ne:blog}}).lean().exec();
        res.status(200).json({
            success:true,
            message:"Data fetch successfully blogs",
            relatedBlog,
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}


export const getBlogByCategory = async (req,res,next)=>{
     try{

        const {category} = req.params;
        const categoryData = await Category.findOne({slug:category});
        if(!categoryData){
            return next(404,"category data not found")
        }
        const categoryId = categoryData._id;
        const blog = await Blog.find({category:categoryId}).populate('category','name slug').lean().exec();
        res.status(200).json({
          blog,categoryData
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}


export const search = async (req,res,next)=>{
     try{
        const {q} = req.query;
        const blog = await Blog.find({title:{$regex:q,$options:'i'}}).populate('author','name avatar role').populate('category','name slug').lean().exec();
        res.status(200).json({
          blog
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}

export const getAllBlogs = async(req,res,next)=>{
    try{
        const user = req.user;
        const blog = await Blog.find().populate('author','name avatar role').populate('category','name slug').sort({createdAt:-1}).lean().exec();

        
        res.status(200).json({
            success:true,
            message:"Data fetch successfully blogs",
            blog,
        })
    }catch(error){
        next(handleError(500,error.message));
    }
}