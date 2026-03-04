import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Navbar from '../components/Navbar';
import BlurText from '../components/BlurText';
import TextType from '../components/TextType';
import GlareHover from '../components/GlareHover';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>

      {/* ── FIXED NAVBAR ── */}
      <div className={styles.fixedNavbar}>
        <Navbar />
      </div>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className={styles.hero}>
        {/* background grain */}
        <div className={styles.grain} />

        {/* eyebrow */}
        <div className={styles.eyebrow}>
          <div className={styles.eyebrowBar} />
          <span>ShoeNation RSA · Official Store · Est. 2024</span>
        </div>

        {/* main headline */}
        <div className={styles.heroHeadline}>
          <BlurText
            text="THE DROP IS"
            delay={80}
            animateBy="words"
            direction="top"
            className={styles.heroLine1}
          />
          <BlurText
            text="LIVE."
            delay={160}
            animateBy="words"
            direction="top"
            className={styles.heroLine2}
          />
        </div>

        {/* typing subtext */}
        <div className={styles.heroSub}>
          <TextType
            text={[
              "Step into the ShoeNation.RSA — your ultimate destination for exclusive drops.",
              "Iconic kicks, rare finds, and timeless sneaker culture await.",
              "Discover what's next in the world of sneakers.",
            ]}
            typingSpeed={65}
            pauseDuration={1800}
            showCursor={true}
            cursorCharacter="|"
          />
        </div>

        {/* CTA row */}
        <div className={styles.heroCta}>
          <button className={styles.ctaPrimary} onClick={() => navigate('/products')}>
            Shop The Drop
          </button>
          <button className={styles.ctaSecondary} onClick={() => navigate('/about')}>
            Our Story
          </button>
        </div>

        {/* scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BANNER IMAGE
      ══════════════════════════════════════════ */}
      <section className={styles.bannerSection}>
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.18}
          glareAngle={-25}
          glareSize={500}
          transitionDuration={900}
          playOnce={false}
        >
          <div className={styles.lpbanner}>
            <div className={styles.bannerOverlay} />
            <div className={styles.bannerTag}>
              <span className={styles.bannerTagDot} />
              New Arrivals · Season 2025
            </div>
          </div>
        </GlareHover>
      </section>

      {/* ══════════════════════════════════════════
          IN-STORE ICONS
      ══════════════════════════════════════════ */}
      <section className={styles.iconsSection}>
        <div className={styles.iconsSectionHeader}>
          <div>
            <div className={styles.sectionEyebrow}>
              <div className={styles.eyebrowBar} />
              <span>Featured</span>
            </div>
            <h2 className={styles.sectionHeading}>
              In-Store<br />
              <span className={styles.headingOutline}>Icons.</span>
            </h2>
          </div>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.25}
            glareAngle={-30}
            glareSize={200}
            transitionDuration={700}
          >
            <button className={styles.shopIconsBtn} onClick={() => navigate('/products')}>
              Shop Now →
            </button>
          </GlareHover>
        </div>

        {/* cards */}
        <div className={styles.iconCards}>
          {[
            {
              cls: styles.card1,
              name: 'Adidas Samba',
              desc: 'Timeless, street-ready, and always iconic.',
            },
            {
              cls: styles.card2,
              name: 'Chuck Taylor All Star',
              desc: 'Born for the court, owned by the culture.',
            },
            {
              cls: styles.card3,
              name: 'Nike Air Max 1 \'86',
              desc: 'Big bubble, bold style, pure Air heritage.',
            },
          ].map(({ cls, name, desc }) => (
            <GlareHover
              key={name}
              glareColor="#ffffff"
              glareOpacity={0.2}
              glareAngle={-30}
              glareSize={320}
              transitionDuration={800}
            >
              <div className={`${styles.iconCard} ${cls}`} onClick={() => navigate('/products')}>
                {/* gradient overlay */}
                <div className={styles.cardOverlay} />
                {/* content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardRedLine} />
                  <p className={styles.cardName}>{name}</p>
                  <p className={styles.cardDesc}>{desc}</p>
                  <span className={styles.cardCta}>Explore →</span>
                </div>
              </div>
            </GlareHover>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════ */}
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {Array(3).fill(["SHOE NATION RSA", "THE DROP", "EXCLUSIVE KICKS", "SA CULTURE", "STREET READY", "FRESH PAIRS"]).flat().map((t, i) => (
            <span key={i} className={styles.marqueeItem}>
              {t} <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SOUL SECTION
      ══════════════════════════════════════════ */}
      <section className={styles.soulSection}>
        <div className={styles.soulLeft}>
          <div className={styles.sectionEyebrow}>
            <div className={styles.eyebrowBar} />
            <span>Our Philosophy</span>
          </div>
          <h2 className={styles.soulHeading}>
            From Sole<br />
            <span className={styles.headingOutline}>To Soul.</span>
          </h2>
          <p className={styles.soulSub}>Where Performance Meets Passion</p>
          <p className={styles.soulBody}>
            Our sneakers are crafted with care from sole to soul, blending innovative technology
            with thoughtful design to support your every move. The sole delivers the perfect
            balance of cushioning and durability, while the upper wraps your foot in breathable
            comfort and timeless style.
          </p>
          <p className={styles.soulBody}>
            More than just footwear — it's a connection from the ground beneath you to the energy
            and passion within. Each pair represents a harmony of craftsmanship and creativity,
            made for those who walk their own path and move with purpose.
          </p>
          <button className={styles.soulBtn} onClick={() => navigate('/about')}>
            Read Our Story →
          </button>
        </div>

        <div className={styles.soulRight}>
          <div className={styles.soulImgWrap}>
            <div className={styles.soulimg} />
            {/* floating stat cards */}
            <div className={`${styles.statCard} ${styles.statCard1}`}>
              <span className={styles.statNum}>30+</span>
              <span className={styles.statLbl}>Exclusive Brands</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCard2}`}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLbl}>Styles In Stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA BAND
      ══════════════════════════════════════════ */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBandInner}>
          <h2 className={styles.ctaBandHeading}>Ready to cop?</h2>
          <p className={styles.ctaBandSub}>The drop won't wait. Neither should you.</p>
          <button className={styles.ctaBandBtn} onClick={() => navigate('/products')}>
            Browse The Drop
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;