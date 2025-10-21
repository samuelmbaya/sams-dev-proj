import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cart data:", e);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Sync cart data across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        const updatedCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCartItems(updatedCart);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateLocalStorage = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updated);
  };

  const changeQuantity = (id, delta) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    updateLocalStorage(updated);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping = cartItems.length > 0 ? 8.0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // ✅ Redirect to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className={styles.cartPage}>
        <div className={styles.cartLayout}>
          {/* Left - bag items */}
          <div className={styles.bagSection}>
            <h2 className={styles.sectionTitle}>Your Bag</h2>
            {cartItems.length === 0 ? (
              <p className={styles.emptyMsg}>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                  </div>

                  <div className={styles.details}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemMeta}>
                      <span>Size: 8</span>
                      <span className={styles.dot}>•</span>
                      <span>Quantity:</span>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>{item.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.linkBtn}
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className={styles.price}>R{item.price.toFixed(2)}</div>
                </div>
              ))
            )}

            <button
              className={styles.shopBtn}
              onClick={() => navigate("/products")}
            >
              Back
            </button>
          </div>

          {/* Right - summary */}
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated Shipping</span>
              <span>R{shipping.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Estimated Tax</span>
              <span>—</span>
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>

            {/* Redirect to checkout */}
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
            <button className={styles.paypalBtn}>PayPal</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
