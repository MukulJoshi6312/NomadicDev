import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { useParams } from 'react-router-dom'
import { BiCategory } from "react-icons/bi";

const BlogByCategory = () => {
    const {category} = useParams();
    const url = `${getEnv('VITE_API_BASE_URL')}/blog/get-blog-by-category/${category}`;
      const {data:blogData,loading,error} = useFetch(url,
          {
              method:"get",
              credentials:"include"
          },[category]
      )
      if(loading) return <Loading/>
  return (
    <>
    <div className='flex items-center gap-x-2 text-2xl font-bold border-b mb-5 pb-3'>
        <BiCategory/>
        <p className='capitalize'>
        {blogData && blogData.categoryData.name}
        </p>
        
    </div>
    <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
     {
      blogData && blogData.blog.length > 0 ?
      blogData.blog.map(blog=><BlogCard props={blog}  key={blog._id}/>)
      :
      <div>
        Data Not Found
      </div>
     }
    </div>
    </>

  )
}

export default BlogByCategory
