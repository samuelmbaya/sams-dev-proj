import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SignUp.module.css';
import signupvid from '../assets/signupvid.mp4';

const backendurl = import.meta.env.VITE_BACKENDURL;

export default function Signup() {
  const [formData, setFormData] = useState({ fullName:'', email:'', password:'', confirmPassword:'' });
  const [status,   setStatus]   = useState({ loading:false, message:'', error:false });
  const [showPw,   setShowPw]   = useState({ pw:false, cpw:false });
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password)
      return setStatus({ loading:false, message:'All fields are required.', error:true });
    if (formData.password !== formData.confirmPassword)
      return setStatus({ loading:false, message:'Passwords do not match.', error:true });
    if (formData.password.length < 8)
      return setStatus({ loading:false, message:'Password must be at least 8 characters.', error:true });

    setStatus({ loading:true, message:'', error:false });
    try {
      const res  = await fetch(`${backendurl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name:formData.fullName, email:formData.email, password:formData.password, confirmPassword:formData.confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus({ loading:false, message:'Account created! Redirecting…', error:false });
      setFormData({ fullName:'', email:'', password:'', confirmPassword:'' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({ loading:false, message:err.message, error:true });
    }
  };

  const pwStrength = pw => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8)  s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = pwStrength(formData.password);
  const strengthLabel = ['','Weak','Fair','Good','Strong'][strength];
  const strengthColor = ['','#E8192C','#f59e0b','#22c55e','#4ADE80'][strength];

  return (
    <div className={styles.page}>

      {/* ── LEFT VIDEO ── */}
      <div className={styles.left}>
        <video src={signupvid} autoPlay loop muted playsInline className={styles.vid} />
        <div className={styles.vidOverlay} />

        <div className={styles.logoWrap}>
          <div className={styles.logoBar} />
          <span className={styles.logoText}>Shoe<b>Nation</b><em>.RSA</em></span>
        </div>

        <div className={styles.heroText}>
          <p className={styles.heroEye}><span className={styles.heroDot} />Join The Movement</p>
          <h1 className={styles.heroH1}>
            JOIN<br />
            <span className={styles.heroOutline}>THE DROP.</span>
          </h1>
          <p className={styles.heroSub}>Premium sneakers. SA prices. Every pair quality checked.</p>
        </div>

        <div className={styles.statsRow}>
          {[['10k+','Members'],['500+','Styles'],['30+','Brands'],['Free','Delivery R500+']].map(([n,l])=>(
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
            <span>New Account</span>
          </div>

          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Sign<br /><span className={styles.titleRed}>Up.</span></h2>
            <p className={styles.titleSub}>Have an account? <Link to="/login" className={styles.titleLink}>Log in →</Link></p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="sfullName">Full name</label>
              <input
                className={styles.input}
                type="text" id="sfullName" name="fullName"
                value={formData.fullName} onChange={handleChange}
                placeholder="Jane Smith" autoComplete="name" required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="semail">Email address</label>
              <input
                className={styles.input}
                type="email" id="semail" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email" required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="spw">Password</label>
              <div className={styles.pwWrap}>
                <input
                  className={styles.input}
                  type={showPw.pw ? 'text' : 'password'} id="spw" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Min. 8 characters" autoComplete="new-password" required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(s=>({...s,pw:!s.pw}))} tabIndex={-1}>
                  {showPw.pw
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* password strength bar */}
              {formData.password && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthTrack}>
                    {[1,2,3,4].map(i => (
                      <div key={i} className={styles.strengthSeg} style={{ background: i <= strength ? strengthColor : '' }} />
                    ))}
                  </div>
                  <span className={styles.strengthLabel} style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="scpw">Confirm password</label>
              <div className={styles.pwWrap}>
                <input
                  className={`${styles.input} ${formData.confirmPassword && formData.confirmPassword !== formData.password ? styles.inputErr : ''} ${formData.confirmPassword && formData.confirmPassword === formData.password ? styles.inputOk : ''}`}
                  type={showPw.cpw ? 'text' : 'password'} id="scpw" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="••••••••" autoComplete="new-password" required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(s=>({...s,cpw:!s.cpw}))} tabIndex={-1}>
                  {showPw.cpw
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* status message */}
            {status.message && (
              <div className={status.error ? styles.errBox : styles.successBox}>
                {status.error
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                }
                {status.message}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={status.loading}>
              {status.loading
                ? <><span className={styles.spin} />Creating account…</>
                : 'Create Account'}
            </button>

          </form>

          <p className={styles.legal}>
            By signing up you agree to our{' '}
            <a href="/terms" className={styles.legalLink}>Terms</a> &amp;{' '}
            <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}