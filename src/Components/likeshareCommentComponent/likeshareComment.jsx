import { useState, useEffect } from "react";

const LikeShareComment = ({ blogId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load likes & comments only when blogId is valid
  useEffect(() => {
    if (!blogId) return; // don't run until we have a blogId

    const savedComments = JSON.parse(localStorage.getItem(`comments_${blogId}`));
    const savedLikes = JSON.parse(localStorage.getItem(`likes_${blogId}`));

    if (savedComments !== null) setComments(savedComments);
    if (savedLikes  !== null) setLikeCount(savedLikes);
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
    localStorage.setItem(`likes_${blogId}`, JSON.stringify(likeCount));
  }, [blogId, likeCount, isLoaded]);

  const handleLike = () => setLikeCount(prev => prev + 1);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments(prev => [...prev, comment]);
      setComment("");
    }
  };
  const handleDeleteComment = (indexToDelete) => {
    setComments(prevComments => prevComments.filter((_, idx) => idx !== indexToDelete));
  };


  return (
    <div>
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
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{c}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteComment(index)}
                  aria-label="Delete comment"
                  title="Delete comment"
                >
                  🗑️
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
