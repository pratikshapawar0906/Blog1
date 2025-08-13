import React from "react";
import Navbar from "../../Components/Navbarcomponent/navbar";
import PostList from "../AllPostList/PostList";


const Home = () => {
  return (
    <>
      <Navbar/>
      <PostList />
    </>
  )
};

export default Home;
