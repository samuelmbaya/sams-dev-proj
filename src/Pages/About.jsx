import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import aboutvid from "../assets/aboutvid.mp4";

const About = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ first: "", last: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormState(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ first: "", last: "", email: "", message: "" });
  };

  const STATS = [
    { num: "30+",  label: "Brands Stocked"   },
    { num: "500+", label: "Styles Available"  },
    { num: "24h",  label: "Dispatch Time"     },
    { num: "4.9★", label: "Customer Rating"   },
  ];

  return (
    <div className={styles.page}>

      {/* ── NAVBAR ── */}
      <div className={styles.navWrap}>
        <Navbar />
      </div>

      {/* ══════════════════════════
          HERO STRIP
      ══════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.grain} />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <div className={styles.redBar} />
            <span>ShoeNation RSA · Est. 2024</span>
          </div>
          <h1 className={styles.heroHeading}>
            Welcome to<br />
            <span className={styles.headingOutline}>ShoeNation.</span>
          </h1>
          <p className={styles.heroSub}>Where sneaker culture lives and breathes.</p>
        </div>

        {/* stats bar */}
        <div className={styles.statsBar}>
          {STATS.map(({ num, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════
          MAIN CONTENT
      ══════════════════════════ */}
      <div className={styles.container}>

        {/* ── LEFT ── */}
        <div className={styles.left}>

          {/* Story */}
          <div className={styles.textBlock}>
            <div className={styles.blockEyebrow}>
              <div className={styles.redBar} />
              <span>Our Story</span>
            </div>
            <h2 className={styles.blockHeading}>From Passion<br /><span className={styles.headingOutline}>to Platform.</span></h2>
            <p className={styles.bodyText}>
              ShoeNation.RSA began with a simple idea: to create a space where sneaker
              enthusiasts — from collectors to casual wearers — can connect, learn, and stay
              in the know. What started as a passion project quickly evolved into a growing
              community of people who love sneakers for their history, design, and cultural impact.
            </p>
          </div>

          {/* What we're about */}
          <div className={styles.textBlock}>
            <div className={styles.blockEyebrow}>
              <div className={styles.redBar} />
              <span>What We're About</span>
            </div>
            <p className={styles.bodyText}>
              We cover everything from the hottest drops and detailed reviews to care tips,
              trend forecasts, and style inspiration. Whether you're copping your first pair
              or your fiftieth, we've got something for you — curated for South African
              sneaker culture.
            </p>
          </div>

          {/* Join the movement */}
          <div className={styles.textBlock}>
            <div className={styles.blockEyebrow}>
              <div className={styles.redBar} />
              <span>Join the Movement</span>
            </div>
            <p className={styles.bodyText}>
              Sneakers aren't just shoes — they're a lifestyle. Be part of something bigger.
              Follow us, explore new content, and step into the culture with us.
            </p>
            <button className={styles.shopBtn} onClick={() => navigate("/products")}>
              Browse The Drop →
            </button>
          </div>

          {/* ── CONTACT FORM ── */}
          <div className={styles.formWrap}>
            <div className={styles.blockEyebrow}>
              <div className={styles.redBar} />
              <span>Get In Touch</span>
            </div>
            <h2 className={styles.blockHeading}>
              Talk to<br /><span className={styles.headingOutline}>The Team.</span>
            </h2>

            {submitted ? (
              <div className={styles.successBox}>
                <span className={styles.successIcon}>✔</span>
                <div>
                  <div className={styles.successTitle}>Message sent!</div>
                  <div className={styles.successSub}>We'll get back to you within 24 hours.</div>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First name</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="first"
                      value={formState.first}
                      onChange={handleChange}
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last name</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="last"
                      value={formState.last}
                      onChange={handleChange}
                      placeholder="Smith"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email address</label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Your message</label>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Ask us anything about orders, sizing, or the culture..."
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── RIGHT: VIDEO ── */}
        <div className={styles.right}>
          <div className={styles.videoWrap}>
            {/* red accent bar */}
            <div className={styles.videoAccent} />
            <video
              src={aboutvid}
              autoPlay
              loop
              muted
              playsInline
              className={styles.video}
            />
            {/* floating label */}
            <div className={styles.videoLabel}>
              <span className={styles.videoLabelDot} />
              Live Drops · SA Culture · Premium Kicks
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;