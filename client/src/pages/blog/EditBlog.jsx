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
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import slugify from "slugify";
import { useNavigate, useParams } from "react-router-dom";
import { RouteBlog, RouteCategoryDetails } from "@/helpers/RouteName";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";
import { decode } from "entities";
import Loading from "@/components/Loading";

const Edit = () => {

  
  const {user} = useSelector((state)=>state.user)
  const {blogId} = useParams()

  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const url = `${getEnv("VITE_API_BASE_URL")}/category/all-category`;
  const {
    data: categoryData,
    error,
  } = useFetch(url, {
    method: "get",
    credentials: "include",
  });

  const {data:blogData,loading} = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/edit/${blogId}`,
    {
    method: "get",
    credentials: "include",
  },[blogId]
  )


  const formSchema = z.object({
    category: z.string().min(3, "Category must be at least 3 character long."),
    title: z.string().min(3, "Title must be at least 3 character long."),
    slug: z.string().min(3, "Slug must be at least 3 character long."),
    blogContent: z.string().min(3, "Blog must be at least 3 character long."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });



  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    form.setValue("blogContent", data);
  };

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const url = `${getEnv("VITE_API_BASE_URL")}/blog/update/${blogId}`;
      

      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response?.json();
      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      if (response.status === 204) {
        return; 
      }
      
      form.reset();
      setFile()
      setFilePreview()
      navigate(RouteBlog)
      showToast("success", data.message);
    } catch (error) {
      console.error("Error in fetch:", error);
      showToast("error", error.message || "Something went wrong");
    }
  }

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  };

  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  useEffect(()=>{
    if(blogData){
      setFilePreview(blogData?.blog?.featuredImage)
      form.setValue('category',blogData?.blog?.category?._id) 
      form.setValue('title',blogData?.blog?.title) 
      form.setValue('slug',blogData?.blog?.slug)
      form.setValue('blogContent',decode(blogData?.blog?.blogContent))
    }
  },[blogData])

  if(loading) return <Loading/>
  return (
    <Card className="pt-5 max-w-screen-md mx-auto">
      <CardContent>
              <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mb-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData &&
                            categoryData.category.length > 0 &&
                            categoryData.category.map((category) => (
                              <SelectItem
                                value={category._id}
                                key={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} />
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
                      <Input
                        placeholder="Enter slug name"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <span className="mb-2 block text-sm">Select Image</span>
              <Dropzone
                onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="flex justify-center items-center w-36 h-36 border-2 border-dashed rounded-2xl">
                      <img src={filePreview} alt="file preview" />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>

            <div className="mb-3 max-w-screen-md mx-auto">
               <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <>
                    <Editor props={{initialData: decode(field.value), onChange: handleEditorData }} />

                  </>
                )} 
              /> 
            </div>

            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Edit;
