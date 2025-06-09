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
import { data, Link } from "react-router-dom";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/helpers/showToast";
import {getEnv} from "@/helpers/getEnv.js"
import GoogleLogin from "@/components/GoogleLogin";
import { IoArrowBack } from "react-icons/io5";

const SignUp = () => {

    const navigate = useNavigate();

    const formSchema = z.object({
        name:z.string().min(3,"Name must be at least 3 character long"),
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 character long"),
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Password and confirm password should be the same",
        path: ["confirmPassword"],// attach error to confirmPassword field
        }); 
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email: "",
            password: "",
            confirmPassword:"",
        },
      });
    
      async function onSubmit(values) {    
        try{
          const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`,{
            method:"POST",
            headers:{'Content-type':'application/json'},
            body:JSON.stringify(values),
          })
          const data = await response.json();
          if(!response.ok){
              showToast("error", data.message);
              return; 
          }
          showToast("success", data.message);
          setTimeout(() => navigate(RouteSignIn), 1500);

        }catch(error){
        showToast("error", error.message || "Something went wrong");
        }
      }
  return (
     <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-[400px] p-5 ">
        <div className="bg-gray-100 w-fit p-2 rounded-full cursor-pointer" onClick={()=>navigate(RouteIndex)}>
            <IoArrowBack  size={20}/>
            </div>
        <h1 className="text-2xl font-bold text-center mb-5">
          Create Your Account
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
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
            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full">
                Create
              </Button>
              <div className="flex justify-center gap-2 text-sm py-2">
                <p>Already have account?</p>
                <Link to={RouteSignIn} className="text-green-600 hover:underline">
                    Sign In
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp
