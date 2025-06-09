import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUsers,
} from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const url = `${getEnv("VITE_API_BASE_URL")}/category/all-category`;
  const { data: categoryData } = useFetch(url, {
    method: "get",
    credentials: "include",
  });

  const { user } = useSelector((state) => state.user);

  return (
    <Sidebar className="mt-16">
      <SidebarHeader className="bg-white">
        {/* <img src={logo} alt="logo" width={160}/> */}
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            <Link to={RouteIndex}>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IoHomeOutline />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
            {user && user.isLoggedIn ? (
              <>
                <Link to={RouteBlog}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <GrBlog />
                      Blogs
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
                <Link to={RouteCommentDetails}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FaRegComments />
                      Comments
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>{" "}
              </>
            ) : (
              <></>
            )}

            {user && user.isLoggedIn && user.user.role === "admin" ? (
              <>
                <Link to={RouteCategoryDetails}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MdOutlineCategory />
                      Categories
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>

                <Link to={RouteUsers}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LuUsers />
                      Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              </>
            ) : (
              <></>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categoryData &&
              categoryData?.category?.length > 0 &&
              categoryData?.category.map((category) => (
                <Link
                  to={RouteBlogByCategory(category.slug)}
                  key={category._id}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <GoDot />
                      {category.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
