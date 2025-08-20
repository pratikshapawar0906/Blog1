
let blogState = {
  "1": { likes: 2, comments: [], isLiked: false },
};
export const data = async(req, res) => {
  const blogId = req.params.id;
  res.json(blogState[blogId] || { likes: 0, comments: [], isLiked: false });
};

export const Comments=async(req, res) => {
  const blogId = req.params.id;
  const newComment = { id: Date.now(), text: req.body.text, timestamp: new Date() };
  if (!blogState[blogId]) blogState[blogId] = { likes: 0, comments: [], isLiked: false };
  blogState[blogId].comments.push(newComment);
  res.json(newComment);
};

export const likes=async(req, res) => {
  const blogId = req.params.id;
  if (!blogState[blogId]) blogState[blogId] = { likes: 0, comments: [], isLiked: false };
  const blog = blogState[blogId];
  blog.isLiked = !blog.isLiked;
  blog.likes += blog.isLiked ? 1 : -1;
  if (blog.likes < 0) blog.likes = 0;
  res.json({ likeCount: blog.likes, isLiked: blog.isLiked });
};