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
import { useNavigate } from "react-router-dom";
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

const AddBlog = () => {
  const {user} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const url = `${getEnv("VITE_API_BASE_URL")}/category/all-category`;
  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(url, {
    method: "get",
    credentials: "include",
  });

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
      const newValues = {...values,author:user?.user?._id}
      if(!file){
        showToast('error',"Feature image required!")
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      const url = `${getEnv("VITE_API_BASE_URL")}/blog/add`;

      const response = await fetch(url, {
        method: "Post",
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
  return (
    <Card className="pt-5 max-w-screen-md mx-auto">
      <CardContent>
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
                        defaultValues={field.value}
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

            <div className="mb-3">
              {/* <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl> */}
                 <Editor props={{ initialData: "", onChange: handleEditorData }} />
              {/* </FormControl>
                    <FormMessage />
                  </FormItem>
                )} */}
              {/* /> */}
            </div>

            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBlog;
