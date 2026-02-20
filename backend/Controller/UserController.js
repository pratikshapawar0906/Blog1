import User from "../model/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from 'cloudinary';
import multer from 'multer';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name },
      isNewUser: user.isNewUser
    });

    // Optional: update isNewUser = false after first login
    if (user.isNewUser) {
      user.isNewUser = false;
      await user.save();
    }

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isNewUser: true,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "Signup successful." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};


// GET /api/user/:id
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  
};

// Cloudinary config (if using)
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//POST /api/user/uploadProfilePhoto
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_photos",
    });

    user.profilePicture = result.secure_url;
    await user.save();

    res.json({ success: true, photoUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
};

// PUT /api/updateProfile
export const updateProfile = async (req, res) => {
  try {
    const { userId, name, bio, socialLinks, profilePicture } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.socialLinks = socialLinks || user.socialLinks;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


