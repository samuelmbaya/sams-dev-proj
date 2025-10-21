import React from 'react';
import { useNavigate } from 'react-router-dom'; // ← added for navigation
import styles from './Home.module.css';
import Navbar from '../components/Navbar';
import BlurText from '../components/BlurText';
import TextType from '../components/TextType';
import GlareHover from '../components/GlareHover';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate(); // ← initialize navigate

  const handleAnimationComplete = () => {
    console.log('Landing page title animation complete!');
  };

  // ← function for Shop Now button
  const handleShopNowClick = () => {
    navigate('/products');
  };

  return (
    <div className={styles.home}>
      {/* ✅ Wrap Navbar with GlareHover */}
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-20}
        glareSize={400}
        transitionDuration={800}
        playOnce={false}
      >
        <div className={styles.fixedNavbar}>
          <Navbar />
        </div>
      </GlareHover>

      {/* Animated landing page title */}
      <div className={styles.titleWrapper}>
        <BlurText
          text="From Sole to Soul - Discover the Culture. Live the Style."
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className={styles.lptitle}
        />
      </div>

      {/* Typing intro text */}
      <div className={styles.lpintro}>
        <TextType
          text={[
            "Step into the Sneakerverse — your ultimate destination for exclusive drops.",
            "Iconic kicks, rare finds, and timeless sneaker culture await.",
            "Discover what’s next in the world of sneakers!"
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </div>

      {/* ✅ Banner with glare hover */}
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={0.25}
        glareAngle={-25}
        glareSize={350}
        transitionDuration={900}
        playOnce={false}
      >
        <div className={styles.lpbanner}></div>
      </GlareHover>

      <div className={styles.iconsHeaderRow}>
        <h1 className={styles.iconheader}>In-Store Icons</h1>

        {/* ✅ Shop button with glare and navigation */}
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={200}
          transitionDuration={700}
          playOnce={false}
        >
          <button
            className={styles.shopicons}
            onClick={handleShopNowClick} // ← navigation added
          >
            Shop Now
          </button>
        </GlareHover>
      </div>

      {/* Sneaker cards with glare hover */}
      <div className={styles.iconcards}>
        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
        >
          <div className={styles.airmax1}>
            <div className={styles.airmax1c}>
              <p className={styles.airmax1c1}>Adidas Samba</p>
              <p className={styles.airmax1c2}>
                Timeless, street-ready, and <br /> always iconic.
              </p>
            </div>
          </div>
        </GlareHover>

        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
        >
          <div className={styles.adisamba}>
            <div className={styles.adisambac}>
              <p className={styles.adisambac1}>Chuck Taylor All Star</p>
              <p className={styles.adisambac2}>
                Born for the court, owned by the <br /> culture.
              </p>
            </div>
          </div>
        </GlareHover>

        <GlareHover
          glareColor="#ffffff"
          glareOpacity={0.25}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
        >
          <div className={styles.chuckconverse}>
            <div className={styles.chuckconversec}>
              <p className={styles.chuckconversec1}>
                Nike Air Max 1 '86 "Sport Royal"
              </p>
              <p className={styles.chuckconversec2}>
                The legend returns — big bubble, <br /> bold style, pure Air
                heritage.
              </p>
            </div>
          </div>
        </GlareHover>
      </div>

      <div className={styles.soul2soul}>
        <h1 className={styles.soulh1}>From Sole To Soul</h1>
        <p className={styles.soulsub}>Where Performance Meets Passion</p>
        <p className={styles.soulp}>
          Our sneakers are crafted with care from sole to soul, blending innovative technology with thoughtful design to support your every move.
          The sole delivers the perfect balance of cushioning and durability, while the upper wraps your foot in breathable comfort and timeless style.
          More than just footwear, it’s a connection from the ground beneath you to the energy and passion within.
          Each pair represents a harmony of craftsmanship and creativity — made for those who walk their own path and move with purpose.
          Whether you’re pushing limits, chasing dreams, or simply embracing the rhythm of everyday life, these sneakers are built to follow your journey.
          Every detail, from the stitching to the silhouette, is designed to inspire confidence and express individuality.
        </p>
      </div>

      <div className={styles.soulimg}></div>
      <Footer />
    </div>
  );
};

export default Home;
