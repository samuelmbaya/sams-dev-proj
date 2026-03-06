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
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div className={styles.fixedNav}><Navbar /></div>
      <div className={styles.page}>
        <div className={styles.grain} />

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerEyebrow}>
            <div className={styles.eyeBar} />
            <span>ShoeNation RSA · Checkout</span>
          </div>

          <div className={styles.headingRow}>
            <div className={styles.headingLeft}>
              {/* bg watermark */}
              <span className={styles.bgNum} aria-hidden="true">BAG</span>
              <h1 className={styles.heading}>
                <span className={styles.headingLine}>YOUR</span>
                <span className={styles.headingLine}>
                  <em className={styles.headingStroke}>BAG.</em>
                </span>
              </h1>
            </div>

            {cartItems.length > 0 && (
              <div className={styles.headingMeta}>
                <div className={styles.headingMetaNum}>{itemCount}</div>
                <div className={styles.headingMetaLabel}>
                  item{itemCount !== 1 ? "s" : ""}<br />in bag
                </div>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <p className={styles.subheading}>
              {shipping === 0
                ? <><span className={styles.freeShip}>✓ Free delivery unlocked</span></>
                : <>Add <strong>R{(500 - subtotal).toFixed(2)}</strong> more for free delivery</>
              }
            </p>
          )}

          {/* free shipping progress bar — inline under heading */}
          {cartItems.length > 0 && shipping > 0 && (
            <div className={styles.headerProgress}>
              <div className={styles.headerProgressFill}
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className={styles.empty}>
            <span className={styles.emptyNum} aria-hidden="true">0</span>
            <div className={styles.emptyInner}>
              <div className={styles.emptyEye}><div className={styles.eyeBar} /><span>Your Bag</span></div>
              <h2 className={styles.emptyTitle}>Nothing<br /><em className={styles.emptyStroke}>Here.</em></h2>
              <p className={styles.emptyDesc}>You haven't added anything yet. The drop is waiting.</p>
              <button className={styles.emptyBtn} onClick={() => navigate("/products")}>
                <span className={styles.emptyBtnBg} />
                <span className={styles.emptyBtnLabel}>Browse The Drop →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.layout}>

            {/* ══════════════════════
                LEFT: BAG ITEMS
            ══════════════════════ */}
            <div className={styles.bagSection}>

              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={styles.cartItem}
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  {/* image */}
                  <div className={styles.imgWrap}>
                    <img src={item.image} alt={item.name} className={styles.img} />
                    {/* index badge */}
                    <span className={styles.imgIdx}>{String(idx + 1).padStart(2, "0")}</span>
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
                      <span className={styles.saveBadge}>−28%</span>
                    </div>

                    <div className={styles.itemBottom}>
                      {/* qty control */}
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
                        <span className={styles.actionDivider}>·</span>
                        <button className={styles.saveBtn} onClick={() => navigate("/products")}>
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* continue */}
              <button className={styles.backBtn} onClick={() => navigate("/products")}>
                ← Continue Shopping
              </button>
            </div>

            {/* ══════════════════════
                RIGHT: SUMMARY
            ══════════════════════ */}
            <div className={styles.summary}>
              {/* top red accent */}
              <div className={styles.summaryAccent} />
              {/* grain */}
              <div className={styles.summaryGrain} />

              {/* watermark */}
              <span className={styles.summaryBgText} aria-hidden="true">PAY</span>

              <div className={styles.summaryInner}>
                {/* header */}
                <div className={styles.summaryHeader}>
                  <div className={styles.summaryEye}><div className={styles.eyeBar} /><span>Order Summary</span></div>
                  <span className={styles.summaryCount}>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                </div>

                <h2 className={styles.summaryTitle}>
                  Total<br />
                  <em className={styles.summaryStroke}>Due.</em>
                </h2>

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
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill}
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
                    </div>
                    <p className={styles.progressLabel}>
                      R{(500 - subtotal).toFixed(2)} away from free delivery
                    </p>
                  </div>
                )}

                {/* total */}
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>TOTAL</span>
                  <span className={styles.totalAmt}>R{total.toFixed(2)}</span>
                </div>

                {/* checkout cta — slash button */}
                <button className={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
                  <span className={styles.checkoutBg} />
                  <span className={styles.checkoutLabel}>Proceed to Checkout →</span>
                </button>

                {/* paypal */}
                <button className={styles.paypalBtn}>
                  <span style={{ fontWeight: 400 }}>Pay</span>
                  <span style={{ color: "#009cde" }}>Pal</span>
                </button>

                {/* trust */}
                <div className={styles.trustRow}>
                  {[["🔒","Secure"],["↩️","30-day returns"],["🚚","Fast delivery"]].map(([icon, lbl]) => (
                    <div key={lbl} className={styles.trustItem}>
                      <span>{icon}</span>
                      <span>{lbl}</span>
                    </div>
                  ))}
                </div>
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