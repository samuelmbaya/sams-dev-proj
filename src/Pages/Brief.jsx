import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Brief.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import WomenImg   from "../assets/women.png";
import MenImg     from "../assets/men.png";
import AdidasLogo from "../assets/adidas.png";
import NikeLogo   from "../assets/nike.png";
import MainShoe   from "../assets/limited_main.png";
import BackShoe   from "../assets/limited_back.png";
import SideShoe   from "../assets/limited_side.png";

/* ── scroll-reveal hook ── */
function useReveal(threshold = 0.12) {
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
  }, [threshold]);
  return [ref, vis];
}

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${vis ? styles.revealIn : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
};

/* ── typing effect ── */
const LINES = ["The Drop Is Live.", "New Season. New Kicks.", "SA Culture. Premium Pairs."];

export default function Brief() {
  const navigate = useNavigate();
  const go = cat => navigate(cat === "all" ? "/products" : `/products?category=${cat}`);

  const [tagIdx,   setTagIdx]   = useState(0);
  const [typed,    setTyped]    = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = LINES[tagIdx];
    const delay  = deleting ? 36 : 78;
    const t = setTimeout(() => {
      if (!deleting) {
        if (typed.length < target.length) setTyped(target.slice(0, typed.length + 1));
        else setTimeout(() => setDeleting(true), 1900);
      } else {
        if (typed.length > 0) setTyped(typed.slice(0, -1));
        else { setDeleting(false); setTagIdx(i => (i + 1) % LINES.length); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [typed, deleting, tagIdx]);

  return (
    <div className={styles.page}>
      <div className={styles.navWrap}><Navbar /></div>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrain}   />

        <div className={styles.heroContent}>
          <div className={styles.heroEye}>
            <span className={styles.heroEyeBar} />
            ShoeNation RSA · Official Store
          </div>

          <h1 className={styles.heroH1}>
            THE<br />
            <em className={styles.heroOutline}>DROP.</em>
          </h1>

          <p className={styles.heroTyping}>
            {typed}<span className={styles.cursor}>|</span>
          </p>

          <div className={styles.heroCtas}>
            <button className={styles.btnRed}   onClick={() => go("all")}>Shop The Drop</button>
            <button className={styles.btnGhost} onClick={() => go("all")}>View All Styles →</button>
          </div>
        </div>

        <div className={styles.heroStats}>
          {[["500+","Styles"],["30+","Brands"],["24h","Dispatch"],["Free","R500+ delivery"]].map(([n, l]) => (
            <div key={l} className={styles.heroStat}>
              <span className={styles.heroStatN}>{n}</span>
              <span className={styles.heroStatL}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className={styles.marqueeGroup}>
              {["THE DROP IS LIVE","PREMIUM KICKS","SA CULTURE","FREE DELIVERY R500+","30+ BRANDS","QUALITY CHECKED"].map(t => (
                <React.Fragment key={t}>
                  <span className={styles.marqueeText}>{t}</span>
                  <span className={styles.marqueeDot}>·</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SHOP WOMEN'S
      ══════════════════════════════════════ */}
      <section className={styles.splitSection}>
        <Reveal delay={0}>
          <div className={styles.splitText}>
            <div className={styles.sectionEye}><span className={styles.eyeBar}/> Women's Collection</div>
            <h2 className={styles.splitH2}>Shop<br/><em className={styles.splitOutline}>Women's.</em></h2>
            <p className={styles.splitDesc}>
              Fresh kicks for every look — classic, sporty, or bold. Shop top styles from Adidas, Nike, Vans &amp; more.
              Whether you're hitting the gym, heading out with friends, or keeping it cool on the weekend,
              our women's collection has you covered.
            </p>
            <button className={styles.btnWhite} onClick={() => go("women")}>Shop Women's →</button>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className={styles.splitImg}>
            <img src={WomenImg} alt="Women's Collection" />
            <span className={styles.splitTag}>Women</span>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════
          SHOP MEN'S
      ══════════════════════════════════════ */}
      <section className={`${styles.splitSection} ${styles.splitFlip}`}>
        <Reveal delay={0}>
          <div className={styles.splitImg}>
            <img src={MenImg} alt="Men's Collection" />
            <span className={styles.splitTag}>Men</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className={styles.splitText}>
            <div className={styles.sectionEye}><span className={styles.eyeBar}/> Men's Collection</div>
            <h2 className={styles.splitH2}>Shop<br/><em className={styles.splitOutline}>Men's.</em></h2>
            <p className={styles.splitDesc}>
              From street classics to modern essentials — step up your style with sneakers from Nike, Adidas,
              Timberland &amp; more. Discover the perfect pair to match your pace, whether you're keeping it
              clean or going bold.
            </p>
            <button className={styles.btnWhite} onClick={() => go("mens")}>Shop Men's →</button>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════
          BRAND SPOTLIGHT
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.sectionEye}><span className={styles.eyeBar}/> Brand Spotlight</div>
          <h2 className={styles.sectionH2}>The Biggest<br/><em className={styles.sectionOutline}>Names.</em></h2>
        </Reveal>

        <div className={styles.rivalGrid}>
          {[
            {
              logo: AdidasLogo, name: "Adidas",
              desc: "A leading sportswear brand offering high-quality shoes and apparel. Blending athletic performance with modern fashion — comfort, durability, and style for athletes and lifestyle enthusiasts around the world.",
            },
            {
              logo: NikeLogo, name: "Nike",
              desc: "A global sportswear brand known for innovative athletic footwear and apparel. Combining performance technology with stylish designs to inspire athletes and casual wearers alike.",
            },
          ].map(({ logo, name, desc }, i) => (
            <Reveal key={name} delay={i * 80}>
              <div className={styles.rivalCard} onClick={() => go("all")}>
                <div className={styles.rivalImgWrap}>
                  <img src={logo} alt={name} className={styles.rivalLogo} />
                </div>
                <div className={styles.rivalBody}>
                  <h3 className={styles.rivalName}>{name}</h3>
                  <p className={styles.rivalDesc}>{desc}</p>
                  <span className={styles.rivalCta}>Shop {name} →</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          LIMITED EDITION
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.sectionEye}><span className={styles.eyeBar}/> Limited Edition Drop</div>
          <h2 className={styles.sectionH2}>
            Nike SB × Air Jordan 4<br/>
            <em className={styles.sectionOutline}>"Navy".</em>
          </h2>
        </Reveal>

        <div className={styles.limitedGrid}>
          <Reveal delay={0} style={{ display: "contents" }}>
            <div className={styles.limitedMain}>
              <div className={styles.limitedMainImg}>
                <img src={MainShoe} alt="Nike SB x Air Jordan 4 Navy" />
                <span className={styles.limitedBadge}>Limited Drop</span>
              </div>
              <div className={styles.limitedMeta}>
                <h3 className={styles.limitedMetaName}>Nike SB × Air Jordan 4 "Navy"</h3>
                <p className={styles.limitedMetaDesc}>A fusion of basketball heritage and skateboarding functionality.</p>
                <div className={styles.limitedMetaRow}>
                  <span className={styles.limitedPrice}>R4,200</span>
                  <button className={styles.btnRed} onClick={() => go("all")}>Shop Now →</button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className={styles.limitedSide}>
            {[
              { img: BackShoe, tag: "Back View",  desc: "White leather with grey suede overlays and navy accents. Crimson Jumpman logo on tongue, embossed Nike SB branding on heel." },
              { img: SideShoe, tag: "Side View",  desc: "Gum rubber outsole with herringbone traction pattern. Poron foam sockliner for impact cushioning and flexibility." },
            ].map(({ img, tag, desc }, i) => (
              <Reveal key={tag} delay={i * 100}>
                <div className={styles.limitedSideCard}>
                  <div className={styles.limitedSideImg}>
                    <img src={img} alt={tag} />
                    <span className={styles.limitedSideTag}>{tag}</span>
                  </div>
                  <p className={styles.limitedSideDesc}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          INFO GRID
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <Reveal>
          <div className={styles.sectionEye}><span className={styles.eyeBar}/> Your Experience</div>
          <h2 className={styles.sectionH2}>Built<br/><em className={styles.sectionOutline}>For You.</em></h2>
        </Reveal>

        <div className={styles.infoGrid}>
          {[
            { icon:"🌐", title:"Access",       body:"Explore content tailored for your region. Our platform adapts to you — wherever you are in SA." },
            { icon:"🔒", title:"Privacy",      body:"Your data, your rules. We protect your personal information with bank-level security across every interaction." },
            { icon:"👤", title:"Profile",      body:"Manage your account, saved items, addresses, and order history — all in one place, always up to date." },
            { icon:"📅", title:"New Arrivals", body:"Discover the latest drops from the world's biggest brands. New styles added weekly — be first in line." },
          ].map(({ icon, title, body }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className={styles.infoCard}>
                <span className={styles.infoIcon}>{icon}</span>
                <div className={styles.infoBar} />
                <h3 className={styles.infoTitle}>{title}</h3>
                <p className={styles.infoBody}>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════ */}
      <Reveal>
        <div className={styles.ctaBand}>
          <div className={styles.ctaGrain} />
          <div className={styles.ctaLeft}>
            <p className={styles.ctaEye}>Ready to cop?</p>
            <h2 className={styles.ctaH2}>The Drop<br/><em className={styles.ctaOutline}>Is Waiting.</em></h2>
            <button className={styles.btnRed} onClick={() => go("all")}>Browse The Drop →</button>
          </div>
          <div className={styles.ctaRight}>
            {[["500+","Styles in stock"],["30+","Premium brands"],["4.9★","Average rating"],["24h","Order dispatch"]].map(([n,l]) => (
              <div key={l} className={styles.ctaStat}>
                <span className={styles.ctaStatN}>{n}</span>
                <span className={styles.ctaStatL}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}