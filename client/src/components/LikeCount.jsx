import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { useSelector } from 'react-redux';


const LikeCount = ({props}) => {

  const[likeCount,setLikeCount] = useState(0);
  const[hasLiked,setHasLiked] = useState(false);
  const {user} = useSelector((state)=>state.user);

      const url = `${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${props.blogId}/${user && user.isLoggedIn ? user.user._id : ""}`;
      const {data:blogLikeCount,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include" ,
        }
      )


    const handleLike  = async()=>{
      try{
          if(!user.isLoggedIn){
            return showToast('error',"please login  into your account.");
          }

          const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/do-like`,{
            method:"post",
            credentials:'include',
            headers :{'Content-type':'application/json'},
            body: JSON.stringify({user:user?.user?._id,blogId:props.blogId}),
          })


          if(!response.ok){
            showToast('error',response.statusText)
          }
          const responseData = await response.json();
          setLikeCount(responseData.likeCount);
          setHasLiked(!hasLiked);
      }catch(error){
            showToast('error',error.message)
      }
    }

    useEffect(()=>{
      if(blogLikeCount){
        setLikeCount(blogLikeCount.likeCount);
        setHasLiked(blogLikeCount.isUserLiked)
      }
    },[blogLikeCount])

  return (
    <div>
      <button 
      onClick={()=>{handleLike()}}
      className='flex items-center gap-2 cursor-pointer'>
        {!hasLiked ? <FaRegHeart/> :  <FaHeart color='red'/>}
              {likeCount}
          </button>
    </div>
  )
}

export default LikeCount
