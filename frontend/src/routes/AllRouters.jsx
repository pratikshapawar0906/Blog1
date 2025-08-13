import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/homepage/home";
import Login from "../pages/Loginpage/login"
import CreatePost from "../pages/CreatePost/PostForm"
import PostDetail from "../pages/postdetail/PostDetail"
import MyBlog from '../pages/MyBlogs/myBlog'
import Signup from "../pages/Registerpage/Singup";
// import ForgotPassword from "../src/component/forgotpasswordComponent/forgotPassword";
import Profile from "../pages/Profile/profile";
// import Preview from "../src/component/previewComponent/preview";
import BlogEditor from "../pages/EditPost/editpost";
import PhotoContext from "../context/photocontext";
const AllRouters = () => {
  return (
    <>
      <BrowserRouter>
      {/* <PhotoContext /> */}
      <Routes>
        
        {/* Main Routes */}
        <Route path="/" element={<HomePage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/write" element={<CreatePost/>} />
        <Route path="/blog/:id" element={<PostDetail />} />
        <Route path="/myblog/:userId" element={<MyBlog />} />
        {/* <Route path="//forgot-password" element={<ForgotPassword />} /> */}
        <Route path="/profile/:userId" element={<Profile/>} />
        {/* <Route path="/preview/:draftId" element={<Preview/>} /> */}
        {/* <Route path="/new" element={<BlogEditor />} /> */}
        <Route path="/edit/:id" element={<BlogEditor />} />

        
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default AllRouters;
