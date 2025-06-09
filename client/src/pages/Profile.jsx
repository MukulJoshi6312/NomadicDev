import { Card, CardContent } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/user/get-user/${user?.user?._id}`,
    {
      method: "get",
      credentials: "include",
    }
  );


  const avatar = userData?.user?.avatar;
  const name = userData?.user?.name;
  const email = userData?.user?.email;
  const bio = userData?.user?.bio;

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long."),
    email: z.string().email(),
    bio: z.string().min(3, "bio must be at least 3 character long."),
    password: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  async function onSubmit(values) {

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const url = `${getEnv("VITE_API_BASE_URL")}/user/update-user/${
        userData?.user?._id
      }`;

      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

       const data = await response?.json();
        if(!response.ok){
            showToast("error", data.message);
            return;
        }
        if (response.status === 204) {
          return; // ❌ toast bhi mat dikhana
        } 
        dispatch(setUser(data.user))
        showToast("success", data.message);
    } catch (error) {
      console.error("❌ Error in fetch:", error);
      showToast("error", error.message || "Something went wrong");
    }
  }

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name,
        email,
        bio,
      });
    }
  }, [userData]);

  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  };

  return (
    <Card className="max-w-screen-md mx-auto py">
      {loading && <Loading />}

      <CardContent>
        <div className="flex justify-center items-center mt-10">
          <Dropzone
            onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage
                    src={
                      filePreview
                        ? filePreview
                        : avatar || "https://github.com/shadcn.png"
                    }
                    className="object-cover"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black opacity-60 border-green-500 border-2 rounded-full w-full h-full group-hover:flex hidden justify-center items-center cursor-pointer">
                    <FaCamera size={24} className="text-green-500" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>
        <div>
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
                        <Input placeholder="Enter your name" {...field} />
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
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your bio" {...field} />
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
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
