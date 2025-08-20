import express from "express";
import { getUserProfile, loginUser, registerUser, updateProfile, uploadProfilePhoto } from "../Controller/UserController.js";
import authMiddleware from "../Middlewarw/authMiddleware.js";
import { AllPost, blogPhoto, createBlog, deleteBlogbyId, getBlogById, getBlogByUserId, updateBlog } from "../Controller/BlogController.js";


import cloudinaryUpload from "../Middlewarw/cloudinaryStroage.js"; // path to your file
import { Comments, data, likes } from "../Controller/LikeCommentController.js";




const router = express.Router();

router.post("/login", loginUser);
router.post("/signup",registerUser );
router.post("/blogs", authMiddleware, createBlog);
router.put("/blogs/:id", authMiddleware, updateBlog);
router.get("/blogs/:id", authMiddleware, getBlogById);
router.post("/blogbanner",cloudinaryUpload.single("bannerImage"),blogPhoto);
router.get("/user/:userId", authMiddleware, getBlogByUserId)
router.delete("/blogs/:blogId", authMiddleware,deleteBlogbyId)
// router.post('/uploadUrlImage'uplodUrl)

router.get('/user/:id',authMiddleware, getUserProfile);
router.post('/user/uploadProfilePhoto', cloudinaryUpload.single('profilePhoto'), uploadProfilePhoto);
router.put('/updateProfile', updateProfile);
router.get('/AllPost',AllPost)

router.get('/blogs/:id/data',data);
router.post('/blogs/:id/comments',Comments)
router.post('/blogs/:id/like',likes)


export default router;
