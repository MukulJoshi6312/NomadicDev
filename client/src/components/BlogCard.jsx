import React from 'react'
import { Card, CardContent } from './ui/card'
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import { Badge } from './ui/badge';
import dateFormater from '@/helpers/dateFormater';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '@/helpers/RouteName';

const BlogCard = ({props}) => {

const {user} = useSelector((state)=>state.user);
    
  return (     
    <Link to={RouteBlogDetails(props?.category?.slug, props?.slug)}>
    <Card className="pt-5">
        <CardContent>
            <div className='flex items-center justify-between'>
                <div className='flex justify-between items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={props?.author?.avatar} className="object-cover"/>
                    </Avatar>
                    <span>{props?.author?.name}</span>
                </div>
                {user && user?.user.role === 'admin' && props?.author?.role === 'admin' &&
                <Badge variant="outline" className="bg-violet-500 text-white">
                    Admin
                </Badge>
                }   
            </div>

            <div className='rounded my-2'>
                <img src={props?.featuredImage} alt={props?.title} className='rounded w-full max-h-[200px] object-cover'/>
            </div>
            
            <div>
                <p className='flex items-center gap-2 mb-2'>
                <FaRegCalendarAlt/>
                <span> {dateFormater(props?.createdAt)} </span>
                </p>
                <h2 className='text-2xl font-bold line-clamp-2'>{props.title}</h2>
            </div>
        </CardContent>
    </Card>
    </Link>
  )
}

export default BlogCard
