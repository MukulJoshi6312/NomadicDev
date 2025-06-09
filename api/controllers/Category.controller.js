import Category from "../models/category.model.js"
import { handleError } from "../helpers/handleErros.js";
import Blog from "../models/blog.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";


export const addCategory = async(req,res,next)=>{
    try{    
        const {name,slug} = req.body;
        const category = new Category({
            name,slug
        })
        await category.save();
        res.status(200).json({
            success:true,
            message:"Category Added successfully."
        })
    }   
    catch(error){
        next(handleError(500,error.message))
    }
}

export const showCategory = async(req,res,next)=>{
    
    try{
        const {categoryId} = req.params;
        const category = await Category.findById(categoryId).exec();
        if(!category){
            next(handleError(404,"Category not found"))
        }
        return res.status(200).json({
            category,
        })
    }
    catch(error){
    next(handleError(500,error.message))

    }
}

export const updateCategory = async(req,res,next)=>{
    try{

        const {name,slug} = req.body;
        const {categoryId} = req.params;
        const category = await Category.findByIdAndUpdate(categoryId,{name,slug},{new:true});

        res.status(200).json({
            success:true,
            message:"Category Updated successfully.",
            category
        })

    }
    catch(error){
        next(handleError(500,error.message))

    }
}

// export const deleteCategory = async(req,res,next)=>{
    
//     try{
//         const {categoryId} = req.params;
//         await Category.findByIdAndDelete(categoryId);
//         res.status(200).json({
//             success:true,
//             message:"Category Deleted successfully.",
//         })
//     }
//     catch(error){
//         next(handleError(500,error.message))

//     }
// }

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // 1. Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // 2. Find all blogs in this category
    const blogs = await Blog.find({ category: categoryId }); // ✅ Correct field name
    const blogIds = blogs.map(blog => blog._id);

    if (blogIds.length > 0) {
      // 3. Delete all related comments and likes
      await Comment.deleteMany({ blogId: { $in: blogIds } }); // ✅ Correct field
      await Like.deleteMany({ blogId: { $in: blogIds } });     // ✅ Correct field

      // 4. Delete the blogs
      await Blog.deleteMany({ _id: { $in: blogIds } });
    }

    // 5. Delete the category itself
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category and all associated blogs, comments, and likes deleted successfully.",
    });

  } catch (error) {
    next(handleError(500, error.message));
  }
};


export const getAllCategory = async(req,res,next)=>{
    
    try{
        const category = await Category.find().sort({name:1}).lean().exec();
        return res.status(200).json({
            category,
        })
    }
    catch(error){
        next(handleError(500,error.message))

    }
}