import express from "express"
import {addCategory,showCategory,updateCategory,deleteCategory,getAllCategory } from "../controllers/Category.controller.js";
import { onlyadmin } from "../middleware/onlyadmin.js";

const CategoryRoute = express.Router();

CategoryRoute.post("/add", addCategory)
CategoryRoute.put("/update/:categoryId",updateCategory)
CategoryRoute.get("/show/:categoryId",showCategory)
CategoryRoute.delete("/delete/:categoryId",deleteCategory)
CategoryRoute.get("/all-category",getAllCategory)

export default CategoryRoute