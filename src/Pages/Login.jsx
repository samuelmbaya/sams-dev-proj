import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import loginvid from '../assets/loginvid.mp4';

const backendurl = import.meta.env.VITE_BACKENDURL;

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${backendurl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setError(data.error || 'Login failed. Please try again.'); return; }
      // Merge: keep any locally-saved profile edits (phone, bio, address, profilePic, etc.)
      const stored  = JSON.parse(localStorage.getItem('user') || 'null');
      const merged  = stored?.email === data.user?.email
        ? { ...data.user, ...stored }   // local edits win for same account
        : data.user;                    // different account — use server data fresh
      localStorage.setItem('user',      JSON.stringify(merged));
      localStorage.setItem('userEmail', merged?.email || formData.email);
      localStorage.setItem('loggedIn',  'true');
      navigate('/home');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* ── LEFT VIDEO ── */}
      <div className={styles.left}>
        <video src={loginvid} autoPlay loop muted playsInline className={styles.vid} />
        <div className={styles.vidOverlay} />

        <div className={styles.logoWrap}>
          <div className={styles.logoBar} />
          <span className={styles.logoText}>Shoe<b>Nation</b><em>.RSA</em></span>
        </div>

        <div className={styles.heroText}>
          <p className={styles.heroEye}><span className={styles.heroDot} />Members Only</p>
          <h1 className={styles.heroH1}>
            WELCOME<br />
            <span className={styles.heroOutline}>BACK.</span>
          </h1>
          <p className={styles.heroSub}>Your account. Your drops. Your culture.</p>
        </div>

        <div className={styles.statsRow}>
          {[['500+','Styles'],['30+','Brands'],['24h','Dispatch'],['4.9★','Rating']].map(([n,l])=>(
            <div key={l} className={styles.stat}>
              <span className={styles.statN}>{n}</span>
              <span className={styles.statL}>{l}</span>
            </div>
          ))}
        </div>

        <div className={styles.leftEdge} />
      </div>

      {/* ── RIGHT FORM ── */}
      <div className={styles.right}>
        <div className={styles.topAccent} />

        <div className={styles.inner}>
          <div className={styles.formEye}>
            <div className={styles.formEyeBar} />
            <span>Sign In</span>
          </div>

          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Log<br /><span className={styles.titleRed}>In.</span></h2>
            <p className={styles.titleSub}>New here? <Link to="/" className={styles.titleLink}>Create an account →</Link></p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="lemail">Email address</label>
              <input
                className={styles.input}
                type="email" id="lemail" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="Email" autoComplete="email" required
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="lpassword">Password</label>
                <a href="/forgot-password" className={styles.forgot}>Forgot?</a>
              </div>
              <div className={styles.pwWrap}>
                <input
                  className={styles.input}
                  type={showPass ? 'text' : 'password'} id="lpassword" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="current-password" required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(s=>!s)} tabIndex={-1}>
                  {showPass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errBox}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? <><span className={styles.spin} />Logging in…</>
                : 'Log In'}
            </button>

          </form>

          <p className={styles.legal}>
            By logging in you agree to our{' '}
            <a href="/terms" className={styles.legalLink}>Terms</a> &amp;{' '}
            <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}