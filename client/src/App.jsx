import { useState } from 'react'

import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import { RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogByCategory, RouteBlogDetails, RouteBlogEdit, RouteCategoryDetails, RouteCommentDetails, RouteEditCategory, RouteIndex, RouteProfile, RouteSerach, RouteSignIn, RouteSignUp, RouteUsers } from './helpers/RouteName'
import Index from './pages/Index'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AddCategory from './pages/category/AddCategory'
import CategoryDetail from './pages/category/CategoryDetail'
import EditCategory from './pages/category/EditCategory'
import AddBlog from './pages/blog/AddBlog'
import BlogDetails from './pages/blog/BlogDetails'
import EditBlog from './pages/blog/EditBlog'
import SingleBlogDetails from './pages/SingleBlogDetails'
import BlogByCategory from './pages/blog/BlogByCategory'
import SearchResult from './pages/SearchResult'
import Comment from './pages/Comment'
import Users from './pages/Users'
import AuthRouteProtection from './components/AuthRouteProtection'
import OnlyAdminAllowed from './components/OnlyAdminAllowed'

function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
    <Routes>
      <Route path={RouteIndex} element={<Layout/>}>
        <Route index element={<Index/>}/>    
        {/* blog */}
        <Route path={RouteBlogDetails()} element={<SingleBlogDetails/>} />
        <Route path={RouteBlogByCategory()} element={<BlogByCategory/>} />
        <Route path={RouteSerach()} element={<SearchResult/>} />

        <Route element={<AuthRouteProtection/>} >
          <Route path={RouteProfile} element={<Profile/>} />
          <Route path={RouteBlogAdd} element={<AddBlog/>} />
          <Route path={RouteBlog} element={<BlogDetails/>} />
          <Route path={RouteBlogEdit()} element={<EditBlog/>} />
          <Route path={RouteCommentDetails} element={<Comment/>} />
        </Route>

        <Route element={<OnlyAdminAllowed/>} >
          <Route path={RouteAddCategory} element={<AddCategory/>} />
          <Route path={RouteCategoryDetails} element={<CategoryDetail/>} />
          <Route path={RouteEditCategory()} element={<EditCategory/>} />
          <Route path={RouteUsers} element={<Users/>} />
        </Route>
        
      </Route>

      <Route path={RouteSignIn} element={<SignIn/>} />
      <Route path={RouteSignUp} element={<SignUp/>} />
    </Routes>
    
   </BrowserRouter>
  )
}

export default App
