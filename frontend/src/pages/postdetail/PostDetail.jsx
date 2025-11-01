import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './pdetail.css';
import LikeShareComment from "../../Components/likeshareCommentComponent/likeshareComment";
import { FaClock, FaUserEdit } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const blogFromState = location.state?.blog;

  const [blog, setBlog] = useState(blogFromState || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!blogFromState) {
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem("Token");
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setBlog(res.data.blog);
        } catch (error) {
          setError("Failed to load blog post. Please try again later.");
        }
      };
      fetchBlog();
    }
  }, [id, blogFromState]);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!blog) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container my-5 pdetail-container">
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">← Back to Home</button>

      <div className="card shadow-lg rounded p-4">
        <h1 className="blog-title mb-3">{blog.title}</h1>
        <p className="blog-meta text-muted mb-4 d-flex align-items-center gap-3 justify-content-between">
          <span className="d-flex align-items-center gap-1">
            <FaUserEdit style={{ color: "#0d6efd", fontSize:"28px" }} /> {blog.author?.email}
          </span>
        
          <span className="d-flex align-items-center gap-1">
            <FaClock style={{ color: "#6c757d", fontSize:"28px", }} /> {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </p>


        <img
          src={blog.bannerUrl}
          alt="Blog Banner"
          className="img-fluid rounded blog-banner mb-4"
        />

        <div className="blog-content">
          <p>{blog.content}</p>
        </div>

        {/* Likes, share & comments */}
        <LikeShareComment blogId={id} />
      </div>
    </div>
  );
};

export default BlogDetail;
