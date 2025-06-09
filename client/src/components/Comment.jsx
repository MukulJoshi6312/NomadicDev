import React, { useState } from 'react'
import { FaComments } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteSignIn } from '@/helpers/RouteName';
import { auth } from '@/helpers/firebase';
import CommentList from './CommentList';

const Comment = ({props}) => {
    const {user} = useSelector((state)=>state.user);
    const[newComment,setNewComment] = useState();
    
     const formSchema = z.object({
          comment: z.string().min(3,"Comment must be at least 3 character long."),
        });
      
        const form = useForm({
          resolver: zodResolver(formSchema),
          defaultValues: {
            comment: "",
          },
        });

    async function onSubmit(values) {
        try{
            const newValues = {...values,blogId:props.blogId,user:user?.user?._id}
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog/comment`,{
                method:"POST",
                credentials:'include',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify(newValues),
            })
            const data = await response.json();
            if(!response.ok){
                showToast("error", data.message);
                return; 
            }
            setNewComment(data.comment)
            showToast("success", data.message);
            form.reset();
            }catch(error){
            showToast("error", error.message || "Something went wrong");
            }
    }
  return (
    <div>
        <h4 className='flex items-center gap-2 text-2xl font-bold'> 
            <FaComments />
            Comments
        </h4>
        {user && user.isLoggedIn ?
              <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      {/* <Input
                        placeholder="Enter category name"
                        {...field}
                      /> */}
                      <Textarea {...field} placeholde="Type your Comment" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              <Button type="submit" className="">
               Add Comment
              </Button>
          </form>
        </Form> :
        <Button asChild>
            <Link to={RouteSignIn}>
            Sign In
            </Link>
        </Button>
    }

    <div>
        <CommentList props={{blogId:props.blogId,newComment}}/>
    </div>
        
      
    </div>
  )
}

export default Comment
