import React, { useState, useEffect } from "react";  // <-- Import hooks here
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Loder from "../../Components/LoderComponent.jsx/Loder";
import { toast, ToastContainer } from "react-toastify";
import { getValidToken } from "../../util/auth";

const EditPost = () => {    // <-- Rename component to PascalCase
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = getValidToken(navigate);
  const blogFromState = location.state?.blog;

  // const [, setBlog] = useState(blogFromState || null);
  const [loading, setLoading] = useState(!blogFromState);
  const [saving, setSaving] = useState(false);
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
          if (!token) {
            navigate("/login");
            return;
          }
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
  }, [id, blogFromState,navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("bannerImage", file);
  
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/blogbanner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setForm((prev) => ({ ...prev, bannerUrl: res.data.secure_url }));
      toast.success("Banner image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image.");
    }
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
   setSaving(true);
  const token = getValidToken(navigate);
  if (!token) return;

  if (!form.title.trim()) return toast.error("Title is required.");
  if (!form.content.trim()) return toast.error("Content is required.");
  if (!form.bannerUrl) return toast.error("Banner image is required.");


  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/blogs/${id}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Blog updated successfully!");
    navigate(`/blog/${id}`);
  } catch (err) {
     setSaving(false);
    console.error("Update failed:", err);
    toast.error(err.response?.data?.message || "Failed to update blog.");
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
          <label className="form-label">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleBannerUpload}
          />
          {form.bannerUrl && (
            <img
              src={form.bannerUrl}
              alt="Banner Preview"
              className="img-fluid mt-2 rounded"
              style={{ maxHeight: "200px" }}
            />
          )}
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

        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Updating..." : "Update Blog"}
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default EditPost;    
