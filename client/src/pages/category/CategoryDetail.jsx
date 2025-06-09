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

const CategoryDetail = () => {

    const [refreshData,setRefreshData] = useState(false);

    const url = `${getEnv('VITE_API_BASE_URL')}/category/all-category`;
    const {data:categoryData,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include"
        },[refreshData]
    )

    const handleDelete = (id)=>{
        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/category/delete/${id}`)
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
                <Link to={RouteAddCategory}>
                Add Category
                </Link>
            </Button>
        </CardContent>
        </CardHeader>
        <CardContent>
            <Table>

            <TableHeader >
                <TableRow>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Slug</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    categoryData && categoryData.category.length > 0 ?
                    categoryData.category.map((category,index)=>(
                    <TableRow key={category._id}>
                        <TableCell >
                           {category.name}
                        </TableCell>
                        <TableCell >
                           {category.slug} 
                        </TableCell>
                        <TableCell className="flex gap-x-3">
                           <Button variant="outline" asChild>
                                <Link to={RouteEditCategory(category._id)}>
                                <MdEditSquare/>
                                </Link>
                           </Button>
                           <Button variant="outline" 
                        onClick={()=>handleDelete(category?._id)}
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

export default CategoryDetail
