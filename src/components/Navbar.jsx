import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  /* ── cart count (live) ── */
  useEffect(() => {
    const update = () => {
      try {
        const cart  = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        setCartCount(count);
      } catch { setCartCount(0); }
    };
    update();
    const id = setInterval(update, 300);
    return () => clearInterval(id);
  }, []);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close menu on route change ── */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const NAV_LINKS = [
    { to: '/home',     label: 'Home'    },
    { to: '/products', label: 'Shop'    },
    { to: '/about',    label: 'About'   },
    { to: '/orders',   label: 'Orders'  },
    { to: '/profile',  label: 'Profile' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>

        {/* ── LEFT: logo ── */}
        <Link to="/home" className={styles.logo}>
          Shoe<span>Nation</span>
          <em>.RSA</em>
        </Link>

        {/* ── CENTRE: links (desktop) ── */}
        <div className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.link} ${isActive(to) ? styles.active : ''}`}
            >
              {label}
              {isActive(to) && <span className={styles.activeDot} />}
            </Link>
          ))}
        </div>

        {/* ── RIGHT: cart + hamburger ── */}
        <div className={styles.right}>
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>

          {/* hamburger (mobile) */}
          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerInner}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.drawerLink} ${isActive(to) ? styles.drawerActive : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/cart" className={styles.drawerCartLink}>
            Cart
            {cartCount > 0 && <span className={styles.drawerBadge}>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;