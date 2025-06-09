import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom';
import { RouteSerach } from '@/helpers/RouteName';

const SearchBox = () => {
  const navigate = useNavigate();

  const[query,setQuery] = useState();

  const getInput = (e)=>{
    setQuery(e.target.value)
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    navigate(RouteSerach(query))
  }

  return (
   <form onSubmit={handleSubmit}>

    <Input
      name ="query" onInput={getInput}
      placeholder="Search here..." className="h-9 rounded-full bg-gray-50"
      required
      />

   </form>
  )
}

export default SearchBox
