import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* red top accent */}
      <div className={styles.accent} />

      <div className={styles.inner}>

        {/* ── TOP ROW ── */}
        <div className={styles.top}>

          {/* Brand col */}
          <div className={styles.brand}>
            <Link to="/home" className={styles.logo}>
              Shoe<span>Nation</span><em>.RSA</em>
            </Link>
            <p className={styles.tagline}>
              Premium sneakers. SA prices.<br />
              Every pair quality checked before it ships.
            </p>

            {/* socials */}
            <div className={styles.socials}>
              {[
                { icon: <FaInstagram />, label: "Instagram", href: "#" },
                { icon: <FaFacebookF />, label: "Facebook",  href: "#" },
                { icon: <FaYoutube />,   label: "YouTube",   href: "#" },
                { icon: <FaLinkedinIn />,label: "LinkedIn",  href: "#" },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href} aria-label={label} className={styles.socialIcon}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          <div className={styles.linkCols}>
            {[
              {
                heading: "Shop",
                links: [
                  { label: "New Arrivals",    to: "/products" },
                  { label: "Men's",           to: "/products" },
                  { label: "Women's",         to: "/products" },
                  { label: "Kids'",           to: "/products" },
                  { label: "Limited Edition", to: "/products" },
                ],
              },
              {
                heading: "Discover",
                links: [
                  { label: "Sneaker News",      to: "#" },
                  { label: "Brand Spotlights",  to: "#" },
                  { label: "How to Spot Fakes", to: "#" },
                  { label: "Style Guides",      to: "#" },
                ],
              },
              {
                heading: "Support",
                links: [
                  { label: "Contact Us",        to: "#" },
                  { label: "Shipping & Returns",to: "#" },
                  { label: "Size Guide",        to: "#" },
                  { label: "Terms & Conditions",to: "#" },
                ],
              },
            ].map(({ heading, links }) => (
              <div key={heading} className={styles.col}>
                <h3 className={styles.colHeading}>{heading}</h3>
                <ul className={styles.colList}>
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} className={styles.colLink}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className={styles.trustStrip}>
          {[
            ["🚚", "Free Delivery", "On orders above R500"],
            ["↩️", "30-Day Returns", "Hassle-free, no questions"],
            ["🔒", "Secure Checkout", "SSL encrypted payments"],
            ["🇿🇦", "SA Based",       "Ships from Johannesburg"],
          ].map(([icon, title, desc]) => (
            <div key={title} className={styles.trustItem}>
              <span className={styles.trustIcon}>{icon}</span>
              <div>
                <div className={styles.trustTitle}>{title}</div>
                <div className={styles.trustDesc}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} ShoeNation RSA. All rights reserved.
          </span>
          <div className={styles.bottomLinks}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(l => (
              <a key={l} href="#" className={styles.bottomLink}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;