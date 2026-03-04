import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try { setCartItems(JSON.parse(saved)); }
      catch (e) { console.error(e); localStorage.removeItem("cart"); }
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "cart") setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const sync = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const remove  = (id)        => sync(cartItems.filter(i => i.id !== id));
  const changeQ = (id, delta) => sync(cartItems.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : cartItems.length > 0 ? 89 : 0;
  const total    = subtotal + shipping;
  const savings  = cartItems.reduce((s, i) => s + (i.price * 0.28) * i.qty, 0);

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerEyebrow}>
            <div className={styles.redBar} />
            <span>ShoeNation RSA · Checkout</span>
          </div>
          <h1 className={styles.heading}>
            YOUR<br />
            <span className={styles.headingOutline}>BAG.</span>
          </h1>
          {cartItems.length > 0 && (
            <p className={styles.subheading}>
              {cartItems.reduce((s, i) => s + i.qty, 0)} item{cartItems.reduce((s,i)=>s+i.qty,0)!==1?"s":""} · {shipping === 0 ? <span className={styles.freeShip}>Free delivery unlocked 🎉</span> : `R${(500 - subtotal).toFixed(2)} away from free delivery`}
            </p>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Your bag is empty</h2>
            <p className={styles.emptyDesc}>Looks like you haven't added anything yet. The drop is waiting.</p>
            <button className={styles.emptyBtn} onClick={() => navigate("/products")}>
              Browse The Drop
            </button>
          </div>
        ) : (
          <div className={styles.layout}>

            {/* ── LEFT: BAG ITEMS ── */}
            <div className={styles.bagSection}>

              {cartItems.map((item, idx) => (
                <div key={item.id} className={styles.cartItem} style={{ animationDelay: `${idx * 0.07}s` }}>

                  {/* image */}
                  <div className={styles.imgWrap}>
                    <img src={item.image} alt={item.name} className={styles.img} />
                  </div>

                  {/* details */}
                  <div className={styles.details}>
                    <div className={styles.itemTop}>
                      <div>
                        <p className={styles.itemCat}>{item.category || "Sneakers"}</p>
                        <h3 className={styles.itemName}>{item.name}</h3>
                      </div>
                      <div className={styles.itemPrice}>
                        <span className={styles.priceSale}>R{(item.price * item.qty).toFixed(2)}</span>
                        <span className={styles.priceOrig}>R{(item.price * item.qty * 1.28).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className={styles.itemMeta}>
                      <span className={styles.metaTag}>Size: UK 8</span>
                      <span className={styles.metaTag}>{item.category || "Sneakers"}</span>
                    </div>

                    <div className={styles.itemBottom}>
                      {/* qty */}
                      <div className={styles.qtyRow}>
                        <button className={styles.qtyBtn} onClick={() => changeQ(item.id, -1)}>−</button>
                        <span className={styles.qtyVal}>{item.qty}</span>
                        <button className={styles.qtyBtn} onClick={() => changeQ(item.id, 1)}>+</button>
                      </div>

                      {/* actions */}
                      <div className={styles.actions}>
                        <button className={styles.removeBtn} onClick={() => remove(item.id)}>
                          Remove
                        </button>
                        <button className={styles.saveBtn} onClick={() => navigate("/products")}>
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* continue shopping */}
              <button className={styles.backBtn} onClick={() => navigate("/products")}>
                ← Continue Shopping
              </button>
            </div>

            {/* ── RIGHT: SUMMARY ── */}
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>
                <span className={styles.summaryCount}>{cartItems.reduce((s,i)=>s+i.qty,0)} items</span>
              </div>

              {/* savings callout */}
              {savings > 0 && (
                <div className={styles.savingsBox}>
                  <span className={styles.savingsIcon}>🏷</span>
                  <span>You're saving <strong>R{savings.toFixed(2)}</strong> on this order</span>
                </div>
              )}

              {/* line items */}
              <div className={styles.summaryRows}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.row}>
                  <span>Delivery</span>
                  <span className={shipping === 0 ? styles.freeText : ""}>
                    {shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className={styles.row}>
                  <span>VAT (incl.)</span>
                  <span>—</span>
                </div>
              </div>

              {/* free shipping progress */}
              {shipping > 0 && (
                <div className={styles.progressWrap}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                  </div>
                  <p className={styles.progressLabel}>Add R{(500 - subtotal).toFixed(2)} more for free delivery</p>
                </div>
              )}

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>

              <button className={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>

              <button className={styles.paypalBtn}>
                <span style={{ fontWeight: 400 }}>Pay</span>
                <span style={{ color: "#009cde" }}>Pal</span>
              </button>

              {/* trust badges */}
              <div className={styles.trustRow}>
                {[["🔒","Secure payment"],["↩️","30-day returns"],["🚚","Fast delivery"]].map(([icon, lbl]) => (
                  <div key={lbl} className={styles.trustItem}>
                    <span>{icon}</span>
                    <span>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;