export const RouteIndex = "/"
export const RouteSignIn = "/sign-in"
export const RouteSignUp = "/sign-up"
export const RouteProfile = "/profile"
export const RouteCategoryDetails = "/categories"
export const RouteAddCategory = "/category/add"
export const RouteEditCategory =(categoryId)=>{
    if(categoryId){
        return `/category/edit/${categoryId}`
    }else{
        return `/category/edit/:categoryId`
    }
}

export const RouteBlog = "/blog"
export const RouteBlogAdd ="/blog/add"
export const RouteBlogEdit =(blogId)=>{
    if(blogId){
        return `/blog/edit/${blogId}`
    }else{
        return `/blog/edit/:blogId`
    }
}

export const RouteBlogDetails = (category,blog)=>{
    if(!category || !blog){
        return "/blog/:category/:blog"
    }else{
        return `/blog/${category}/${blog}`
    }
}


export const RouteBlogByCategory = (category)=>{
    if(!category){
        return "/blog/:category"
    }else{
        return `/blog/${category}`
    }
}
export const RouteSerach = (query)=>{
    if(query){
    return `/blog/search?q=${query}`
}
    else{
    return `/blog/search`

    }
}

export const RouteCommentDetails = '/comments'
export const RouteUsers = '/users'

