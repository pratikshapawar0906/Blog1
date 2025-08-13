import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loder from "../../Components/LoderComponent.jsx/Loder";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1); // current page number
  const [totalPages, setTotalPages] = useState(1); // total pages from backend
  const [, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState([]);
  const{search} =useLocation();
  const navigate = useNavigate();


  const fetchBlogs = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/AllPost?page=${page}&limit=100${search || ""}`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
      setError("");
      const cata = res.data.blogs.map((item) => item.categories).flat();
      const sets = new Set();
      cata.forEach((category) => { if (category) sets.add(category); });
      setCat(Array.from(sets));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [search]);
  
  useEffect(() => {
    fetchBlogs(page);
  }, [page, search, fetchBlogs]);


  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    //  filter or route based on category here
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
                <div className="card-body d-flex">
                  {/* Blog Image */}
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
          
                  {/* Blog Info */}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-2 text-muted">
                      <span>{blog.authorName}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text">
                      {blog.content.substring(0, 250)}...
                    </p>
                    <Link
                      to={`/blog/${blog._id}`}
                      state={{ blog }}
                      className="btn btn-primary btn-sm"
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



          {/* Pagination Buttons */}
          <div className="d-flex justify-content-between">
           <button onClick={handlePrev} disabled={page === 1 || loading} className="btn btn-secondary">
             Previous
           </button>
           <button onClick={handleNext} disabled={page === totalPages || loading} className="btn btn-secondary">
             Next
           </button>

          </div>
          <div className="text-center my-2">
            Page {page} of {totalPages}
          </div>

        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          {/* my categories/trending section here, same as before */}
            <div className="p-3 m-5 flex flex-wrap justify-center">
              {cat.length > 0 && cat.map((category) => (
                <button
                  key={category}
                  className="p-3 m-2 h-[90px] w-[150px] border text-lg font-semibold hover:shadow-blue-200 shadow"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}

            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
