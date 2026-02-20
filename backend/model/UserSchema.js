import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isNewUser: { type: Boolean, default: true },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  socialLinks: {
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  
},
  { timestamps: true } 
);

export default mongoose.model("User", userSchema);
