import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './pdetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:7000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        setError("Failed to load blog post. Please try again later.");
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = () => setLikeCount(prev => prev + 1);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      setComments(prev => [...prev, comment]);
      setComment("");
    }
  };

  


  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!blog) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container my-5 pdetail-container">
      <button onClick={() => navigate("/")} className="btn btn-secondary mb-3">← Back to Home</button>

      <div className="card shadow-lg rounded p-4">
        <h1 className="blog-title mb-3">{blog.title}</h1>
        <p className="blog-meta text-muted mb-4">
          ✍️ {blog.author?.email} | 🕒 {new Date(blog.createdAt).toLocaleDateString()}
        </p>

        <img
          src={blog.bannerUrl}
          alt="Blog Banner"
          className="img-fluid rounded blog-banner mb-4"
        />

        

        <div className="blog-content">
          <p>{blog.content}</p>
        </div>

        <div className="blog-actions mt-4 d-flex gap-3">
          <button className="btn btn-outline-primary" onClick={handleLike}>
            👍 Like ({likeCount})
          </button>
          <button className="btn btn-outline-success" onClick={handleShare}>
            🔗 Share
          </button>
        </div>

        <hr className="my-4" />

        <div className="comments-section">
          <h5>💬 Comments</h5>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>

          {comments.length > 0 ? (
            <ul className="list-group">
              {comments.map((c, index) => (
                <li key={index} className="list-group-item">
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
