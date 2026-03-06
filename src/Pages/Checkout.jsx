import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Checkout.module.css";

/* ── helpers ── */
const pp = p => typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.-]+/g,""))||0;

const DELIVERY = {
  standard: { label:"Standard Delivery", sub:"3–5 business days", cost:89,   icon:"📦" },
  express:  { label:"Express Delivery",  sub:"1–2 business days", cost:149,  icon:"⚡" },
  sameday:  { label:"Same-Day Delivery", sub:"Order before 12pm",  cost:199,  icon:"🛵" },
};

const PAYMENT = [
  { key:"card",   label:"Credit / Debit Card", icon:"💳" },
  { key:"applepay", label:"Apple Pay",          icon:"🍎" },
  { key:"gpay",   label:"Google Pay",           icon:"G"  },
  { key:"cod",    label:"Pay on Delivery",      icon:"🏠" },
];

/* card number formatter */
const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExp  = v => {
  const d = v.replace(/\D/g,"").slice(0,4);
  return d.length>2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
};

/* step indicator */
const STEPS = ["Contact","Delivery","Payment","Review"];

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);   // 0-2 are form steps, 3 is review

  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", street:"", city:"", province:"", postalCode:"" });
  const [payment, setPayment] = useState({ method:"card", cardName:"", cardNumber:"", expiry:"", cvv:"" });
  const [delivery, setDelivery] = useState("standard");
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(saved);
    } catch {}
    // pre-fill from stored user
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u) setForm(f => ({
        ...f,
        firstName: u.name?.split(" ")[0] || "",
        lastName:  u.name?.split(" ").slice(1).join(" ") || "",
        email:     u.email || "",
        phone:     u.phone || "",
      }));
    } catch {}
  }, []);

  /* ── derived totals ── */
  const subtotal     = cartItems.reduce((s,i) => s + pp(i.price)*i.qty, 0);
  const deliveryCost = DELIVERY[delivery].cost;
  const freeShip     = subtotal >= 500;
  const shipCharge   = freeShip ? 0 : deliveryCost;
  const discount     = subtotal * 0.15;
  const total        = subtotal - discount + shipCharge;

  /* ── field change ── */
  const handleForm    = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePayment = e => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cardNumber") v = fmtCard(value);
    if (name === "expiry")     v = fmtExp(value);
    if (name === "cvv")        v = value.replace(/\D/g,"").slice(0,4);
    setPayment(p => ({ ...p, [name]: v }));
  };

  /* ── validation per step ── */
  const validate = s => {
    const e = {};
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = "Required";
      if (!form.lastName.trim())  e.lastName  = "Required";
      if (!form.email.trim())     e.email     = "Required";
      if (!form.phone.trim())     e.phone     = "Required";
    }
    if (s === 1) {
      if (!form.street.trim())     e.street     = "Required";
      if (!form.city.trim())       e.city       = "Required";
      if (!form.postalCode.trim()) e.postalCode = "Required";
    }
    if (s === 2 && payment.method === "card") {
      if (!payment.cardName.trim())            e.cardName   = "Required";
      if (payment.cardNumber.replace(/\s/g,"").length < 16) e.cardNumber = "Enter 16 digits";
      if (payment.expiry.length < 5)           e.expiry     = "MM/YY";
      if (payment.cvv.length < 3)              e.cvv        = "3–4 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s+1); };
  const back = () => { setErrors({}); setStep(s => Math.max(0, s-1)); };

  /* ── place order ── */
  const placeOrder = async () => {
    if (!cartItems.length) return;
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400)); // simulate processing

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      email: form.email,
      ...form,
      cartItems,
      subtotal, discount, deliveryCost: shipCharge, total,
      delivery, paymentMethod: payment.method,
      status: "processing",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existing, order]));
    localStorage.removeItem("cart");

    setDone(true);
    setPlacing(false);
  };

  /* ── field UI helper ── */
  const Field = ({ name, label, type="text", placeholder, half, fm="contact", ...rest }) => {
    const val = fm==="contact" ? form[name] : payment[name];
    const onChange = fm==="contact" ? handleForm : handlePayment;
    const err = errors[name];
    return (
      <div className={`${styles.field} ${half ? styles.fieldHalf : ""}`}>
        <label className={styles.label}>{label}</label>
        <input
          className={`${styles.input} ${err ? styles.inputErr : ""}`}
          type={type} name={name} value={val||""}
          onChange={onChange} placeholder={placeholder}
          autoComplete="off" {...rest}
        />
        {err && <span className={styles.fieldErr}>{err}</span>}
      </div>
    );
  };

  /* ══════════════════════════════════════════
     SUCCESS SCREEN
  ══════════════════════════════════════════ */
  if (done) return (
    <div className={styles.page}>
      <div className={styles.navWrap}><Navbar /></div>
      <div className={styles.successScreen}>
        <div className={styles.successIcon}>✓</div>
        <div className={styles.successEye}><div className={styles.eyeBar}/>Order Confirmed</div>
        <h1 className={styles.successTitle}>
          You're<br/><span className={styles.successOutline}>All Set.</span>
        </h1>
        <p className={styles.successSub}>Your order has been placed and is being processed. You'll receive a confirmation at <strong>{form.email}</strong>.</p>
        <div className={styles.successActions}>
          <button className={styles.btnRed} onClick={() => navigate("/orders")}>Track My Order →</button>
          <button className={styles.btnGhost} onClick={() => navigate("/products")}>Continue Shopping</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  /* ══════════════════════════════════════════
     MAIN
  ══════════════════════════════════════════ */
  return (
    <div className={styles.page}>
      <div className={styles.navWrap}><Navbar /></div>

      <main className={styles.main}>

        {/* ── HEADER ── */}
        <div className={styles.pageHeader}>
          <button className={styles.backLink} onClick={() => navigate("/cart")}>
            ← Back to cart
          </button>
          <div className={styles.pageEye}><div className={styles.eyeBar}/><span>Secure Checkout</span></div>
          <h1 className={styles.pageTitle}>Check<br/><span className={styles.titleOutline}>Out.</span></h1>
        </div>

        {/* ── STEPPER ── */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${i < step ? styles.stepDone : i === step ? styles.stepActive : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ""}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ""}`}/>}
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className={styles.body}>

          {/* ── LEFT: form ── */}
          <div className={styles.formCol}>

            {/* STEP 0: CONTACT */}
            {step === 0 && (
              <div className={styles.formCard}>
                <div className={styles.cardHead}>
                  <div className={styles.eyeBar}/>
                  <span>Contact Information</span>
                </div>
                <div className={styles.fieldRow}>
                  <Field name="firstName" label="First Name"    placeholder="Jane"              half fm="contact"/>
                  <Field name="lastName"  label="Last Name"     placeholder="Smith"             half fm="contact"/>
                </div>
                <div className={styles.fieldRow}>
                  <Field name="email"     label="Email Address" placeholder="you@example.com"   half fm="contact" type="email"/>
                  <Field name="phone"     label="Phone Number"  placeholder="+27 82 000 0000"   half fm="contact" type="tel"/>
                </div>
                <div className={styles.formNav}>
                  <span/>
                  <button className={styles.btnRed} onClick={next}>Continue to Delivery →</button>
                </div>
              </div>
            )}

            {/* STEP 1: DELIVERY */}
            {step === 1 && (
              <div className={styles.formCard}>
                <div className={styles.cardHead}><div className={styles.eyeBar}/><span>Delivery Address</span></div>
                <div className={styles.fieldRow}>
                  <Field name="street"     label="Street Address" placeholder="123 Mandela Ave" fm="contact"/>
                </div>
                <div className={styles.fieldRow}>
                  <Field name="city"       label="City"     placeholder="Johannesburg" half fm="contact"/>
                  <Field name="province"   label="Province" placeholder="Gauteng"      half fm="contact"/>
                </div>
                <div className={styles.fieldRow}>
                  <Field name="postalCode" label="Postal Code" placeholder="2000"      half fm="contact"/>
                </div>

                {/* delivery options */}
                <div className={styles.cardHead} style={{ marginTop: 20 }}><div className={styles.eyeBar}/><span>Delivery Method</span></div>
                <div className={styles.deliveryGrid}>
                  {Object.entries(DELIVERY).map(([key, opt]) => (
                    <button
                      key={key}
                      className={`${styles.deliveryCard} ${delivery === key ? styles.deliveryCardOn : ""}`}
                      onClick={() => setDelivery(key)}
                    >
                      <span className={styles.deliveryIcon}>{opt.icon}</span>
                      <div className={styles.deliveryInfo}>
                        <span className={styles.deliveryLabel}>{opt.label}</span>
                        <span className={styles.deliverySub}>{opt.sub}</span>
                      </div>
                      <span className={styles.deliveryCost}>
                        {freeShip && key === "standard" ? <span style={{color:"#4ADE80"}}>Free</span> : `R${opt.cost}`}
                      </span>
                    </button>
                  ))}
                </div>
                {freeShip && (
                  <div className={styles.freeShipBanner}>
                    <span>🎉</span> You qualify for free standard delivery!
                  </div>
                )}

                <div className={styles.formNav}>
                  <button className={styles.btnGhost} onClick={back}>← Back</button>
                  <button className={styles.btnRed} onClick={next}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className={styles.formCard}>
                <div className={styles.cardHead}><div className={styles.eyeBar}/><span>Payment Method</span></div>

                <div className={styles.payGrid}>
                  {PAYMENT.map(p => (
                    <button
                      key={p.key}
                      className={`${styles.payCard} ${payment.method === p.key ? styles.payCardOn : ""}`}
                      onClick={() => setPayment(pm => ({ ...pm, method: p.key }))}
                    >
                      <span className={styles.payIcon}>{p.icon}</span>
                      <span className={styles.payLabel}>{p.label}</span>
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className={styles.cardForm}>
                    {/* visual card preview */}
                    <div className={styles.cardPreview}>
                      <div className={styles.cardPreviewChip}>▬▬</div>
                      <div className={styles.cardPreviewNum}>
                        {(payment.cardNumber || "•••• •••• •••• ••••").padEnd(19,"•").replace(/(.{4})/g,"$1 ").trim()}
                      </div>
                      <div className={styles.cardPreviewRow}>
                        <div>
                          <div className={styles.cardPreviewLbl}>Card Holder</div>
                          <div className={styles.cardPreviewVal}>{payment.cardName || "YOUR NAME"}</div>
                        </div>
                        <div>
                          <div className={styles.cardPreviewLbl}>Expires</div>
                          <div className={styles.cardPreviewVal}>{payment.expiry || "MM/YY"}</div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <Field name="cardName"   label="Cardholder Name" placeholder="Jane Smith"       fm="pay"/>
                    </div>
                    <div className={styles.fieldRow}>
                      <Field name="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456" fm="pay"/>
                    </div>
                    <div className={styles.fieldRow}>
                      <Field name="expiry" label="Expiry" placeholder="MM/YY" half fm="pay"/>
                      <div className={`${styles.field} ${styles.fieldHalf}`}>
                        <label className={styles.label}>CVV</label>
                        <div className={styles.cvvWrap}>
                          <input
                            className={`${styles.input} ${errors.cvv ? styles.inputErr : ""}`}
                            type={showCvv ? "text" : "password"}
                            name="cvv" value={payment.cvv}
                            onChange={handlePayment} placeholder="•••"
                            maxLength={4}
                          />
                          <button type="button" className={styles.cvvEye} onClick={() => setShowCvv(s => !s)}>
                            {showCvv
                              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                        {errors.cvv && <span className={styles.fieldErr}>{errors.cvv}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {payment.method !== "card" && (
                  <div className={styles.altPayInfo}>
                    <span className={styles.altPayIcon}>{PAYMENT.find(p=>p.key===payment.method)?.icon}</span>
                    <div>
                      <div className={styles.altPayTitle}>{PAYMENT.find(p=>p.key===payment.method)?.label} selected</div>
                      <div className={styles.altPaySub}>You'll be prompted to confirm payment on the next step.</div>
                    </div>
                  </div>
                )}

                <div className={styles.formNav}>
                  <button className={styles.btnGhost} onClick={back}>← Back</button>
                  <button className={styles.btnRed} onClick={next}>Review Order →</button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <div className={styles.formCard}>
                <div className={styles.cardHead}><div className={styles.eyeBar}/><span>Review Your Order</span></div>

                {/* contact summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHead}>
                    <span>Contact</span>
                    <button className={styles.reviewEdit} onClick={() => setStep(0)}>Edit</button>
                  </div>
                  <div className={styles.reviewGrid}>
                    {[
                      { label:"Name",  value:`${form.firstName} ${form.lastName}` },
                      { label:"Email", value:form.email  },
                      { label:"Phone", value:form.phone  },
                    ].map(({label,value}) => (
                      <div key={label} className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>{label}</span>
                        <span className={styles.reviewItemValue}>{value||"—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* delivery summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHead}>
                    <span>Delivery</span>
                    <button className={styles.reviewEdit} onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className={styles.reviewGrid}>
                    {[
                      { label:"Address",  value:`${form.street}, ${form.city}, ${form.province} ${form.postalCode}` },
                      { label:"Method",   value:DELIVERY[delivery].label },
                      { label:"Estimated",value:DELIVERY[delivery].sub   },
                    ].map(({label,value}) => (
                      <div key={label} className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>{label}</span>
                        <span className={styles.reviewItemValue}>{value||"—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* payment summary */}
                <div className={styles.reviewSection}>
                  <div className={styles.reviewSectionHead}>
                    <span>Payment</span>
                    <button className={styles.reviewEdit} onClick={() => setStep(2)}>Edit</button>
                  </div>
                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Method</span>
                      <span className={styles.reviewItemValue}>{PAYMENT.find(p=>p.key===payment.method)?.label}</span>
                    </div>
                    {payment.method === "card" && (
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewItemLabel}>Card</span>
                        <span className={styles.reviewItemValue}>•••• •••• •••• {payment.cardNumber.slice(-4)||"••••"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formNav}>
                  <button className={styles.btnGhost} onClick={back}>← Back</button>
                  <button className={`${styles.btnRed} ${styles.btnBig}`} onClick={placeOrder} disabled={placing}>
                    {placing
                      ? <><span className={styles.spin}/>Processing…</>
                      : payment.method === "cod" ? "Place Order" : "Confirm & Pay →"
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: order summary ── */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <div className={styles.cardAccent}/>
              <div className={styles.summaryHead}>
                <div className={styles.eyeBar}/>
                <span>Order Summary</span>
              </div>

              {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                  <span>🛒</span>
                  <p>Your cart is empty.</p>
                  <button className={styles.btnRed} onClick={() => navigate("/products")}>Browse The Drop</button>
                </div>
              ) : (
                <>
                  <div className={styles.itemsList}>
                    {cartItems.map(item => (
                      <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemImg}>
                          {item.image ? <img src={item.image} alt={item.name}/> : <span>👟</span>}
                          <span className={styles.itemQtyBadge}>{item.qty}</span>
                        </div>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemUnit}>R{pp(item.price).toFixed(2)} each</span>
                        </div>
                        <span className={styles.itemTotal}>R{(pp(item.price)*item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                      <span>Discount (15%)</span>
                      <span>−R{discount.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Delivery</span>
                      <span>{freeShip && delivery==="standard" ? <span style={{color:"#4ADE80"}}>Free</span> : `R${shipCharge.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className={styles.totalRow}>
                    <div>
                      <div className={styles.totalLabel}>Total</div>
                      <div className={styles.totalSub}>Incl. VAT</div>
                    </div>
                    <div className={styles.totalAmount}>R{total.toFixed(2)}</div>
                  </div>

                  {/* trust badges */}
                  <div className={styles.trustRow}>
                    {[["🔒","Secure payment"],["📦","Tracked delivery"],["↩️","30-day returns"]].map(([icon,lbl]) => (
                      <div key={lbl} className={styles.trustItem}>
                        <span>{icon}</span>
                        <span>{lbl}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}