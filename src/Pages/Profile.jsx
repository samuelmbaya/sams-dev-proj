import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Profile.module.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    company: "",
    website: "",
    skills: "",
    bio: "",
    profilePic: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setForm(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(form));
    setUser(form);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditMode(false);
  };

  const handleBack = () => navigate("/products");

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className={styles.profilePage}>
        <button className={styles.backBtn} onClick={handleBack}>
          ← Back to Products
        </button>

        <div className={styles.profileContainer}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <img
              src={
                editMode
                  ? form.profilePic || "/default-profile.png"
                  : user.profilePic || "/default-profile.png"
              }
              alt="Profile"
              className={styles.profileImage}
            />
            {editMode && (
              <label className={styles.uploadLabel}>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
            )}
          </div>

          {/* Right Section */}
          <div className={styles.rightSection}>
            <h1 className={styles.username}>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={styles.inputField}
                />
              ) : (
                user.name || "Unnamed User"
              )}
            </h1>

            {/* Email */}
            <div className={styles.infoGroup}>
              <label>Email</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className={styles.infoGroup}>
              <label>Phone</label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <span>{user.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className={styles.infoGroup}>
              <label>Address</label>
              {editMode ? (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={styles.textArea}
                />
              ) : (
                <span>{user.address}</span>
              )}
            </div>

            {/* Job Title */}
            <div className={styles.infoGroup}>
              <label>Job Title</label>
              {editMode ? (
                <input
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <span>{user.jobTitle}</span>
              )}
            </div>

            {/* Company */}
            <div className={styles.infoGroup}>
              <label>Company</label>
              {editMode ? (
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <span>{user.company}</span>
              )}
            </div>

            {/* Website */}
            <div className={styles.infoGroup}>
              <label>Website</label>
              {editMode ? (
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <a href={user.website} target="_blank" rel="noopener noreferrer">
                  {user.website}
                </a>
              )}
            </div>

            {/* Skills */}
            <div className={styles.infoGroup}>
              <label>Skills (comma-separated)</label>
              {editMode ? (
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <span>{user.skills}</span>
              )}
            </div>

            {/* Bio */}
            <div className={styles.infoGroup}>
              <label>Bio</label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={styles.textArea}
                />
              ) : (
                <span>{user.bio}</span>
              )}
            </div>

            {/* Buttons */}
            <div className={styles.buttons}>
              {editMode ? (
                <>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    Save
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
