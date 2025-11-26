import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./pro.css";
import { FaCamera, FaEdit, FaGlobe, FaHome, FaInstagram, FaLinkedin, FaPen, FaTwitter } from "react-icons/fa";
import { handleSuccess } from "../../util";
import Loder from "../../Components/LoderComponent.jsx/Loder";

const Profile = () => {
  const { userId } = useParams();
  const fileInputRef = useRef(null); //  Ref to trigger file input
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    socialLinks: { instagram: "", twitter: "", linkedin: "", website: "" },
    profilePicture: "",
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);  // set loading
  const [editing, setEditing] = useState(false);// set editing
 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("Token");

    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/${storedUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
          const userData = response.data.user || response.data;
        setUser({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          profilePicture: userData.profilePicture || "default-avatar.png",
          socialLinks: {
            instagram: userData.socialLinks?.instagram || "",
            twitter: userData.socialLinks?.twitter || "",
            linkedin: userData.socialLinks?.linkedin || "",
            website: userData.socialLinks?.website || "",
          },
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div >
        <Loder />
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setNewProfilePicture(file);
  
    const previewURL = URL.createObjectURL(file);
    setUser((prevUser) => ({
      ...prevUser,
      profilePicture: previewURL, // Temporary preview URL
    }));
  };


  const handleEditClick = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID is missing!");
      return;
    }

    try {
      let updatedPhotoUrl = user.profilePicture;

      // Upload Profile Photo to Cloudinary
      if (newProfilePicture) {
        const formData = new FormData();
        formData.append("profilePhoto", newProfilePicture);
        formData.append("userId", storedUserId);
      
        const uploadRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/uploadProfilePhoto`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      
        if (uploadRes.data.photoUrl) {
          updatedPhotoUrl = uploadRes.data.photoUrl; // <-- update variable
          setNewProfilePicture(null);
        }
      }

      const token = localStorage.getItem("Token");
      

      //  Update other profile details
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/updateProfile`, {
        userId: storedUserId,
        name: user.name,
        bio: user.bio,
        socialLinks: user.socialLinks,
        profilePicture: updatedPhotoUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, //  Send token
        },
      });
      
      if (data.success) {
        handleSuccess(data.message);
        localStorage.setItem("ProfilePhoto", updatedPhotoUrl);
        window.dispatchEvent(new Event("storage"));
        setEditing(false);
        setUser(data.user); 

      }

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

 

  
  return (
    <div className="pgp-profile-wrapper">
      {/* Sidebar */}
      <div className="pgp-sidebar">
        <Link to="/" className="pgp-sidebar-btn">
          <FaHome /> Home
        </Link>

        <Link to="/write" className="pgp-sidebar-btn">
         <FaPen /> Create
        </Link>
      </div>

      {/* Main Profile Section */}
      <div className="pgp-profile-content">
        <div className="pgp-profile-header"> {/* Clicking the image triggers file input */} 
          <div className="pgp-image-wrapper" onClick={() => fileInputRef.current.click()}>
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="pgp-profile-image"
            />
            <div className="pgp-image-edit-icon">
              <FaCamera size={14} />
            </div>
          </div>

          {/* Hidden file input */}
          <input type="file" 
            accept="image/*" 
            ref={fileInputRef} // Connect input to ref 
            onChange={handleFileChange} 
            style={{ display: "none" }} // Hide input 
          /> 
            <div className="pgp-profile-details">
              {editing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                  />
            
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    placeholder="User's bio"
                  />
                  <button onClick={handleSubmit} className="pgp-submit-btn">Submit</button>
                </>
              ) : (
                <>
                  <h2>{user.name} <FaEdit onClick={handleEditClick} style={{ cursor: "pointer" }} /></h2>
                  <p className="pgp-bio">{user.bio || "No bio added yet"}</p>
                </>
              )}
            </div>

          </div>


        {/* Social Links */}
        <div className="pgp-social-links">
          <h3>Social Links</h3>
        
          {[
            { platform: "instagram", icon: <FaInstagram /> },
            { platform: "twitter", icon: <FaTwitter /> },
            { platform: "linkedin", icon: <FaLinkedin /> },
            { platform: "website", icon: <FaGlobe /> }
          ].map(({ platform, icon }) => (
            <div className="pgp-social-field" key={platform}>
              <label>
                <span className="pgp-social-icon">{icon}</span>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              <input
                type="url"
                name={platform}
                value={user.socialLinks?.[platform] || ""}
                onChange={(e) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    socialLinks: {
                      ...(prevUser.socialLinks || {}),
                      [platform]: e.target.value,
                    },
                  }))
                }
                placeholder="https://"
              />
            </div>
          ))}
        </div>


        <button onClick={handleSubmit} className="pgp-update-btn">
          Update
        </button>
      </div>
    </div>
  );
};

export default Profile;
