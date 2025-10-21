import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import loginvid from '../assets/loginvid.mp4';
const backendurl = import.meta.env.VITE_BACKENDURL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${backendurl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      // Save user info
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Login successful!');
      navigate('/home'); // redirect to homepage after login
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <video
          className={styles.image}
          src={loginvid}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.textOverlay}>
          <h2>Welcome back to SneakerVerse</h2>
          <p>Access your account and explore premium designs.</p>
          <span>
            <strong>SneakerVerse</strong> — Your gateway to fashion excellence.
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Log in to your account</h2>

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

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <p className={styles.footerText}>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>

          <small>
            By logging in, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </small>
        </form>
      </div>
    </div>
  );
};

export default Login;
