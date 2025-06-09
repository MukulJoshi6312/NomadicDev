import BlogCard from '@/components/BlogCard';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { BiCategory } from 'react-icons/bi';
import { useSearchParams } from 'react-router-dom'

const SearchResult = () => {
     const [searchParams] = useSearchParams();
    const q = searchParams.get('q');

    const url = `${getEnv('VITE_API_BASE_URL')}/blog/search?q=${q}`;
        const {data:blogData,loading,error} = useFetch(url,
            {
                method:"get",
                credentials:"include"
            },[q]
        )

    
  return (
    <>   
     <div className='flex items-center gap-x-2 text-2xl font-bold border-b mb-5 pb-3'>
            <BiCategory/>
            <p className='capitalize'>
            <h4>Search Result For: {q}</h4>
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

export default SearchResult
