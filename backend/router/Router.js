import express from "express";
import { getUserProfile, loginUser, registerUser, updateProfile, uploadProfilePhoto } from "../Controller/UserController.js";
import authMiddleware from "../Middlewarw/authMiddleware.js";
import { AllPost, blogPhoto, createBlog, deleteBlogbyId, getBlogById, getBlogByUserId, getRecentBlogs, getTrendingBlogs, getviewofblogs, updateBlog } from "../Controller/BlogController.js";


import cloudinaryUpload from "../Middlewarw/cloudinaryStroage.js"; // path to your file
import { Comments, data, likes } from "../Controller/LikeCommentController.js";




const router = express.Router();

router.post("/login", loginUser);
router.post("/signup",registerUser );

router.get('/AllPost',AllPost)
router.get("/blogs/recent", getRecentBlogs);
router.put("/blogs/views",getviewofblogs);
router.get("/blogs/trending", getTrendingBlogs);



router.get('/blogs/:id/data',data);
router.post('/blogs/:id/comments',Comments)
router.post('/blogs/:id/like',likes)
router.get("/blogs/:id", getBlogById);

router.post("/blogs", authMiddleware, createBlog);
router.put("/blogs/:id", authMiddleware, updateBlog);




router.post("/blogbanner",cloudinaryUpload.single("bannerImage"),blogPhoto);
router.get("/user/blogs/:userId", authMiddleware, getBlogByUserId)
router.delete("/blogs/:blogId", authMiddleware,deleteBlogbyId)
// router.post('/uploadUrlImage'uplodUrl)

router.get("/user/profile/:id",authMiddleware, getUserProfile);
router.post('/user/uploadProfilePhoto', authMiddleware,cloudinaryUpload.single('profilePhoto'), uploadProfilePhoto);
router.put('/updateProfile',authMiddleware, updateProfile);




export default router;
