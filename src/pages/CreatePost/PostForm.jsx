import React, {  useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [content, setContent] = useState('');

  const { id: BlogId } = useParams();
  const token = localStorage.getItem('Token'); 
  const navigate = useNavigate();


   useEffect(() => {
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
    
      if (BlogId) {
        axios
          .get(`http://localhost:7000/api/blogs/${BlogId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const blog = res.data;
            setTitle(blog.title);
            setContent(blog.content);
            setBannerUrl(blog.bannerUrl);
          })
          .catch((err) => {
            toast.error("Failed to load blog details");
            console.error(err);
          });
      }
    }, [BlogId, token, navigate]);

  

  const savePost = async (status) => {
    try {
      const post = {
        title,
        content,
        bannerUrl,
         status, // should be either 'draft' or 'published'
        };
      
        const url = BlogId
          ? `http://localhost:7000/api/blogs/${BlogId}`
          : `http://localhost:7000/api/blogs`; 

    const method = BlogId ? 'put' : 'post';
    
    const res = await axios({
      method,
      url,
      data: post,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

      console.log(res.data);
      toast.success('Blog post saved successfully!');
      navigate('/profile/${localStorage.getItem("userId")}'); 
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Something went wrong!');
    }

    
  };
  
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{BlogId ? "Edit Blog" : "New Blog"}</h5>
        <div>
          <button
            type="submit"
            className="btn btn-dark me-2"
            onClick={() => savePost('published')}
            disabled={!title || !content}
          >
            Publish
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => savePost('draft')}
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* Blog Banner */}
      <div className="mb-4">
      <div
        className="border rounded bg-light d-flex justify-content-center align-items-center"
        style={{
          height: "400px",
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
        }}
      >
        
        {!bannerUrl && (
          <span className="text-muted">Upload or paste banner URL</span>
        )}
      </div>
      
      <input
        type="text"
        className="form-control mt-2"
        placeholder="Enter banner image URL"
        value={bannerUrl}
        onChange={(e) => setBannerUrl(e.target.value)}
      />
      
      
      </div>

      {/* Blog Title */}
      <div className="mb-3">
        <label htmlFor="blogTitle" className="form-label">
          Blog Title
        </label>
        <input
          type="text"
          id="blogTitle"
          className="form-control"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          required
        />
      </div>

      {/* Blog Content */}
      <div className="mb-3">
        <label htmlFor="blogContent" className="form-label">
          Blog Content
        </label>
        <textarea
          id="blogContent"
          className="form-control"
          rows="10"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Let’s write an awesome story!"
          required
        ></textarea>
      </div>
    </div>
  );
};

export default PostForm;
