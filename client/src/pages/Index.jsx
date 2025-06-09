import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'

const Index = () => {

   const url = `${getEnv('VITE_API_BASE_URL')}/blog/blogs`;
      const {data:blogData,loading,error} = useFetch(url,
          {
              method:"get",
              credentials:"include"
          }
      )



      if(loading) return <Loading/>
  return (
    <div className='grid md:grid-cols-3 sm:grid-cols-2  grid-cols-1 gap-10'>
     {

      blogData && blogData.blog.length > 0 ?
     
      blogData.blog.map(blog=><BlogCard props = {blog}  key={blog._id}/>)
      
      :
      <div>
        Data Not Found
      </div>

     }
    </div>
  )
}

export default Index
