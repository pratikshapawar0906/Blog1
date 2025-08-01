import express from "express";
import { getUserProfile, loginUser, registerUser, updateProfile, uploadProfilePhoto } from "../Controller/UserController.js";
import authMiddleware from "../Middlewarw/authMiddleware.js";
import { AllPost, createBlog, getBlogById, updateBlog } from "../Controller/BlogController.js";
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // or use memoryStorage for cloud upload
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup",registerUser );
router.post("/blogs", authMiddleware, createBlog);
router.put("/blogs/:id", authMiddleware, updateBlog);
router.get("/blogs/:id", authMiddleware, getBlogById);
router.get('/user/:id', getUserProfile);
router.post('/user/uploadProfilePhoto', upload.single('profilePhoto'), uploadProfilePhoto);
router.put('/updateProfile', updateProfile);
router.get('/AllPost',AllPost)


export default router;
