import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import signupvid from "../assets/signupvid.mp4";
const backendurl = import.meta.env.VITE_BACKENDURL;

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setStatus({ loading: false, message: "All fields are required.", error: true });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ loading: false, message: "Passwords do not match.", error: true });
      return;
    }

    setStatus({ loading: true, message: "Creating your account...", error: false });

    try {
      // ✅ Use your backend /signup endpoint
      const response = await fetch(`${backendurl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus({
        loading: false,
        message: "Account created successfully! Redirecting...",
        error: false,
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // ✅ Redirect to login after success
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <video
          className={styles.image}
          src={signupvid}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.textOverlay}>
          <h2>Join a network of visionaries.</h2>
          <p>Unlock premium design resources tailored for you.</p>
          <span>
            <strong>SneakerVerse</strong> — Your gateway to fashion excellence.
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Create your account</h2>

          <label htmlFor="fullName">Full name*</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email address*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm password*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <p className={styles.passwordNote}>
            Password must be at least 8 characters long.
          </p>

          <button
            type="submit"
            className={styles.createAccountButton}
            disabled={status.loading}
          >
            {status.loading ? "Creating account..." : "Create account"}
          </button>

          {status.message && (
            <p
              style={{
                color: status.error ? "red" : "green",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {status.message}
            </p>
          )}

          <p className={styles.footerText}>
            Already have an account? <a href="/login">Login</a>
          </p>

          <small>
            By creating an account, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </small>
        </form>
      </div>
    </div>
  );
};

export default Signup;
