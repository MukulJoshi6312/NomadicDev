import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

const AuthRouteProtection = () => {
    //  useNavigate()

    const {user} = useSelector((state)=>state.user);
    if(user && user.isLoggedIn){
    return (
        <Outlet/>
    )}else{
    return  <Navigate to={RouteSignIn} />
  }
}

export default AuthRouteProtection
