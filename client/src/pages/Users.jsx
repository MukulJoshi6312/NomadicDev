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
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { FaUserCircle } from "react-icons/fa";


const Users = () => {

    const [refreshData,setRefreshData] = useState(false);
    const url = `${getEnv('VITE_API_BASE_URL')}/user/get-all-users`;
    const {data,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include"
        },[refreshData]
    )

    const handleDelete = async(id)=>{
        const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`)
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
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Avatar</TableHead>
                <TableHead className="font-bold">Dated</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    data && data.users.length > 0 ?
                    data.users.map((user,index)=>(
                    <TableRow key={user._id}>
                        <TableCell className="capitalize">
                           {user?.role}
                        </TableCell>
                        <TableCell >
                           {user?.name} 
                        </TableCell>
                        <TableCell >
                           {user?.email} 
                        </TableCell>
                        <TableCell >
                            <Avatar>
                                {user?.avatar  ? 
                            <img src={user?.avatar } alt="" className='w-10 rounded-full h-10' />
                                :<img src="https://github.com/shadcn.png" /> 
                                }

                            </Avatar>
                            {/* <img src={user?.avatar} alt="" className='w-10 rounded-full h-10' /> */}
                        </TableCell>
                        <TableCell >
                           { dateFormater(user?.createdAt)} 
                        </TableCell>
                        <TableCell className="flex gap-x-3">
                           <Button variant="outline" 
                            onClick={()=>handleDelete(user?._id)}
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

export default Users
