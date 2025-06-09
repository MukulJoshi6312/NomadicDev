import express from "express"
import {addCategory,showCategory,updateCategory,deleteCategory,getAllCategory } from "../controllers/Category.controller.js";
import { onlyadmin } from "../middleware/onlyadmin.js";

const CategoryRoute = express.Router();

CategoryRoute.post("/add", onlyadmin, addCategory)
CategoryRoute.put("/update/:categoryId",onlyadmin,updateCategory)
CategoryRoute.get("/show/:categoryId",onlyadmin,showCategory)
CategoryRoute.delete("/delete/:categoryId",onlyadmin,deleteCategory)
CategoryRoute.get("/all-category",getAllCategory)

export default CategoryRoute