import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteBlogAdd, RouteBlogEdit, RouteEditCategory } from '@/helpers/RouteName'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { icons } from 'lucide-react'
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'
import dateFormater from '@/helpers/dateFormater'


const BlogDetails = () => {
    const [refreshData,setRefreshData] = useState(false);

    const url = `${getEnv('VITE_API_BASE_URL')}/blog/get-all`;
    const {data:blogData,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include"
        },[refreshData]
    )

    const handleDelete = (id)=>{
        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
        if(response){
            setRefreshData(!refreshData);
            showToast('success',"Data deleted")
        }else{
            showToast('error',"Data not deleted")
        }
    }


    if(loading) return <Loading/>
  return (
     <div>
      <Card>
        <CardHeader>
        <CardContent>
            <Button asChild>
                <Link to={RouteBlogAdd}>
                    Create Blog
                </Link>
            </Button>
        </CardContent>
        </CardHeader>
        <CardContent>
            <Table>

            <TableHeader >
                <TableRow>
                <TableHead className="font-bold">Author</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Title</TableHead>
                <TableHead className="font-bold">Slug</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    blogData && blogData.blog.length > 0 ?
                    blogData.blog.map((blog,index)=>(
                    <TableRow key={blog._id}>
                        <TableCell >
                           {blog?.author?.name}
                        </TableCell>
                        <TableCell >
                           {blog?.category?.name}
                        </TableCell>
                        <TableCell >
                           {blog?.title?.slice(0,30)}... 
                        </TableCell>
                        <TableCell >
                           {blog?.slug?.slice(0,20)} 
                        </TableCell>
                        <TableCell >
                            {dateFormater(blog?.createdAt)}
                        </TableCell>
                        <TableCell className="flex gap-x-3">
                           <Button variant="outline" asChild>
                                <Link to={RouteBlogEdit(blog?._id)}>
                                <MdEditSquare/>
                                </Link>
                           </Button>
                           <Button variant="outline" 
                            onClick={()=>handleDelete(blog?._id)}
                           >
                                <MdDelete/>
                           </Button>
                        </TableCell>
                    </TableRow>
                    ))
                    :<>
                    <TableRow>
                        <TableCell colSpan="3">
                            Category not found
                        </TableCell>
                    </TableRow>
                    </>
                }
                
            </TableBody>
            </Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails
