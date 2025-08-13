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
  const limit = parseInt(req.query.limit) || 100;
  const category = req.query.category;

  try {
     // Build filter object
    let filter = {};
    if (category) {
      // Match category exactly
      filter.categories = category;
    }

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

// export const uplodUrl= async (req, res) => {
//   const { imageUrl } = req.body;

//   if (!imageUrl) {
//     return res.status(400).json({ message: 'Image URL is required' });
//   }

//   try {
//     const uploadedResponse = await cloudinary.uploader.upload(imageUrl, {
//       folder: 'blog_banners',
//     });

//     return res.status(200).json({ secure_url: uploadedResponse.secure_url });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({ message: 'Failed to upload image from URL' });
//   }
// }

// POST - Upload blog banner image (file upload)
export const blogPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // multer-storage-cloudinary already uploaded it to Cloudinary
    return res.status(200).json({ secure_url: req.file.path });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
};

export const getBlogByUserId=async (req, res) => {
  const { userId } = req.params;

  try {
    // Find blogs where author/user field matches userId
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).json({ message: "Server error fetching user's blogs" });
  }
};

export const deleteBlogbyId= async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id; // assuming you set this in authenticateToken middleware

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Server error deleting blog" });
  }
};

