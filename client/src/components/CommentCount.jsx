import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { FaRegComment } from "react-icons/fa";
import Loading from './Loading';

const CommentCount = ({props}) => {
  
     const url = `${getEnv('VITE_API_BASE_URL')}/blog/get-count/${props.blogId}`;
          const {data,loading,error} = useFetch(url,
              {
                  method:"get",
                  credentials:"include",
              }
          )
    
if(loading) return <Loading/>
  return (
    <button className='flex items-center gap-2'>
        <FaRegComment/>
        { data && data.commentCount}
    </button>
  )
}

export default CommentCount
