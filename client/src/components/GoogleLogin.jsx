import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { RouteIndex } from '@/helpers/RouteName';
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useNavigate } from 'react-router-dom';
import { setUser } from "@/redux/user/user.slice.js";
import { useDispatch } from 'react-redux';



const GoogleLogin = () => {
    const dispatch = useDispatch();


    const navigate = useNavigate();
    const handleLogin = async()=>{
          try{
            const googleResponse = await signInWithPopup(auth,provider);
            const user = googleResponse.user;
            const bodyData = {
                name:user.displayName,
                email:user.email,
                avatar:user.photoURL,
            }
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/google-login`,{
            method:"POST",
            headers:{'Content-type':'application/json'},
            credentials:'include',
            body:JSON.stringify(bodyData),
            })
            const data = await response.json();
            if(!response.ok){
                showToast("error", data.message);
                return; // ⛔️ stop execution if error
            }
            showToast("success", data.message);
            dispatch(setUser(data.user))
            setTimeout(() => navigate(RouteIndex), 1500);

        }catch(error){
        showToast("error", error.message || "Something went wrong");
        }
    }
  return (
    <div>
      <Button variant="outline" className="w-full" onClick={handleLogin}>
        <FcGoogle/>
        Continue With Google
      </Button>
    </div>
  )
}

export default GoogleLogin
