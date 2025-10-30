import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        setCartCount(count);
      } catch (err) {
        console.error('Error reading cart from localStorage:', err);
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Poll every 300ms for live updates
    const interval = setInterval(updateCartCount, 1);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => window.location.href = '/home'}>
        Sneaker<span>Verse</span>
      </div>
      <div className={styles.links}>
        <Link to="/home">Home</Link>
        <Link to="/brief">Brief</Link>
        <Link to="/about">About</Link>
        <Link to="/products">Shop</Link>
        <Link to="/cart">
          Cart
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </Link>
        <Link to="/orders">Orders</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
