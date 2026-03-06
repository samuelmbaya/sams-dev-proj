import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import aboutvid from "../assets/aboutvid.mp4";

/* ── reveal hook ── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${vis ? styles.revealIn : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const STATS = [
  { num: "30+",  label: "Brands Stocked"  },
  { num: "500+", label: "Styles Available" },
  { num: "24h",  label: "Dispatch Time"   },
  { num: "4.9★", label: "Customer Rating" },
];

const About = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ first: "", last: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ first: "", last: "", email: "", message: "" });
  };

  return (
    <div className={styles.page}>

      {/* fixed navbar */}
      <div className={styles.fixedNav}><Navbar /></div>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.grain} />
        <div className={styles.heroGlow} />
        <div className={styles.scanlines} />

        {/* giant watermark */}
        <span className={styles.heroBg} aria-hidden="true">ABOUT</span>

        {/* red right-edge stripe */}
        <div className={styles.heroStripe} />

        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyeDot} />
            <span>ShoeNation RSA · Est. 2024</span>
          </div>

          <h1 className={styles.heroH1}>
            <span className={styles.heroLine}>WELCOME</span>
            <span className={styles.heroLine}>TO</span>
            <span className={styles.heroLine}>
              <em className={styles.heroStroke}>SHOE</em>
              <em className={styles.heroStroke}>NATION.</em>
            </span>
          </h1>

          <p className={styles.heroSub}>Where sneaker culture lives and breathes.</p>
        </div>

        {/* stats bar */}
        <div className={styles.statsBar}>
          {STATS.map(({ num, label }, i) => (
            <div key={label} className={styles.statItem}
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className={styles.statRule} />
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* red marquee strip */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, j) =>
            ["SHOENATION RSA","THE DROP","SA CULTURE","OUR STORY","QUALITY FIRST","STREET READY"].map(t => (
              <span key={`${j}-${t}`} className={styles.marqueeItem}>
                {t} <span className={styles.marqueeDot}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <div className={styles.container}>

        {/* ── LEFT ── */}
        <div className={styles.left}>

          {/* ── Story ── */}
          <Reveal className={styles.textBlock}>
            <div className={styles.blockBgNum} aria-hidden="true">01</div>
            <div className={styles.blockEye}>
              <span className={styles.eyeBar} />
              <span>Our Story</span>
            </div>
            <h2 className={styles.blockH2}>
              From Passion<br />
              <em className={styles.stroke}>To Platform.</em>
            </h2>
            <p className={styles.bodyText}>
              ShoeNation.RSA began with a simple idea: to create a space where sneaker
              enthusiasts — from collectors to casual wearers — can connect, learn, and stay
              in the know. What started as a passion project quickly evolved into a growing
              community of people who love sneakers for their history, design, and cultural impact.
            </p>
          </Reveal>

          {/* ── What we're about ── */}
          <Reveal delay={60} className={styles.textBlock}>
            <div className={styles.blockBgNum} aria-hidden="true">02</div>
            <div className={styles.blockEye}>
              <span className={styles.eyeBar} />
              <span>What We're About</span>
            </div>
            <p className={styles.bodyText}>
              We cover everything from the hottest drops and detailed reviews to care tips,
              trend forecasts, and style inspiration. Whether you're copping your first pair
              or your fiftieth, we've got something for you — curated for South African
              sneaker culture.
            </p>
          </Reveal>

          {/* ── Join the movement ── */}
          <Reveal delay={120} className={styles.textBlock}>
            <div className={styles.blockBgNum} aria-hidden="true">03</div>
            <div className={styles.blockEye}>
              <span className={styles.eyeBar} />
              <span>Join the Movement</span>
            </div>
            <p className={styles.bodyText}>
              Sneakers aren't just shoes — they're a lifestyle. Be part of something bigger.
              Follow us, explore new content, and step into the culture with us.
            </p>
            <button className={styles.shopBtn} onClick={() => navigate("/products")}>
              <span className={styles.shopBtnBg} />
              <span className={styles.shopBtnLabel}>Browse The Drop →</span>
            </button>
          </Reveal>

          {/* ── CONTACT FORM ── */}
          <Reveal delay={60} className={styles.formWrap}>
            <div className={styles.blockBgNum} aria-hidden="true">04</div>
            <div className={styles.blockEye}>
              <span className={styles.eyeBar} />
              <span>Get In Touch</span>
            </div>
            <h2 className={styles.blockH2}>
              Talk to<br />
              <em className={styles.stroke}>The Team.</em>
            </h2>

            {submitted ? (
              <div className={styles.successBox}>
                <div className={styles.successIconWrap}>✔</div>
                <div>
                  <div className={styles.successTitle}>Message sent!</div>
                  <div className={styles.successSub}>We'll get back to you within 24 hours.</div>
                </div>
              </div>
            ) : (
              <div className={styles.form}>
                <div className={styles.formRow}>
                  {[["first","First name","Jane"],["last","Last name","Smith"]].map(([name, lbl, ph]) => (
                    <div key={name} className={styles.formGroup}
                      data-focused={focused === name || undefined}>
                      <div className={styles.fieldAccent} />
                      <label className={styles.label}>{lbl}</label>
                      <input
                        className={styles.input}
                        type="text" name={name}
                        value={form[name]}
                        onChange={handleChange}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused(null)}
                        placeholder={ph}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.formGroup}
                  data-focused={focused === "email" || undefined}>
                  <div className={styles.fieldAccent} />
                  <label className={styles.label}>Email address</label>
                  <input
                    className={styles.input}
                    type="email" name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}
                  data-focused={focused === "message" || undefined}>
                  <div className={styles.fieldAccent} />
                  <label className={styles.label}>Your message</label>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="Ask us anything about orders, sizing, or the culture..."
                    rows="5"
                    required
                  />
                </div>

                <button className={styles.submitBtn} onClick={handleSubmit}>
                  <span className={styles.submitBg} />
                  <span className={styles.submitLabel}>Send Message →</span>
                </button>
              </div>
            )}
          </Reveal>

        </div>{/* /left */}

        {/* ── RIGHT: VIDEO ── */}
        <div className={styles.right}>
          <Reveal className={styles.videoCard}>
            {/* top accent */}
            <div className={styles.videoTopAccent} />
            {/* grain inside card */}
            <div className={styles.grain} />
            {/* corner mark */}
            <div className={styles.videoCornerMark} aria-hidden="true">01</div>

            <div className={styles.videoWrap}>
              {/* left red bar */}
              <div className={styles.videoLeftBar} />
              <video
                src={aboutvid}
                autoPlay loop muted playsInline
                className={styles.video}
              />
              {/* scanlines over video */}
              <div className={styles.videoScanlines} />
              {/* floating label */}
              <div className={styles.videoLabel}>
                <span className={styles.videoLabelDot} />
                Live Drops · SA Culture · Premium Kicks
              </div>
            </div>

            {/* below-video info strip */}
            <div className={styles.videoMeta}>
              <div className={styles.videoMetaEye}>
                <span className={styles.eyeBar} />
                <span>Now Playing</span>
              </div>
              <p className={styles.videoMetaTitle}>ShoeNation RSA — The Culture</p>
              <p className={styles.videoMetaSub}>Step into the lifestyle. SA's premium sneaker destination.</p>
            </div>
          </Reveal>

          {/* floating value cards */}
          <div className={styles.valueCards}>
            {[
              ["🔒","100% Authentic","Every pair verified before dispatch."],
              ["🚚","24h Dispatch",  "Order before 2PM, ships same day."],
              ["↩️","Easy Returns",  "30-day hassle-free return policy."],
            ].map(([icon, title, body], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}>{icon}</span>
                  <div>
                    <p className={styles.valueTitle}>{title}</p>
                    <p className={styles.valueBody}>{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>{/* /container */}

      <Footer />
    </div>
  );
};

export default About;