import { useState, useEffect } from "react";

const LikeShareComment = ({ blogId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load likes & comments only when blogId is valid
  useEffect(() => {
    if (!blogId) return;

    const savedComments = JSON.parse(localStorage.getItem(`comments_${blogId}`));
    const savedLiked = JSON.parse(localStorage.getItem(`likes_${blogId}`));

    if (savedComments !== null) setComments(savedComments);
    if (savedLiked !== null) setLikeCount(savedLiked);

    setIsLoaded(true);
  }, [blogId]);

  // Save comments
  useEffect(() => {
    if (!blogId || !isLoaded) return;
    localStorage.setItem(`comments_${blogId}`, JSON.stringify(comments));
  }, [blogId, comments, isLoaded]);

  // Save likes
  useEffect(() => {
    if (!blogId || !isLoaded) return;
    localStorage.setItem(`liked_${blogId}`, JSON.stringify(isLiked));
  }, [blogId, isLiked, isLoaded]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  //  Blog-specific Share URL
  const handleShare = () => {
    const blogUrl = `${window.location.origin}/blog/${blogId}`;
    navigator.clipboard.writeText(blogUrl).then(() => {
      // Use a toast library or temporary state
      setShareMessage("Link copied!");
      setTimeout(() => setShareMessage(""), 2000);
    });
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = { 
        id: Date.now(), 
        text: comment.trim(), 
        timestamp: new Date().toISOString() 
      };
      setComments(prev => [...prev, newComment]);
      setComment("");
    }
  };


  const handleDeleteComment = (idToDelete) => {
    setComments(prev => prev.filter(c => c.id !== idToDelete));
  };


  return (
    <div>
      <div className="blog-actions mt-4 d-flex gap-3">
        <button className="btn btn-outline-primary"aria-live="polite" onClick={handleLike}>
          <i className="bi bi-like"></i>  Like ({likeCount})
        </button>
        <button className="btn btn-outline-success"aria-live="polite" onClick={handleShare}>
          <i className="bi bi-share"></i> Share
        </button>
      </div>
      {shareMessage &&(
        <p className="text-success mt-2">{shareMessage}</p>
      )

      }

      <hr className="my-4" />

      <div className="comments-section">
        <h5><i className="bi bi-chat-dots"></i> Comments</h5>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            //  Ctrl + Enter submits
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") handleAddComment();
            }}
            placeholder="Write a comment... (Ctrl + Enter to submit)"
          ></textarea>
          <button className="btn btn-primary mt-2" onClick={handleAddComment}>
            Add Comment
          </button>
        </div>

        {comments.length > 0 ? (
          <ul className="list-group">
            {comments.map((c, index) => (
              <li
                key={c.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{c.text}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteComment(index)}
                  aria-label="Delete comment"
                  title="Delete comment"
                >
                   <i className="bi bi-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default LikeShareComment;
