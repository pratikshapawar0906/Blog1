import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Loder from "../../Components/LoderComponent.jsx/Loder";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId || localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("Token");
        const res = await axios.get(`http://localhost:7000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(res.data.blogs || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load your blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [userId, navigate]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("Token");
      await axios.delete(`http://localhost:7000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog. Please try again later.");
    }
  };

  if (loading) return <Loder />;

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Blogs</h2>

      {blogs.length === 0 ? (
        <p>You have not posted any blogs yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="card mb-4 shadow-sm">
            <div className="card-body d-flex">
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
                  <span>{blog.authorName || "You"}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">{blog.content.substring(0, 250)}...</p>
                <div className="d-flex gap-2">
                  <Link to={`/blog/${blog._id}`} state={{ blog }} className="btn btn-primary btn-sm">
                    Read More
                  </Link>
                  <Link
                    to={`/edit/${blog._id}`}
                    state={{ blog }}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBlog;
