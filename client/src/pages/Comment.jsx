import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/helpers/RouteName'
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

const Comment = () => {

    const [refreshData,setRefreshData] = useState(false);

    const url = `${getEnv('VITE_API_BASE_URL')}/blog/get-all-comment`;
    const {data,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include"
        },[refreshData]
    )

    const handleDelete = async(id)=>{
        const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/commentDelete/${id}`)
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
        <CardContent>
            <Table>

            <TableHeader >
                <TableRow>
                <TableHead className="font-bold">Blog</TableHead>
                <TableHead className="font-bold">Comment By</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Comment</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    data && data.comments.length > 0 ?
                    data.comments.map((comment,index)=>(
                    <TableRow key={comment._id}>
                        <TableCell >
                           {comment?.blogId?.title}
                        </TableCell>
                        <TableCell >
                           {comment?.user?.name} 
                        </TableCell>
                        <TableCell >
                           { dateFormater(comment?.createdAt)} 
                        </TableCell>
                        <TableCell >
                           {comment?.comment} 
                        </TableCell>
                        <TableCell className="flex gap-x-3">
                           {/* <Button variant="outline" asChild>
                                <Link to={RouteEditCategory(comment._id)}>
                                <MdEditSquare/>
                                </Link>
                           </Button> */}
                           <Button variant="outline" 
                            onClick={()=>handleDelete(comment?._id)}
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

export default Comment
