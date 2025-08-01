import React, { useEffect, useState } from "react";
import { Link,  useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Menu from "../MenuComponent/menu"
import { FaBars } from "react-icons/fa";


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [userId, setUserId] = useState(null);
  const [promt,setPromt]=useState("");
  const [menu ,setMenu] =useState("");
  const path= useLocation().pathname

  const navigate = useNavigate();
  const ShowMenu = () => {
    setMenu((prev) => !prev);
  };


  

  const profilePhotos = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/65.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://randomuser.me/api/portraits/women/22.jpg",
  ];

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const storedUserId = localStorage.getItem("userId");
    const savedPhoto = localStorage.getItem("ProfilePhoto");
  
    // console.log("Token:", token);
    // console.log("UserId:", storedUserId);
    // console.log("Saved Photo:", savedPhoto);
  
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
  
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      } else {
        const randomPhoto =
          profilePhotos[Math.floor(Math.random() * profilePhotos.length)];
        setProfilePhoto(randomPhoto);
        localStorage.setItem("ProfilePhoto", randomPhoto);
      }
    } else {
      setIsLoggedIn(false);
      setProfilePhoto("");
      setUserId(null);
    }
  }, []);
  


  // Listen for changes in localStorage (Profile Photo Update)
  useEffect(() => {
    const handleStorageChange = () => {
      setProfilePhoto(localStorage.getItem("ProfilePhoto") || "");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("ProfilePhoto");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setProfilePhoto("");
    setUserId(null);
    navigate("/login"); // Ensures state update reflects immediately
  };

  return (
  <div className="navbar px-5 sticky-top bg-light">
    <div className="navbar-left">
      {/* <img src="" alt="MyAppLogo" width={50} height={50} /> */}
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link className="text-decoration-none" to="/">Home</Link>
        </li>
        <Link className="text-decoration-none" to="/write">
          <li className="navbar-item">Write</li>
        </Link>
      </ul>
      {userId && (
        <div onClick={ShowMenu}>
          <p className="cursor-pointer relative">
            <FaBars />
            {menu && <Menu />}
          </p>
        </div>
      )}
    </div>

    <div className="navbar-middle">
      {path === "/" && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search"
            onChange={(e) => setPromt(e.target.value)}
          />
          <i
            className="fas fa-search search-icon"
            aria-label="Search Icon"
            onClick={() => navigate(promt ? `?search=${promt}` : "/")}
          />
        </div>
      )}
    </div>

    <div className="navbar-right">
      {isLoggedIn ? (
        <div className="navbar-user">
          <Link to={`/profile/${userId}`}>
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-photo"
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          <div className="navbar-button">
            <Link to="/signup">Sign up</Link>
          </div>
          <button className="btn btn-dark" style={{ width: "100px" }}>
            <Link className="text-decoration-none text-light" to="/login">
              Login
            </Link>
          </button>
        </>
      )}
    </div>
  </div>
);

}

export default Navbar;
