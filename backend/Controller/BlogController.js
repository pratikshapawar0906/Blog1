import Blog from "../model/BlogSchema.js";

// POST - create blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, bannerUrl, status } = req.body;
    const blog = new Blog({
      title,
      content,
      bannerUrl,
      status,
      author: req.user._id,
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// PUT - update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.author.equals(req.user._id))
      return res.status(403).json({ message: "You can't edit this blog" });

    const { title, content, bannerUrl, status } = req.body;

    blog.title = title;
    blog.content = content;
    blog.bannerUrl = bannerUrl;
    blog.status = status;

    await blog.save();
    res.json({ message: "Blog updated", blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog" });
  }
};

// GET - get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

export const AllPost=async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ blogs, totalPages });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server error fetching blogs" });
  }
};