import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo / Title */}
        <div className={styles.footerSection}>
          <h2 className={styles.logo}>SneakerVerse</h2>

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        {/* Links Section */}
        <div className={styles.footerLinks}>
          <div>
            <h3>Sneakers</h3>
            <ul>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Top Rated</a></li>
              <li><a href="#">Limited Edition</a></li>
            </ul>
          </div>
          <div>
            <h3>Discover</h3>
            <ul>
              <li><a href="#">Sneaker News</a></li>
              <li><a href="#">Brand Spotlights</a></li>
              <li><a href="#">How to Spot Fakes</a></li>
            </ul>
          </div>
          <div>
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
