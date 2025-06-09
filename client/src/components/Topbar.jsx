import React, { useState } from "react";
import logo from "@/assets/BlogLogo.png";
import logo1 from "@/assets/logo.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { getEnv } from "@/helpers/getEnv";
import { removeUser, setUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showToast";
import { IoMdSearch } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { useSidebar } from "./ui/sidebar";



const Topbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[showSearch,setShowSearch] = useState(false);
  const {toggleSidebar} = useSidebar();
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        return; 
      }
      showToast("success", data.message);
      dispatch(removeUser());
      setTimeout(() => navigate(RouteIndex), 1500);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  };

  const toggleSearch =()=>{
    setShowSearch(!showSearch);
  }
  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b">
       
       <div className="gap-x-3 flex items-center">
        <button type="button" className="md:hidden" onClick={toggleSidebar}>
          <MdMenu size={25}/>
        </button>
     <Link to={RouteIndex}>
        <img src={logo1} alt="logo" className="w-40 min-w-30 h-16 object-cover " />
      </Link>
      </div>
      <div className="w-[500px]">
        <div className={`md:relative md:block absolute bg-white left-0 w-full top-16 p-5 md:p-0 md:top-0 ${showSearch? 'block' :'hidden'}`}>
        <SearchBox />
        </div>
      </div>
      <div className="flex items-center gap-5">

        <button 
        onClick={toggleSearch}
        type="button" className="md:hidden block">
          <IoMdSearch size={25}/>
        </button>

        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full">
            <Link to={RouteSignIn}>
              <MdLogin />
              Sign In
            </Link>
          </Button>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user?.user?.avatar || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p>{user?.user?.name}</p>
                  <p className="text-xs">{user?.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={RouteProfile}>
                    <FaRegUser />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={RouteBlogAdd}>
                    <FaPlus />
                    Create Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <MdLogout color="red" />
                    Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
