import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loder from "../../Components/LoderComponent.jsx/Loder";
import { getValidToken } from "../../util/auth";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [content, setContent] = useState("");
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const { id: BlogId } = useParams();
  const navigate = useNavigate();
  const token = getValidToken(navigate);

  const addCategory = () => {
    if (!cat.trim()) return toast.warn("Category cannot be empty.");
    setCats([...cats, cat.trim()]);
    setCat("");
  };

  const deleteCategory = (i) => {
    const updated = [...cats];
    updated.splice(i, 1);
    setCats(updated);
  };

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (BlogId) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/blogs/${BlogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const blog = res.data;
          setTitle(blog.title || "");
          setContent(blog.content || "");
          setBannerUrl(blog.bannerUrl || "");
          setCats(blog.categories || []);
        })
        .catch(() => toast.error("Failed to load blog details"))
        .finally(() => setLoading(false));
    }
  }, [BlogId, token, navigate]);

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

      setBannerUrl(res.data.secure_url);
      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
    }
  };

  const savePost = async () => {
    const freshToken = getValidToken(navigate);
    if (!freshToken) return;

    try {
      const post = {
        title,
        content,
        bannerUrl,
        status: "published", // Only published now
        categories: cats,
      };

      const url = BlogId
        ? `${process.env.REACT_APP_API_URL}/api/blogs/${BlogId}`
        : `${process.env.REACT_APP_API_URL}/api/blogs`;
      const method = BlogId ? "put" : "post";

      await axios({
        method,
        url,
        data: post,
        headers: {
          Authorization: `Bearer ${freshToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Blog post published successfully!");
      navigate(`/profile/${localStorage.getItem("userId")}`);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  if (loading) return <Loder />;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{BlogId ? "Edit Blog" : "New Blog"}</h5>
        <div>
          <button
            type="submit"
            className="btn btn-dark me-2"
            onClick={savePost}
            disabled={!title || !content}
          >
            Publish
          </button>
          <button
            type="button"
            className="btn btn-outline-primary ms-2"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit Mode" : "Preview Mode"}
          </button>
        </div>
      </div>

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
          {!bannerUrl && <span className="text-muted">Upload banner image</span>}
        </div>
        <input
          type="file"
          className="form-control mt-2"
          accept="image/*"
          onChange={handleBannerUpload}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Categories</label>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Enter category"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addCategory}>
            Add
          </button>
        </div>
        <div className="mt-2">
          {cats.map((c, i) => (
            <span
              key={i}
              className="badge bg-secondary me-2"
              style={{ cursor: "pointer" }}
              onClick={() => deleteCategory(i)}
            >
              {c} &times;
            </span>
          ))}
        </div>
      </div>

      {preview ? (
        // ---------- Preview Mode ----------
        <div className="row">
          <div className="col-md-12">
            <h2>{title}</h2>
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt="banner"
                className="img-fluid mb-3 rounded"
              />
            )}
            <div>
              {cats.map((c, i) => (
                <span key={i} className="badge bg-info me-2">
                  {c}
                </span>
              ))}
            </div>
            <hr />
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>
        </div>
      ) : (
        // ---------- Edit Mode ----------
        <>
          <div className="mb-3">
            <label htmlFor="blogTitle" className="form-label">
              Blog Title
            </label>
            <input
              type="text"
              id="blogTitle"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="blogContent" className="form-label">
              Blog Content
            </label>
            <textarea
              id="blogContent"
              className="form-control"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Let’s write an awesome story!"
              required
            ></textarea>
          </div>
        </>
      )}
    </div>
  );
};

export default PostForm;
