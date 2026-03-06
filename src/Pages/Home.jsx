import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── typing hook ── */
const LINES = [
  "Step into ShoeNation RSA — your ultimate destination for exclusive drops.",
  "Iconic kicks, rare finds, and timeless sneaker culture await.",
  "Discover what's next in the world of sneakers.",
];
function useTyping() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const t = LINES[idx];
    const id = setTimeout(() => {
      if (!del) {
        if (typed.length < t.length) setTyped(t.slice(0, typed.length + 1));
        else setTimeout(() => setDel(true), 2200);
      } else {
        if (typed.length > 0) setTyped(typed.slice(0, -1));
        else { setDel(false); setIdx(i => (i + 1) % LINES.length); }
      }
    }, del ? 24 : 52);
    return () => clearTimeout(id);
  }, [typed, del, idx]);
  return typed;
}

/* ── reveal hook ── */
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`${styles.reveal} ${vis ? styles.revealIn : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ── counter hook ── */
function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const [ref, vis]    = useReveal(0.3);
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);
  return [ref, val];
}

export default function Home() {
  const navigate = useNavigate();
  const typed    = useTyping();

  const [ref500, count500] = useCounter(500);
  const [ref30,  count30]  = useCounter(30);
  const [ref49,  count49]  = useCounter(49);  // 4.9 → display as 4.9
  const [ref24,  count24]  = useCounter(24);

  const CARDS = [
    { cls: styles.card1, name: "Adidas Samba",         desc: "Timeless, street-ready, always iconic."    },
    { cls: styles.card2, name: "Chuck Taylor All Star", desc: "Born for the court, owned by culture."   },
    { cls: styles.card3, name: "Nike Air Max 1 '86",   desc: "Big bubble. Bold style. Pure Air heritage." },
  ];

  return (
    <div className={styles.home}>
      {/* custom cursor */}
      <div className={styles.cursor} id="cursor" />

      <div className={styles.fixedNavbar}><Navbar /></div>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.grain} />
        <div className={styles.heroNoise} />

        {/* big background number */}
        <span className={styles.heroBgNum} aria-hidden="true">01</span>

        <div className={styles.heroInner}>
          {/* eyebrow */}
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPulse} />
            <span>ShoeNation RSA · Official Store · Est. 2024</span>
          </div>

          {/* headline */}
          <h1 className={styles.heroH1}>
            <span className={styles.heroLine1}>THE</span>
            <span className={styles.heroLine1}>DROP</span>
            <span className={styles.heroLine2}>IS<em className={styles.heroStroke}> LIVE.</em></span>
          </h1>

          {/* typing */}
          <p className={styles.heroSub}>
            {typed}<span className={styles.blink}>_</span>
          </p>

          {/* ctas */}
          <div className={styles.heroCta}>
            <button className={styles.btnSlash} onClick={() => navigate("/products")}>
              <span className={styles.btnSlashBg} />
              <span className={styles.btnSlashLabel}>Shop The Drop</span>
              <span className={styles.btnSlashArrow}>→</span>
            </button>
            <button className={styles.btnGhost} onClick={() => navigate("/about")}>
              Our Story
            </button>
          </div>
        </div>

        {/* vertical label */}
        <div className={styles.heroVertLabel} aria-hidden="true">SA CULTURE · SA KICKS</div>

        {/* scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollTrack}><div className={styles.scrollThumb} /></div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* ══════════════════════════════════
          RED DIVIDER
      ══════════════════════════════════ */}
      <div className={styles.redBar}>
        <div className={styles.redBarTrack}>
          {[...Array(3)].map((_, j) =>
            ["THE DROP IS LIVE","SHOENATION RSA","EXCLUSIVE KICKS","SA CULTURE","STREET READY","FRESH PAIRS"].map(t => (
              <span key={`${j}-${t}`} className={styles.redBarItem}>
                {t} <span className={styles.redBarStar}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          BANNER
      ══════════════════════════════════ */}
      <section className={styles.bannerSection}>
        <Reveal>
          <div className={styles.bannerWrap} onClick={() => navigate("/products")}>
            <div className={styles.lpbanner} />
            <div className={styles.bannerFog} />
            <div className={styles.bannerCornerTL} />
            <div className={styles.bannerCornerBR} />
            <div className={styles.bannerMeta}>
              <span className={styles.bannerLive}><span className={styles.liveDot}/> LIVE DROP</span>
              <h2 className={styles.bannerTitle}>NEW<br/>ARRIVALS</h2>
              <p className={styles.bannerSub}>Season 2025 — Drop Now</p>
            </div>
            <button className={styles.bannerBtn}>Explore The Collection →</button>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════
          ICON CARDS
      ══════════════════════════════════ */}
      <section className={styles.iconsSection}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionNum}>02</div>
            <div>
              <div className={styles.sectionEye}><span className={styles.eyeBar}/>FEATURED</div>
              <h2 className={styles.sectionH2}>In-Store<br/><em className={styles.stroke}>Icons.</em></h2>
            </div>
            <button className={styles.headerBtn} onClick={() => navigate("/products")}>
              ALL STYLES →
            </button>
          </div>
        </Reveal>

        <div className={styles.iconCards}>
          {CARDS.map(({ cls, name, desc }, i) => (
            <Reveal key={name} delay={i * 70}>
              <div className={`${styles.iconCard} ${cls}`} onClick={() => navigate("/products")}>
                <div className={styles.cardGradient} />
                <div className={styles.cardBody}>
                  <span className={styles.cardIdx}>0{i+1}</span>
                  <div className={styles.cardFoot}>
                    <div className={styles.cardRedBar} />
                    <p className={styles.cardName}>{name}</p>
                    <p className={styles.cardDesc}>{desc}</p>
                    <span className={styles.cardExplore}>EXPLORE →</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS STRIP
      ══════════════════════════════════ */}
      <div className={styles.statsStrip}>
        {[
          { ref: ref500, val: count500, suffix: "+", label: "Styles in Stock" },
          { ref: ref30,  val: count30,  suffix: "+", label: "Exclusive Brands" },
          { ref: ref49,  val: count49 / 10, suffix: "★", label: "Average Rating" },
          { ref: ref24,  val: count24,  suffix: "h",  label: "Order Dispatch" },
        ].map(({ ref, val, suffix, label }, i) => (
          <div ref={ref} key={label} className={styles.statBlock}>
            <span className={styles.statN}>{typeof val === "number" && val < 10 && suffix === "★" ? (count49/10).toFixed(1) : val}{suffix}</span>
            <span className={styles.statL}>{label}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════
          SOUL SECTION
      ══════════════════════════════════ */}
      <section className={styles.soulSection}>
        <div className={styles.soulBgNum} aria-hidden="true">03</div>

        <Reveal className={styles.soulLeft}>
          <div className={styles.sectionEye}><span className={styles.eyeBar}/>OUR PHILOSOPHY</div>
          <h2 className={styles.soulH2}>
            From<br/>Sole<br/><em className={styles.stroke}>To Soul.</em>
          </h2>
          <p className={styles.soulTag}>Where Performance Meets Passion</p>
          <p className={styles.soulBody}>
            Our sneakers are crafted with care from sole to soul, blending innovative technology
            with thoughtful design to support your every move. The sole delivers the perfect
            balance of cushioning and durability, while the upper wraps your foot in breathable
            comfort and timeless style.
          </p>
          <p className={styles.soulBody}>
            More than just footwear — it's a connection from the ground beneath you to the energy
            and passion within. Each pair represents a harmony of craftsmanship and creativity,
            made for those who walk their own path.
          </p>
          <button className={styles.btnOutline} onClick={() => navigate("/about")}>
            Read Our Story →
          </button>
        </Reveal>

        <Reveal delay={80} className={styles.soulRight}>
          <div className={styles.soulImgWrap}>
            <div className={styles.soulimg} />
            <div className={styles.soulImgAccent} />
            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <span className={styles.floatN}>30+</span>
              <span className={styles.floatL}>Exclusive Brands</span>
            </div>
            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <span className={styles.floatN}>500+</span>
              <span className={styles.floatL}>Styles In Stock</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════
          MARQUEE (dark)
      ══════════════════════════════════ */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, j) =>
            ["SHOE NATION RSA","THE DROP","EXCLUSIVE KICKS","SA CULTURE","STREET READY","FRESH PAIRS"].map(t => (
              <span key={`${j}-${t}`} className={styles.marqueeItem}>
                {t} <span className={styles.marqueeDot}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          QUICK CATEGORIES
      ══════════════════════════════════ */}
      <section className={styles.catSection}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionNum}>04</div>
            <div>
              <div className={styles.sectionEye}><span className={styles.eyeBar}/>SHOP BY CATEGORY</div>
              <h2 className={styles.sectionH2}>Find Your<br/><em className={styles.stroke}>Fit.</em></h2>
            </div>
          </div>
        </Reveal>

        <div className={styles.catGrid}>
          {[
            { label:"Men's",      sub:"View Collection",  cls:styles.qMen,    accent:"#1a1a1a" },
            { label:"Women's",    sub:"View Collection",  cls:styles.qWomen,  accent:"#1c0f0f" },
            { label:"Kids'",      sub:"View Collection",  cls:styles.qKids,   accent:"#0f1018" },
            { label:"All Styles", sub:"Shop Everything",  cls:styles.qAll,    accent:"#E8192C" },
          ].map(({ label, sub, cls }, i) => (
            <Reveal key={label} delay={i * 55}>
              <div className={`${styles.catCard} ${cls}`} onClick={() => navigate("/products")}>
                <div className={styles.catFog} />
                <div className={styles.catNum}>0{i+1}</div>
                <div className={styles.catBody}>
                  <p className={styles.catLabel}>{label}</p>
                  <span className={styles.catSub}>{sub} →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA BAND
      ══════════════════════════════════ */}
      <Reveal>
        <section className={styles.ctaBand}>
          <div className={styles.ctaGrain} />
          <div className={styles.ctaRedGlow} />
          <span className={styles.ctaBgText} aria-hidden="true">DROP</span>

          <div className={styles.ctaLeft}>
            <div className={styles.sectionEye}><span className={styles.eyeBar}/>READY TO COP?</div>
            <h2 className={styles.ctaH2}>
              The Drop<br/><em className={styles.stroke}>Won't Wait.</em>
            </h2>
            <p className={styles.ctaSub}>Neither should you.</p>
            <div className={styles.ctaBtns}>
              <button className={styles.btnSlash} onClick={() => navigate("/products")}>
                <span className={styles.btnSlashBg} />
                <span className={styles.btnSlashLabel}>Browse The Drop</span>
                <span className={styles.btnSlashArrow}>→</span>
              </button>
              <button className={styles.btnGhost} onClick={() => navigate("/about")}>
                About Us
              </button>
            </div>
          </div>

          <div className={styles.ctaRight}>
            {[
              { n:"500+", l:"Styles" },
              { n:"30+",  l:"Brands" },
              { n:"4.9★", l:"Rating" },
              { n:"24h",  l:"Dispatch"},
            ].map(({ n, l }) => (
              <div key={l} className={styles.ctaStat}>
                <span className={styles.ctaStatN}>{n}</span>
                <span className={styles.ctaStatL}>{l}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  );
}