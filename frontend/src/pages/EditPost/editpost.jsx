import React, { useState, useEffect } from "react";  // <-- Import hooks here
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Loder from "../../Components/LoderComponent.jsx/Loder";

const EditPost = () => {    // <-- Rename component to PascalCase
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const blogFromState = location.state?.blog;

  const [blog, setBlog] = useState(blogFromState || null);
  const [loading, setLoading] = useState(!blogFromState);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    bannerUrl: "",
  });

  useEffect(() => {
    if (!blogFromState) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("Token");
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBlog(res.data);
          setForm({
            title: res.data.title || "",
            content: res.data.content || "",
            bannerUrl: res.data.bannerUrl || "",
          });
          setError("");
        } catch (err) {
          setError("Failed to load blog for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    } else {
      setForm({
        title: blogFromState.title || "",
        content: blogFromState.content || "",
        bannerUrl: blogFromState.bannerUrl || "",
      });
    }
  }, [id, blogFromState]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/blogs/${id}`,
        { ...form },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Blog updated successfully!");
      navigate("/myblogs");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update blog. Please try again later.");
    }
  };

  if (loading) return <Loder />;

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            type="text"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Banner URL</label>
          <input
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
            type="text"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="8"
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditPost;    
