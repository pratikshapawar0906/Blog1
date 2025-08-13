import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./pro.css";
import { FaEdit, FaHome, FaPen } from "react-icons/fa";
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
    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/user/${storedUserId}`)
      .then((response) => {
        setUser({
          ...response.data,
          profilePicture: response.data.profilePicture || "default-avatar.png", // Set default if missing
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prevUser) => ({ ...prevUser, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
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

      
      

      //  Update other profile details
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/updateProfile`, {
        userId: storedUserId,
        name: user.name,
        bio: user.bio,
        socialLinks: user.socialLinks,
        profilePicture: updatedPhotoUrl,
      });
      
      if (data.success) {
        handleSuccess(data.message);
        localStorage.setItem("ProfilePhoto", updatedPhotoUrl);
        window.dispatchEvent(new Event("storage"));
        setEditing(false);
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: updatedPhotoUrl,
        }));
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
         <FaPen /> Write
        </Link>
      </div>

      {/* Main Profile Section */}
      <div className="pgp-profile-content">
        <div className="pgp-profile-header">
          {/* Clicking the image triggers file input */}
          <img
            src={user.profilePicture}
            alt="Profile"
            className="pgp-profile-image"
            onClick={() => fileInputRef.current.click()} // Open file browser
            style={{ cursor: "pointer" }} // Indicate it's clickable
          />

          {/* Hidden file input */}
          <input
            type="file"
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
                <p>{user.email}</p>
                <p>{user.bio}</p>
              </>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="pgp-social-links">
          <h3>Social Links</h3>
          {["instagram", "twitter", "linkedin", "website"].map((platform) => (
            <div key={platform}>
              <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
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
