import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Profile.module.css";

/* ── helpers ── */
const TABS = [
  { key: "profile",   label: "Profile"    },
  { key: "orders",    label: "Orders"     },
  { key: "wishlist",  label: "Wishlist"   },
  { key: "addresses", label: "Addresses"  },
  { key: "security",  label: "Security"   },
];

const STATUS_META = {
  delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,.1)"   },
  shipped:    { label: "Shipped",    color: "#38bdf8", bg: "rgba(56,189,248,.1)"  },
  processing: { label: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,.1)"  },
  pending:    { label: "Pending",    color: "#777",    bg: "rgba(120,120,120,.1)" },
  cancelled:  { label: "Cancelled",  color: "#E8192C", bg: "rgba(232,25,44,.1)"   },
};

const getStatus = (raw = "pending") => {
  const key = raw.toLowerCase().replace(/\s+/g, "-");
  return STATUS_META[key] || { label: raw, color: "#777", bg: "rgba(120,120,120,.1)" };
};

export default function Profile() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [user,      setUser]      = useState(null);
  const [editMode,  setEditMode]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"", bio:"", profilePic:"" });

  const [orders,   setOrders]   = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [addresses,   setAddresses]   = useState([]);
  const [addrEdit,    setAddrEdit]    = useState(null);
  const [addrForm,    setAddrForm]    = useState({ label:"Home", street:"", city:"", province:"", code:"", isDefault:false });

  const [pwForm,     setPwForm]     = useState({ current:"", next:"", confirm:"" });
  const [pwError,    setPwError]    = useState("");
  const [pwSuccess,  setPwSuccess]  = useState(false);
  const [showPw,     setShowPw]     = useState({ c:false, n:false, cf:false });

  /* focused field tracking for accent animations */
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const stored  = JSON.parse(localStorage.getItem("user"));
    const loggedIn = localStorage.getItem("loggedIn");
    if (!stored || loggedIn === "false") { navigate("/login"); return; }
    setUser(stored);
    setForm(stored);

    const raw = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(raw.filter(o => o.email === stored.email).slice(0, 5));

    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(wl);

    const addr = JSON.parse(localStorage.getItem("addresses") || "[]");
    setAddresses(addr);
  }, [navigate]);

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, profilePic: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeWishlist = id => {
    const next = wishlist.filter(i => i.id !== id);
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
  };

  const addWishlistToCart = item => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ex = cart.find(c => c.id === item.id);
    const next = ex
      ? cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      : [...cart, { ...item, qty: 1 }];
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const saveAddress = () => {
    let next;
    if (addrEdit === "new") {
      next = addrForm.isDefault
        ? [...addresses.map(a => ({...a, isDefault:false})), addrForm]
        : [...addresses, addrForm];
    } else {
      next = addresses.map((a, i) => {
        if (i === addrEdit) return addrForm;
        return addrForm.isDefault ? { ...a, isDefault: false } : a;
      });
    }
    setAddresses(next);
    localStorage.setItem("addresses", JSON.stringify(next));
    setAddrEdit(null);
    setAddrForm({ label:"Home", street:"", city:"", province:"", code:"", isDefault:false });
  };

  const deleteAddress = i => {
    const next = addresses.filter((_, idx) => idx !== i);
    setAddresses(next);
    localStorage.setItem("addresses", JSON.stringify(next));
  };

  const setDefaultAddress = i => {
    const next = addresses.map((a, idx) => ({ ...a, isDefault: idx === i }));
    setAddresses(next);
    localStorage.setItem("addresses", JSON.stringify(next));
  };

  const openAddrEdit = (i) => {
    setAddrEdit(i);
    setAddrForm(addresses[i]);
  };

  const handlePwChange = e => {
    e.preventDefault();
    setPwError(""); setPwSuccess(false);
    if (!pwForm.current) return setPwError("Enter your current password.");
    if (pwForm.next.length < 8) return setPwError("New password must be at least 8 characters.");
    if (pwForm.next !== pwForm.confirm) return setPwError("Passwords do not match.");
    setPwSuccess(true);
    setPwForm({ current:"", next:"", confirm:"" });
    setTimeout(() => setPwSuccess(false), 4000);
  };

  const handleLogout = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (!user) return null;

  const avatar   = editMode ? form.profilePic : user.profilePic;
  const initials = (user.name || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <div className={styles.page}>
      <div className={styles.fixedNav}><Navbar /></div>
      <div className={styles.grain} />

      <main className={styles.main}>

        {/* ══════════════════════════
            PAGE HEADER
        ══════════════════════════ */}
        <div className={styles.pageHeader}>
          {/* bg watermark */}
          <span className={styles.headerBg} aria-hidden="true">ACCT</span>

          <div className={styles.eyebrow}>
            <span className={styles.eyeDot} />
            <span>ShoeNation RSA · Account</span>
          </div>

          <div className={styles.headerRow}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleLine}>MY</span>
              <span className={styles.titleLine}>
                <em className={styles.titleStroke}>ACCOUNT.</em>
              </span>
            </h1>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className={styles.logoutBtnBg} />
              <span className={styles.logoutBtnLabel}>Log Out</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════
            IDENTITY BAR
        ══════════════════════════ */}
        <div className={styles.identityBar}>
          <div className={styles.identityAccent} />
          <div className={styles.identityGrain} />
          <span className={styles.identityBg} aria-hidden="true">ID</span>

          <div className={styles.identityLeft}>
            {/* avatar */}
            <div
              className={styles.avatarWrap}
              onClick={() => editMode && fileRef.current?.click()}
            >
              {avatar
                ? <img src={avatar} alt="Profile" className={styles.avatarImg} />
                : <div className={styles.avatarInitials}>{initials}</div>
              }
              <div className={styles.avatarRing} />
              {editMode && (
                <div className={styles.avatarOverlay}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Change</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
            </div>

            <div className={styles.identityInfo}>
              <h2 className={styles.identityName}>{user.name || "Unnamed User"}</h2>
              <p className={styles.identityEmail}>{user.email}</p>
              <div className={styles.memberBadge}>
                <span className={styles.memberDot} />
                ShoeNation Member
              </div>
            </div>
          </div>

          <div className={styles.identityStats}>
            {[
              { n: orders.length,    l: "Orders",    idx: "01" },
              { n: wishlist.length,  l: "Saved",     idx: "02" },
              { n: addresses.length, l: "Addresses", idx: "03" },
            ].map(({ n, l, idx }) => (
              <div key={l} className={styles.iStat}>
                <span className={styles.iStatIdx}>{idx}</span>
                <span className={styles.iStatN}>{n}</span>
                <span className={styles.iStatL}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════
            TAB BAR
        ══════════════════════════ */}
        <div className={styles.tabBar}>
          {TABS.map((t, i) => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabBtnOn : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              <span className={styles.tabIdx}>0{i+1}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            TAB: PROFILE
        ══════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className={styles.tabPanel}>
            <div className={styles.sectionBg} aria-hidden="true">01</div>

            <div className={styles.panelHead}>
              <div>
                <div className={styles.sectionEye}>
                  <span className={styles.eyeBar} />
                  <span>Personal Info</span>
                </div>
              </div>
              <div className={styles.panelActions}>
                {editMode ? (
                  <>
                    <button className={styles.btnSave} onClick={handleSave}>
                      <span className={styles.btnSaveBg} />
                      <span className={styles.btnSaveLabel}>Save Changes</span>
                    </button>
                    <button className={styles.btnGhost} onClick={() => { setForm(user); setEditMode(false); }}>Cancel</button>
                  </>
                ) : (
                  <button className={styles.btnWhite} onClick={() => setEditMode(true)}>
                    <span className={styles.btnWhiteBg} />
                    <span className={styles.btnWhiteLabel}>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {saved && (
              <div className={styles.successBox}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Profile updated successfully.
              </div>
            )}

            <div className={styles.fieldsGrid}>
              {[
                { key:"name",    label:"Full Name",  type:"text",  placeholder:"Jane Smith"      },
                { key:"email",   label:"Email",      type:"email", placeholder:"you@example.com" },
                { key:"phone",   label:"Phone",      type:"tel",   placeholder:"+27 82 000 0000" },
                { key:"address", label:"Address",    type:"text",  placeholder:"Joburg, Gauteng" },
              ].map(({ key, label, type, placeholder }) => (
                <div
                  key={key}
                  className={styles.field}
                  data-focused={focusedField === key ? "true" : undefined}
                >
                  <span className={styles.fieldAccentBar} />
                  <label className={styles.fieldLabel}>{label}</label>
                  {editMode
                    ? <input
                        className={styles.input}
                        type={type}
                        name={key}
                        value={form[key]||""}
                        onChange={e => setForm(f=>({...f,[e.target.name]:e.target.value}))}
                        placeholder={placeholder}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField(null)}
                      />
                    : <span className={styles.fieldValue}>{user[key] || <span className={styles.fieldEmpty}>Not set</span>}</span>
                  }
                </div>
              ))}
              <div className={`${styles.field} ${styles.fieldFull}`} data-focused={focusedField === "bio" ? "true" : undefined}>
                <span className={styles.fieldAccentBar} />
                <label className={styles.fieldLabel}>Bio</label>
                {editMode
                  ? <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      name="bio"
                      value={form.bio||""}
                      onChange={e => setForm(f=>({...f,bio:e.target.value}))}
                      placeholder="Tell us about yourself…"
                      onFocus={() => setFocusedField("bio")}
                      onBlur={() => setFocusedField(null)}
                    />
                  : <p className={styles.bioText}>{user.bio || <span className={styles.fieldEmpty}>No bio yet.</span>}</p>
                }
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: ORDERS
        ══════════════════════════════════════════ */}
        {activeTab === "orders" && (
          <div className={styles.tabPanel}>
            <div className={styles.sectionBg} aria-hidden="true">02</div>

            <div className={styles.panelHead}>
              <div className={styles.sectionEye}>
                <span className={styles.eyeBar} />
                <span>Recent Orders</span>
              </div>
              <button className={styles.btnGhost} onClick={() => navigate("/orders")}>View All Orders →</button>
            </div>

            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyBg} aria-hidden="true">0</span>
                <div className={styles.emptyInner}>
                  <div className={styles.emptyEye}><span className={styles.eyeBar}/><span>Orders</span></div>
                  <div className={styles.emptyTitle}>Nothing<br /><em className={styles.emptyStroke}>Yet.</em></div>
                  <p className={styles.emptyDesc}>Your order history will appear here.</p>
                  <button className={styles.btnSave} onClick={() => navigate("/products")}>
                    <span className={styles.btnSaveBg} />
                    <span className={styles.btnSaveLabel}>Browse The Drop →</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orders.map((o, i) => {
                  const st = getStatus(o.status);
                  return (
                    <div key={o.id || i} className={styles.orderRow}>
                      <span className={styles.orderIdx}>{String(i+1).padStart(2,"0")}</span>

                      <div className={styles.orderThumbs}>
                        {(o.items || o.cartItems || []).slice(0,3).map((it, j) => (
                          <div key={j} className={styles.orderThumb}>
                            {it.image ? <img src={it.image} alt={it.name} /> : <span>👟</span>}
                          </div>
                        ))}
                        {((o.items||o.cartItems||[]).length > 3) && (
                          <div className={styles.orderThumbMore}>+{(o.items||o.cartItems||[]).length - 3}</div>
                        )}
                      </div>

                      <div className={styles.orderMeta}>
                        <span className={styles.orderId}>{o.id || `ORD-${String(i+1).padStart(4,"0")}`}</span>
                        <span className={styles.orderDate}>
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                        </span>
                      </div>

                      <span className={styles.orderTotal}>R{Number(o.total||0).toFixed(2)}</span>

                      <span
                        className={styles.statusBadge}
                        style={{ color:st.color, background:st.bg, borderColor:`${st.color}30` }}
                      >
                        <span className={styles.statusDot} style={{ background:st.color }} />
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: WISHLIST
        ══════════════════════════════════════════ */}
        {activeTab === "wishlist" && (
          <div className={styles.tabPanel}>
            <div className={styles.sectionBg} aria-hidden="true">03</div>

            <div className={styles.panelHead}>
              <div className={styles.sectionEye}>
                <span className={styles.eyeBar} />
                <span>Saved Items</span>
              </div>
              {wishlist.length > 0 && (
                <div className={styles.countBadge}>
                  <span className={styles.countN}>{wishlist.length}</span>
                  <span className={styles.countL}>items</span>
                </div>
              )}
            </div>

            {wishlist.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyBg} aria-hidden="true">♡</span>
                <div className={styles.emptyInner}>
                  <div className={styles.emptyEye}><span className={styles.eyeBar}/><span>Wishlist</span></div>
                  <div className={styles.emptyTitle}>Nothing<br /><em className={styles.emptyStroke}>Saved.</em></div>
                  <p className={styles.emptyDesc}>Heart products on the shop to save them here.</p>
                  <button className={styles.btnSave} onClick={() => navigate("/products")}>
                    <span className={styles.btnSaveBg} />
                    <span className={styles.btnSaveLabel}>Browse The Drop →</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.wishGrid}>
                {wishlist.map(item => (
                  <div key={item.id} className={styles.wishCard}>
                    <div className={styles.wishImgWrap}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className={styles.wishImg} />
                        : <div className={styles.wishImgPlaceholder}>👟</div>
                      }
                      <button className={styles.wishRemove} onClick={() => removeWishlist(item.id)} title="Remove">✕</button>
                      <div className={styles.wishOverlay} />
                    </div>
                    <div className={styles.wishInfo}>
                      <span className={styles.wishCat}>{item.category || "Sneakers"}</span>
                      <span className={styles.wishName}>{item.name}</span>
                      <span className={styles.wishPrice}>R{Number(item.price||0).toFixed(2)}</span>
                    </div>
                    <button
                      className={styles.wishAddBtn}
                      onClick={() => { addWishlistToCart(item); navigate("/cart"); }}
                    >
                      <span className={styles.wishAddBtnBg} />
                      <span className={styles.wishAddBtnLabel}>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: ADDRESSES
        ══════════════════════════════════════════ */}
        {activeTab === "addresses" && (
          <div className={styles.tabPanel}>
            <div className={styles.sectionBg} aria-hidden="true">04</div>

            <div className={styles.panelHead}>
              <div className={styles.sectionEye}>
                <span className={styles.eyeBar} />
                <span>Delivery Addresses</span>
              </div>
              {addrEdit === null && (
                <button
                  className={styles.btnSave}
                  onClick={() => { setAddrEdit("new"); setAddrForm({ label:"Home", street:"", city:"", province:"", code:"", isDefault:false }); }}
                >
                  <span className={styles.btnSaveBg} />
                  <span className={styles.btnSaveLabel}>+ Add Address</span>
                </button>
              )}
            </div>

            {/* address form */}
            {addrEdit !== null && (
              <div className={styles.addrForm}>
                <div className={styles.addrFormHead}>
                  <div className={styles.sectionEye}>
                    <span className={styles.eyeBar} />
                    <span>{addrEdit === "new" ? "New Address" : "Edit Address"}</span>
                  </div>
                </div>
                <div className={styles.fieldsGrid}>
                  {[
                    { key:"label",    label:"Label",       type:"text", placeholder:"Home / Work / Other", full:false },
                    { key:"street",   label:"Street",      type:"text", placeholder:"123 Mandela Ave",     full:true  },
                    { key:"city",     label:"City",        type:"text", placeholder:"Johannesburg",        full:false },
                    { key:"province", label:"Province",    type:"text", placeholder:"Gauteng",             full:false },
                    { key:"code",     label:"Postal Code", type:"text", placeholder:"2000",                full:false },
                  ].map(({ key, label, type, placeholder, full }) => (
                    <div
                      key={key}
                      className={`${styles.field} ${full ? styles.fieldFull : ""}`}
                      data-focused={focusedField === `addr_${key}` ? "true" : undefined}
                    >
                      <span className={styles.fieldAccentBar} />
                      <label className={styles.fieldLabel}>{label}</label>
                      <input
                        className={styles.input}
                        type={type}
                        value={addrForm[key]||""}
                        onChange={e => setAddrForm(f=>({...f,[key]:e.target.value}))}
                        placeholder={placeholder}
                        onFocus={() => setFocusedField(`addr_${key}`)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  ))}
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.checkRow}>
                      <input
                        type="checkbox"
                        checked={addrForm.isDefault}
                        onChange={e => setAddrForm(f=>({...f,isDefault:e.target.checked}))}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkLabel}>Set as default delivery address</span>
                    </label>
                  </div>
                </div>
                <div className={styles.addrFormBtns}>
                  <button className={styles.btnSave} onClick={saveAddress}>
                    <span className={styles.btnSaveBg} />
                    <span className={styles.btnSaveLabel}>Save Address</span>
                  </button>
                  <button className={styles.btnGhost} onClick={() => setAddrEdit(null)}>Cancel</button>
                </div>
              </div>
            )}

            {addresses.length === 0 && addrEdit === null ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyBg} aria-hidden="true">📍</span>
                <div className={styles.emptyInner}>
                  <div className={styles.emptyEye}><span className={styles.eyeBar}/><span>Addresses</span></div>
                  <div className={styles.emptyTitle}>None<br /><em className={styles.emptyStroke}>Saved.</em></div>
                  <p className={styles.emptyDesc}>Add a delivery address to speed up checkout.</p>
                </div>
              </div>
            ) : (
              <div className={styles.addrList}>
                {addresses.map((a, i) => (
                  <div key={i} className={`${styles.addrCard} ${a.isDefault ? styles.addrCardDefault : ""}`}>
                    {a.isDefault && <div className={styles.defaultBadge}>Default</div>}
                    <span className={styles.addrIdx}>{String(i+1).padStart(2,"0")}</span>
                    <div className={styles.addrLabel}>{a.label || "Address"}</div>
                    <div className={styles.addrLines}>
                      <span>{a.street}</span>
                      <span>{a.city}{a.province ? `, ${a.province}` : ""}{a.code ? ` ${a.code}` : ""}</span>
                    </div>
                    <div className={styles.addrActions}>
                      {!a.isDefault && (
                        <button className={styles.addrBtn} onClick={() => setDefaultAddress(i)}>Set Default</button>
                      )}
                      <button className={styles.addrBtn} onClick={() => openAddrEdit(i)}>Edit</button>
                      <button className={`${styles.addrBtn} ${styles.addrBtnDel}`} onClick={() => deleteAddress(i)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: SECURITY
        ══════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div className={styles.tabPanel}>
            <div className={styles.sectionBg} aria-hidden="true">05</div>

            <div className={styles.panelHead}>
              <div className={styles.sectionEye}>
                <span className={styles.eyeBar} />
                <span>Security</span>
              </div>
            </div>

            <div className={styles.securityGrid}>

              {/* change password */}
              <div className={styles.secCard}>
                <div className={styles.secAccent} />
                <div className={styles.secCardHead}>
                  <span className={styles.secIcon}>🔒</span>
                  <div>
                    <div className={styles.secTitle}>Change Password</div>
                    <div className={styles.secDesc}>Update your account password</div>
                  </div>
                </div>

                <form className={styles.pwForm} onSubmit={handlePwChange} noValidate>
                  {[
                    { key:"current", label:"Current Password", show:"c"  },
                    { key:"next",    label:"New Password",      show:"n"  },
                    { key:"confirm", label:"Confirm Password",  show:"cf" },
                  ].map(({ key, label, show }) => (
                    <div
                      key={key}
                      className={styles.field}
                      data-focused={focusedField === `pw_${key}` ? "true" : undefined}
                    >
                      <span className={styles.fieldAccentBar} />
                      <label className={styles.fieldLabel}>{label}</label>
                      <div className={styles.pwWrap}>
                        <input
                          className={styles.input}
                          type={showPw[show] ? "text" : "password"}
                          value={pwForm[key]}
                          onChange={e => setPwForm(f=>({...f,[key]:e.target.value}))}
                          placeholder="••••••••"
                          autoComplete="off"
                          onFocus={() => setFocusedField(`pw_${key}`)}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(s=>({...s,[show]:!s[show]}))}>
                          {showPw[show]
                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  ))}

                  {pwError && (
                    <div className={styles.errBox}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {pwError}
                    </div>
                  )}
                  {pwSuccess && (
                    <div className={styles.successBox}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Password updated successfully.
                    </div>
                  )}

                  <button type="submit" className={styles.btnSave} style={{ marginTop: 6 }}>
                    <span className={styles.btnSaveBg} />
                    <span className={styles.btnSaveLabel}>Update Password</span>
                  </button>
                </form>
              </div>

              {/* account info */}
              <div className={styles.secCard}>
                <div className={styles.secAccent} />
                <div className={styles.secCardHead}>
                  <span className={styles.secIcon}>👤</span>
                  <div>
                    <div className={styles.secTitle}>Account Info</div>
                    <div className={styles.secDesc}>Your account details</div>
                  </div>
                </div>
                <div className={styles.secInfoRows}>
                  {[
                    { label: "Member since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-ZA",{year:"numeric",month:"long"}) : "2024" },
                    { label: "Account email", value: user.email },
                    { label: "Account status", value: "Active" },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.secInfoRow}>
                      <span className={styles.secInfoLabel}>{label}</span>
                      <span className={styles.secInfoValue}>{value}</span>
                    </div>
                  ))}
                </div>

                <button className={styles.logoutCardBtn} onClick={handleLogout}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Log Out of Account
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}