import Loading from '@/components/Loading';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import Comment from '@/components/Comment';
import dateFormater from '@/helpers/dateFormater';
import CommentCount from '@/components/CommentCount';
import LikeCount from '@/components/LikeCount';
import RelatedBlog from '@/components/RelatedBlog';


const SingleBlogDetails = () => {

    const {blog,category} = useParams();

     const url = `${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`;
      const {data:blogData,loading,error} = useFetch(url,
          {
              method:"get",
              credentials:"include",
          },[blog,category]
      )

    const markdownContent = blogData?.blog?.blogContent || '';
    const decodedBlogContent = marked.parse(markdownContent);

    if(loading) return <Loading/>
  return (
    <div className='md:flex-nowrap flex-wrap flex justify-between gap-20 '>
        {blogData && blogData.blog  &&
        <>
        <div className='border rounded md:w-[70%] w-full p-5'>
            <h1 className='text-2xl font-bold mb-5' >{blogData?.blog?.title}</h1>

            <div className='flex justify-between items-center'>
                <div className='flex justify-between items-center gap-5'>
                <Avatar>
                    <AvatarImage src={blogData?.blog?.author?.avatar} />
                </Avatar>
                <div className='flex flex-col'>
                <span>{blogData?.blog?.author?.name}</span>
                <span className='text-xs'>{ dateFormater(blogData?.blog?.createdAt)}</span>
                </div>
                </div>
                 <div className='flex justify-between items-center gap-5'>
                  <LikeCount props={{blogId:blogData?.blog?._id}}/>
                  <CommentCount props={{blogId:blogData?.blog?._id}} />
                </div>
            </div>

            <div className='my-5'>
                <img src={blogData?.blog?.featuredImage} className='rounded w-full' />
            </div>

            <div dangerouslySetInnerHTML={{__html: decodedBlogContent || ''}}>

            </div>
            <div className='border-t mt-5 '>

              <Comment props={{blogId:blogData?.blog?._id}}/>
            </div>
            {/* <div className='border-t mt-5 '>

              <CommentList props={{blogId:blogData?.blog?._id}}/>
            </div> */}
        </div>
        </>
        }

      <div className='border rounded md:w-[30%] w-full p-5'>
        <RelatedBlog props={{category:category,currentBlog:blog}} />
      </div>
    </div>
  )
}

export default SingleBlogDetails
