import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Orders.module.css";

export default function Orders() {
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState(null);
  const pageSize = 5;

  const userEmail = localStorage.getItem("userEmail");

  const loadOrders = () => {
    setLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem("orders") || "[]");
      const mine  = Array.isArray(saved) ? saved.filter(o => o.email === userEmail) : [];
      setOrders(mine);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [userEmail]);

  const statuses = useMemo(() => {
    const set = new Set(orders.map(o => o.status || "Pending"));
    return ["All", ...Array.from(set)];
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders;
    if (statusFilter !== "All") list = list.filter(o => o.status === statusFilter);
    if (q) list = list.filter(o =>
      (o.id       && o.id.toLowerCase().includes(q)) ||
      (o.customer && o.customer.toLowerCase().includes(q)) ||
      (o.firstName && o.firstName.toLowerCase().includes(q)) ||
      (o.lastName  && o.lastName.toLowerCase().includes(q)) ||
      String(o.total).includes(q)
    );
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const STATUS_META = {
    delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,.1)"   },
    shipped:    { label: "Shipped",    color: "#38bdf8", bg: "rgba(56,189,248,.1)"  },
    processing: { label: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,.1)"  },
    pending:    { label: "Pending",    color: "#777",    bg: "rgba(120,120,120,.1)" },
    cancelled:  { label: "Cancelled",  color: "#E8192C", bg: "rgba(232,25,44,.1)"   },
  };

  const getStatus = (raw) => {
    const key = (raw || "pending").toLowerCase().replace(/\s+/g, "-");
    return STATUS_META[key] || { label: raw || "Pending", color: "#777", bg: "rgba(120,120,120,.1)" };
  };

  // close modal on Escape
  useEffect(() => {
    const h = e => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.navWrap}><Navbar /></div>

      <main className={styles.main}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <div className={styles.redBar} />
            <span>ShoeNation RSA · Account</span>
          </div>
          <h1 className={styles.heading}>
            Your<br />
            <span className={styles.headingOutline}>Orders.</span>
          </h1>
          {!loading && (
            <p className={styles.headingSub}>
              {orders.length === 0
                ? "No orders yet — the drop is waiting."
                : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
            </p>
          )}
        </div>

        {loading ? (
          /* ── SKELETON ── */
          <div className={styles.skeletonWrap}>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className={styles.skeletonRow} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.skelCell} style={{ width: "18%" }} />
                <div className={styles.skelCell} style={{ width: "22%" }} />
                <div className={styles.skelCell} style={{ width: "12%" }} />
                <div className={styles.skelCell} style={{ width: "14%" }} />
                <div className={styles.skelCell} style={{ width: "8%" }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ── FILTER ROW ── */}
            <div className={styles.filterRow}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>⌕</span>
                <input
                  className={styles.searchInput}
                  placeholder="Search by ID, name or total…"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setPage(1); }}
                />
              </div>

              <select
                className={styles.select}
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button className={styles.refreshBtn} onClick={loadOrders}>
                ↻ Refresh
              </button>
            </div>

            {/* ── TABLE ── */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {["Order ID", "Customer", "Total", "Status", ""].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.empty}>
                        <div className={styles.emptyIcon}>📦</div>
                        <div className={styles.emptyTitle}>No orders found</div>
                        <div className={styles.emptyDesc}>Try adjusting your search or filter.</div>
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((o, i) => {
                      const st = getStatus(o.status);
                      const customer = o.customer || `${o.firstName || ""} ${o.lastName || ""}`.trim() || "—";
                      return (
                        <tr key={o.id || i} className={styles.tableRow}>
                          <td>
                            <span className={styles.orderId}>{o.id || `ORD-${String(i + 1).padStart(4,"0")}`}</span>
                          </td>
                          <td className={styles.customerCell}>{customer}</td>
                          <td>
                            <span className={styles.totalCell}>R{Number(o.total || 0).toFixed(2)}</span>
                          </td>
                          <td>
                            <span className={styles.statusBadge} style={{ color: st.color, background: st.bg, border: `1px solid ${st.color}30` }}>
                              <span className={styles.statusDot} style={{ background: st.color }} />
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <button className={styles.viewBtn} onClick={() => setSelected(o)}>
                              View →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── PAGINATION ── */}
            {filtered.length > pageSize && (
              <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                <div className={styles.pageDots}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={`${styles.pageDot} ${n === page ? styles.pageDotActive : ""}`} onClick={() => setPage(n)}>{n}</button>
                  ))}
                </div>
                <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── ORDER DETAIL MODAL ── */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalAccent} />

            {/* header */}
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalEyebrow}>
                  <div className={styles.redBar} />
                  <span>Order Details</span>
                </div>
                <h3 className={styles.modalTitle}>{selected.id || "Order"}</h3>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* meta grid */}
            <div className={styles.metaGrid}>
              {[
                ["Customer", selected.customer || `${selected.firstName || ""} ${selected.lastName || ""}`.trim() || "—"],
                ["Status",   selected.status || "Pending"],
                ["Total",    `R${Number(selected.total || 0).toFixed(2)}`],
                ["Date",     selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-ZA", { year:"numeric", month:"short", day:"numeric" }) : "—"],
              ].map(([k, v]) => (
                <div key={k} className={styles.metaItem}>
                  <span className={styles.metaKey}>{k}</span>
                  <span className={styles.metaVal}>{v}</span>
                </div>
              ))}
            </div>

            {/* items */}
            <div className={styles.itemsHeading}>
              <div className={styles.redBar} />
              <span>Items Ordered</span>
            </div>

            <div className={styles.itemsList}>
              {(selected.items || selected.cartItems || []).map((it, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <div className={styles.itemImgWrap}>
                    {it.image
                      ? <img src={it.image} alt={it.name} className={styles.itemImg} />
                      : <div className={styles.itemImgPlaceholder}>👟</div>
                    }
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{it.name}</div>
                    <div className={styles.itemMeta}>Qty: {it.qty}</div>
                  </div>
                  <div className={styles.itemPrice}>R{Number(it.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* total footer */}
            <div className={styles.modalFooter}>
              <span className={styles.modalFooterLabel}>Order Total</span>
              <span className={styles.modalFooterTotal}>R{Number(selected.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}