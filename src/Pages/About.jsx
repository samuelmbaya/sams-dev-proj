import React from "react";
import styles from "./About.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ✅ Import your video and logo image
import aboutvid from "../assets/aboutvid.mp4";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>

      <div className={styles.aboutContainer}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>
            Welcome to <br /> <span>SneakerVerse</span>
          </h1>
          <p className={styles.subtitle}>Where sneaker culture lives and breathes.</p>

          <div className={styles.storySection}>
            <h3>Our Story</h3>
            <p>
              SneakerVerse began with a simple idea: to create a space where sneaker
              enthusiasts—from collectors to casual wearers—can connect, learn, and stay
              in the know. What started as a passion project quickly evolved into a
              growing community of people who love sneakers for their history, design,
              and cultural impact.
            </p>
          </div>

          <div className={styles.aboutSection}>
            <h3>What We're About</h3>
            <p>
              At SneakerVerse, we cover everything from the hottest drops and detailed
              reviews to care tips, trend forecasts, and style inspiration. Whether
              you're copping your first pair or your fiftieth, we've got something for
              you.
            </p>
          </div>

          <div className={styles.movementSection}>
            <h3>Join the Movement</h3>
            <p>
              Sneakers aren’t just shoes—they’re a lifestyle. Be part of something
              bigger. Follow us, explore new content, and step into the culture with us.
            </p>
          </div>

          <form className={styles.contactForm}>
            <h3>Contact me</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>First name</label>
                <input type="text" placeholder="Jane" />
              </div>
              <div className={styles.formGroup}>
                <label>Last name</label>
                <input type="text" placeholder="Smitherton" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email address</label>
              <input type="email" placeholder="email@janesfakedomain.net" />
            </div>

            <div className={styles.formGroup}>
              <label>Your message</label>
              <textarea placeholder="Enter your question or message" rows="5"></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.logoCard}>
            {/* ✅ Full-size video */}
            <video
              src={aboutvid}
              autoPlay
              loop
              muted
              playsInline
              className={styles.aboutVideo}
            ></video>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
