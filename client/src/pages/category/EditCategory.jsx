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
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import slugify from "slugify";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { RouteCategoryDetails } from "@/helpers/RouteName";

const EditCategory = () => {

  const {categoryId} = useParams();
  const navigate = useNavigate();

    const url = `${getEnv('VITE_API_BASE_URL')}/category/show/${categoryId}`;
    const {data:categoryData,loading,error} = useFetch(url,
        {
            method:"get",
            credentials:"include"
        },[categoryId]
    )

    const formSchema = z.object({
      name: z.string().min(3,"Name must be at least 3 character long."),
      slug: z.string().min(3,"Slug must be at least 3 character long.")
    });
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        slug: "",
      },
    });
  
    async function onSubmit(values) {
      try{
               const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/update/${categoryId}`,{
                 method:"PUT",
                 headers:{'Content-type':'application/json'},
                 credentials:'include',
                 body:JSON.stringify(values),
               })
               const data = await response.json();
               if(!response.ok){
                   showToast("error", data.message);
                   return; // ⛔️ stop execution if error
               }
              //  console.log("Parsed Data", data); // ✅ Actual useful response
               showToast("success", data.message);
              //  dispatch(setUser(data.user))
               setTimeout(() => navigate(RouteCategoryDetails), 1500);
             }catch(error){
             showToast("error", error.message || "Something went wrong");
             }
      console.log(values);
    }

    
    const categoryName = form.watch("name");
    useEffect(()=>{
      if(categoryName){
        const slug = slugify(categoryName,{lower:true})
        form.setValue('slug',slug)
      }
    },[categoryName])

    useEffect(()=>{
        if(categoryData){
          form.setValue("name",categoryData?.category?.name)
          form.setValue("slug",categoryData?.category?.slug)
        }
    },[categoryData])

    if(loading) return <Loading/>
  return (
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
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
                        placeholder="Enter category name"
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter slug name" {...field} readOnly/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
          </form>
        </Form>
        </CardContent>
      </Card>
  )
}

export default EditCategory
