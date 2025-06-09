import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import { Avatar, AvatarImage } from './ui/avatar';
import dateFormater from '@/helpers/dateFormater';
import { useSelector } from 'react-redux';

const CommentList = ({props}) => {

    const {user} = useSelector((state)=>state.user)
     const url = `${getEnv('VITE_API_BASE_URL')}/blog/get/${props?.blogId}`;
      const {data,loading,error} = useFetch(url,
          {
              method:"get",
              credentials:"include",
          }
      )

      if(loading) return <Loading/>
  return (
    <div className='mt-5'>
        <h4 className='text-2xl font-bold'> { props.newComment ?
        <span>
              { data && data.comments.length  +1}
        </span>  
        :
         <span className='me-2'>
              { data && data.comments.length}
        </span>  
        } Comments</h4>
      
        <div className='mt-5'>
            { props.newComment &&
                  <div className='flex gap-2 mb-3'>
                    <Avatar>
                        <AvatarImage src={user?.user?.avatar}/>
                    </Avatar>
                    <div>
                        <p className='font-bold'>{user?.user?.name}</p>
                        <p>{ dateFormater(props?.newComment?.createdAt)}</p>
                        <div className='pt-3'>
                                {props?.newComment?.comment}
                        </div>
                    </div>
                 </div>
            }

            {
                data && data.comments.length > 0
                && 
                data.comments.map(comment =>{
                    return (
                         <div className='flex gap-2 mb-3' key={comment._id}>
                    <Avatar>
                        <AvatarImage src={comment?.user?.avatar}/>
                    </Avatar>
                    <div>
                        <p className='font-bold'>{comment?.user?.name}</p>
                        <p>{ dateFormater(comment.createdAt)}</p>
                        <div className='pt-3'>
                                {comment.comment}
                        </div>
                    </div>
                 </div>
                    )
                })
            }
           
        </div>
      
    </div>
  )
}

export default CommentList
