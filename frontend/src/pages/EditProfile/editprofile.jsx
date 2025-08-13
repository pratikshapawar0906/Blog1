import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loder from "../../Components/LoderComponent.jsx/Loder";

toast.configure();

const EditProfilePage = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    socialLinks: { instagram: "", twitter: "", linkedin: "", website: "" },
    profilePicture: "",
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [bioCount, setBioCount] = useState(200);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("Token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setBioCount(200 - (res.data.bio?.length || 0));
      } catch (err) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "bio") {
      if (value.length <= 200) {
        setProfile((prev) => ({ ...prev, bio: value }));
        setBioCount(200 - value.length);
      }
    } else if (["instagram", "twitter", "linkedin", "website"].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("Token");
      let profilePictureUrl = profile.profilePicture;

      // Upload new profile picture if selected
      if (newProfilePicture) {
        const formData = new FormData();
        formData.append("profilePhoto", newProfilePicture);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/uploadProfilePhoto`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        profilePictureUrl = res.data.photoUrl;
      }

      // Update profile
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/updateProfile`,
        { ...profile, profilePicture: profilePictureUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully!");
      setNewProfilePicture(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const token = localStorage.getItem("Token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/changePassword`,
        { ...passwordData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password.");
    }
  };

  if (loading) return <Loder />;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <ul className="list-group">
            <li className="list-group-item"><a href="/dashboard" className="text-decoration-none">Dashboard</a></li>
            <li className="list-group-item"><a href="/blogs" className="text-decoration-none">Blogs</a></li>
            <li className="list-group-item"><a href="/notifications" className="text-decoration-none">Notifications</a></li>
            <li className="list-group-item"><a href="/write" className="text-decoration-none">Write</a></li>
            <li className="list-group-item"><strong>Settings</strong></li>
            <li className="list-group-item ms-3"><a href="/settings/edit-profile" className="text-decoration-none">Edit Profile</a></li>
            <li className="list-group-item ms-3"><a href="/settings/change-password" className="text-decoration-none" onClick={() => setChangingPassword(true)}>Change Password</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <h3>Edit Profile</h3>
          <div className="card shadow-sm p-4">
            {/* Profile Picture */}
            <div className="text-center mb-4">
              <img
                src={profile.profilePicture || "default-avatar.png"}
                alt="Profile"
                className="rounded-circle"
                width="100"
                height="100"
                style={{ cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              />
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
              <div className="mt-2">Click image to change</div>
            </div>

            {/* Form */}
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" name="username" value={profile.username} onChange={handleInputChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={profile.email} onChange={handleInputChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea className="form-control" name="bio" rows="3" value={profile.bio} onChange={handleInputChange}></textarea>
                <small className="text-muted">{bioCount} characters left</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Social Handles</label>
                <input type="url" className="form-control mb-2" placeholder="Instagram" name="instagram" value={profile.socialLinks.instagram} onChange={handleInputChange} />
                <input type="url" className="form-control mb-2" placeholder="Twitter" name="twitter" value={profile.socialLinks.twitter} onChange={handleInputChange} />
                <input type="url" className="form-control mb-2" placeholder="LinkedIn" name="linkedin" value={profile.socialLinks.linkedin} onChange={handleInputChange} />
                <input type="url" className="form-control" placeholder="Website" name="website" value={profile.socialLinks.website} onChange={handleInputChange} />
              </div>

              <div className="text-end">
                <button type="button" className="btn btn-primary" onClick={handleSave}>Update Profile</button>
              </div>
            </form>

            {/* Change Password Modal */}
            {changingPassword && (
              <div className="mt-4 border p-3 rounded">
                <h5>Change Password</h5>
                <input type="password" className="form-control mb-2" placeholder="Old Password" name="oldPassword" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                <input type="password" className="form-control mb-2" placeholder="New Password" name="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <input type="password" className="form-control mb-2" placeholder="Confirm Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                <div className="text-end">
                  <button className="btn btn-success me-2" onClick={handlePasswordChange}>Save Password</button>
                  <button className="btn btn-secondary" onClick={() => setChangingPassword(false)}>Cancel</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

