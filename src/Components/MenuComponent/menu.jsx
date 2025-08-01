import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/UserContext';

const Menu = () => {
  const { userId, setUserId } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("ProfilePhoto");
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  return (
    <div className="bg-black w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
      {!userId && (
        <>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
            <Link to="/login">Login</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
            <Link to="/signup">Register</Link>
          </h3>
        </>
      )}

      {userId && (
        <>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
            <Link to={"/profile/" + userId}>Profile</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
            <Link to="/write">Create A Blog</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer'>
            <Link to={"/myblogs/" + userId}>My Blogs</Link>
          </h3>
          <h3 className='text-white text-sm hover:text-gray-500 cursor-pointer' onClick={handleLogout}>
            Logout
          </h3>
        </>
      )}
    </div>
  );
};

export default Menu;
