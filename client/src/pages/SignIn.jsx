import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignUp } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import GoogleLogin from "@/components/GoogleLogin";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/user/user.slice.js";
import { IoArrowBack } from "react-icons/io5";


const SignIn = () => {


  const navigate =  useNavigate();
  const dispatch = useDispatch();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, "Password filed required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try{
             const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/login`,{
               method:"POST",
               headers:{'Content-type':'application/json'},
               credentials:'include',
               body:JSON.stringify(values),
             })
             const data = await response.json();
             if(!response.ok){
                 showToast("error", data.message);
                 return; 
             }
             showToast("success", data.message);
             dispatch(setUser(data.user))
             setTimeout(() => navigate(RouteIndex), 1500);
   
           }catch(error){
           showToast("error", error.message || "Something went wrong");
           }
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      
      <Card className="w-[400px] p-5 absolute">
        <div className="bg-gray-100 w-fit p-2 rounded-full cursor-pointer" onClick={()=>navigate(RouteIndex)}>
        <IoArrowBack  size={20}/>
        </div>
        <h1 className="text-2xl font-bold text-center mb-5">
          Login Into Account
        </h1>
        <div className="">
          <GoogleLogin/>
          <div className="border-1 my-5 flex justify-center items-center">
            <span className="absolute bg-white px-2 text-sm">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="flex justify-center gap-2 text-sm py-2">
                <p>Don&apos;t have account?</p>
                <Link to={RouteSignUp} className="text-green-600 hover:underline">
                    Sign Up
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
      <div className="w-full h-full">
        {/* <img src={"https://img.freepik.com/free-vector/abstract-wireframe-grid-line-mesh-texture-white-background_1017-58690.jpg?ga=GA1.1.1608483643.1734612034&semt=ais_hybrid&w=740"} alt=""
        className="w-full h-full" /> */}
      </div>
    </div>
  );
};

export default SignIn;
