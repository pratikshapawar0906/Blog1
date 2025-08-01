import React from "react";

const EditProfilePage = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <ul className="list-group">
            <li className="list-group-item">
              <a href="/dashboard" className="text-decoration-none">
                Dashboard
              </a>
            </li>
            <li className="list-group-item">
              <a href="/blogs" className="text-decoration-none">
                Blogs
              </a>
            </li>
            <li className="list-group-item">
              <a href="/notifications" className="text-decoration-none">
                Notifications
              </a>
            </li>
            <li className="list-group-item">
              <a href="/write" className="text-decoration-none">
                Write
              </a>
            </li>
            <li className="list-group-item">
              <strong>Settings</strong>
            </li>
            <li className="list-group-item ms-3">
              <a href="/settings/edit-profile" className="text-decoration-none">
                Edit Profile
              </a>
            </li>
            <li className="list-group-item ms-3">
              <a href="/settings/change-password" className="text-decoration-none">
                Change Password
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <h3>Edit Profile</h3>
          <div className="card shadow-sm p-4">
            {/* Profile Picture */}
            <div className="text-center mb-4">
              <img
                src="profile-picture.jpg" // Replace with an actual image
                alt="Profile"
                className="rounded-circle"
                width="100"
                height="100"
              />
              <button className="btn btn-outline-secondary mt-2">Upload</button>
            </div>

            {/* Form */}
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="kunaal"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="kunaal@gmail.com"
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Bio"
                ></textarea>
                <small className="text-muted">200 characters left</small>
              </div>

              {/* Social Handles */}
              <div className="mb-3">
                <label className="form-label">Add Your Social Handles Below</label>
                <div className="d-flex flex-column gap-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://"
                  />
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Twitter URL"
                  />
                  <input
                    type="url"
                    className="form-control"
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
