import mongoose, { Schema } from "mongoose";


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        
    },
    slug:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
})

const Category = mongoose.model("Category",categorySchema)
export default Category