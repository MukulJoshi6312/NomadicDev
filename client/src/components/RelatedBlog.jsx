import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const RelatedBlog = ({ props }) => {



  const url = `${getEnv("VITE_API_BASE_URL")}/blog/get-related-blog/${
    props?.category
  }/${props.currentBlog}`;
  const { data, loading, error } = useFetch(url, {
    method: "get",
    credentials: "include",
  });
  
  if (loading) return <Loading />;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Related Blog</h2>
      <div>
        {data && data.relatedBlog.length > 0 ? (
          data.relatedBlog.map((blog) => {
            return (
              <Link key={blog._id} to={RouteBlogDetails(props.category,blog.slug)} >
                <div className="flex  gap-2 mb-3">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-[100px] h-[70px] object-cover rounded-md"
                  />
                  <h4 className="text-sm font-semibold">{blog.title.slice(0,60)}</h4>
                </div>
              </Link>
            );
          })
        ) : (
          <div>No Related Blog</div>
        )}
      </div>
    </div>
  );
};

export default RelatedBlog;
