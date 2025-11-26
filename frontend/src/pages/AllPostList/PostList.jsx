import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loder from "../../Components/LoderComponent.jsx/Loder";
import { FaCalendarAlt, FaEye, FaFire, FaThumbsUp, FaTrophy } from "react-icons/fa";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState([]);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const activeCategory = params.get("category");
  const searchQuery = params.get("search");
  const navigate = useNavigate();
 
  //  Fetch all blogs
  const fetchBlogs = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/AllPost`, {
          params: {
            page,
            limit: 4,
            category: activeCategory,
            search: searchQuery,
          },
        });
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);

        const cata = res.data.blogs.flatMap((item) => item.categories || []);
        const sets = new Set();
        cata.forEach((category) => {
          if (category) sets.add(category);
        });
        setCat(Array.from(sets));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory, searchQuery]
  );

  const fetchRecentBlogs = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/recent`);
      
      let data = res.data.blogs;
  
      // Convert single object → array
      if (data && !Array.isArray(data)) {
        data = [data];
      }
  
      // Only show 1 recent blog
      setRecentBlogs(data.slice(0, 1));
    } catch (err) {
      console.error("Error fetching recent blogs:", err);
      setRecentBlogs([]);
    }
  }, []);


  
  const fetchTrendingBlogs = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/trending`);
      
      let data = res.data.blogs || res.data.trendingBlogs;
  
      // Convert single object → array
      if (data && !Array.isArray(data)) {
        data = [data];
      }
  
      // Only show first 4 trending blogs
      setTrendingBlogs(data.slice(0, 4));
    } catch (err) {
      console.error("Error fetching trending blogs:", err);
      setTrendingBlogs([]);
    }
  }, []);

  


  useEffect(() => {
    fetchBlogs(page);
    fetchRecentBlogs();
    fetchTrendingBlogs();
  }, [page, fetchBlogs, fetchRecentBlogs, fetchTrendingBlogs]);

  const handleCategoryClick = (category) => {
    navigate(`?category=${encodeURIComponent(category)}`);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          {loading ? (
            <Loder />
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="card mb-4 shadow-sm">
                <div className="card-body d-flex" style={{padding:"24px"}}>
                  {blog.bannerUrl && (
                    <img
                      src={blog.bannerUrl}
                      alt={blog.title}
                      className="rounded"
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        marginRight: "15px",
                      }}
                    />
                  )}

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-2 text-muted">
                      <span>{blog.authorName}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h5 className="card-title" style={{color:"#341cd0ff", fontSize:"24px"}}>{blog.title}</h5>
                    <p className="card-text">
                      {blog.content.length > 250
                        ? blog.content.substring(0, 250) + "..."
                        : blog.content}
                    </p>
                    <Link
                      to={`/blog/${blog._id}`}
                      state={{ blog }}
                      className="btn btn-warning btn-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-center font-bold mt-16">No Posts available</h3>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center my-3">
            <button
              onClick={handlePrev}
              disabled={page === 1 || loading}
              className="btn btn-danger mx-1"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`btn mx-1 ${
                    pageNumber === page
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  disabled={loading}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={page === totalPages || loading}
              className="btn btn-danger mx-1"
            >
              Next
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* 🔹 Categories */}
          <div className="p-3">
            <h5 className="mb-3">Categories</h5>
            {cat.length > 0 &&
              cat.map((category) => (
                <button
                  key={category}
                  className={`btn m-1 ${
                    activeCategory === category
                      ? "btn-primary"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
          </div>

          {/* 🔹 Recent Blogs */}
          <div className="p-3 bg-white rounded shadow-sm">
            <h5 className="mb-3 d-flex align-items-center gap-1">  <FaCalendarAlt style={{ color: "#6c757d" }} />Recent Blogs</h5>
            
            {recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
              >
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-dark"
                  style={{ fontSize: "20px", textDecoration:"none" }}
                >
                  {blog.title}
                </Link>
          
                <span className="text-muted small d-flex align-items-center gap-1">
                  <FaCalendarAlt style={{ color: "#6c757d" }} />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>



          {/* 🔹 Trending Blogs */}
          <div className="p-3 bg-white rounded shadow-sm mt-4">
           <h5 className="mb-3 d-flex align-items-center gap-2">
             <FaFire style={{ color: "#ff4500" }} /> Trending Blogs
           </h5>
          
            {trendingBlogs.map((blog,index) => (
              <div
                key={blog._id}
                className="d-flex justify-content-between align-items-center border-bottom py-2"
                style={{
                  background: index === 0 ? "#fff6e6" : "transparent", // Highlight bg for top post
                }}

              >
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-dark d-flex align-items-center gap-2"
                  style={{
                    fontSize: index === 0 ? "18px" : "16px",
                    fontWeight: index === 0 ? "600" : "400",
                    textDecoration: "none",
                  }}
                >
                   {index === 0 && <FaTrophy style={{ color: "#ff9800" }} />}
                  {blog.title}
                </Link>
          
                 <span className="text-muted small d-flex align-items-center gap-2">
                   <span className="d-flex align-items-center gap-1">
                     <FaThumbsUp style={{ color: "#28a745" }} /> {blog.likes}
                   </span>
                   |
                   <span className="d-flex align-items-center gap-1">
                     <FaEye  style={{ color: "#2585d9ff" }} /> {blog.views}
                   </span>
                 </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogPage;
