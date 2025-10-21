import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Orders.module.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const pageSize = 5;

  const userEmail = localStorage.getItem("userEmail"); // 🔑 Get logged-in user email

  // Load orders from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const filteredOrders = Array.isArray(savedOrders)
        ? savedOrders.filter((o) => o.email === userEmail) // ✅ Filter by logged-in user
        : [];
      setOrders(filteredOrders);
    } catch (e) {
      console.error("Error loading orders:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  const statuses = useMemo(() => {
    const set = new Set(orders.map((o) => o.status || "Pending"));
    return ["All", ...Array.from(set)];
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = orders;
    if (statusFilter !== "All") list = list.filter((o) => o.status === statusFilter);
    if (q) {
      list = list.filter(
        (o) =>
          (o.id && o.id.toLowerCase().includes(q)) ||
          (o.customer && o.customer.toLowerCase().includes(q)) ||
          (o.firstName && o.firstName.toLowerCase().includes(q)) ||
          (o.lastName && o.lastName.toLowerCase().includes(q)) ||
          String(o.total).includes(q)
      );
    }
    return list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusClass = (status) =>
    status ? status.toLowerCase().replace(/\s+/g, "-") : "pending";

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.ordersSection}>
        <h2 className={styles.pageTitle}>Orders</h2>

        {loading && <p>Loading orders…</p>}

        {!loading && (
          <>
            <div className={styles.filterRow}>
              <input
                className={styles.searchInput}
                placeholder="Search by ID, name or total"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
              <select
                className={styles.select}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                className={styles.refreshBtn}
                onClick={() => {
                  const saved = JSON.parse(localStorage.getItem("orders") || "[]");
                  const filteredSaved = saved.filter((o) => o.email === userEmail); // ✅ filter again on refresh
                  setOrders(filteredSaved);
                }}
              >
                Refresh
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.noOrders}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((o, i) => (
                    <tr key={o.id || i}>
                      <td>{o.id || `ORD-${i + 1}`}</td>
                      <td>
                        {o.customer ||
                          `${o.firstName || ""} ${o.lastName || ""}`.trim() ||
                          "—"}
                      </td>
                      <td>R{Number(o.total || 0).toFixed(2)}</td>
                      <td>
                        <span className={`${styles.status} ${styles[getStatusClass(o.status)]}`}>
                          {o.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <button className={styles.viewBtn} onClick={() => setSelected(o)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && (
              <div className={styles.pagination}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Prev
                </button>
                <span>
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {selected && (
          <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{selected.id || "Order Details"}</h3>
                <button className={styles.closeBtn} onClick={() => setSelected(null)}>
                  ✕
                </button>
              </div>

              <p>
                <strong>Customer:</strong>{" "}
                {selected.customer ||
                  `${selected.firstName || ""} ${selected.lastName || ""}`.trim() ||
                  "—"}
              </p>
              <p>
                <strong>Status:</strong> {selected.status || "Pending"}
              </p>
              <p>
                <strong>Total:</strong> R{Number(selected.total || 0).toFixed(2)}
              </p>

              <h4 className={styles.itemsTitle}>Items</h4>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || selected.cartItems || []).map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        {it.image ? (
                          <img
                            src={it.image}
                            alt={it.name}
                            className={styles.itemImage}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{it.name}</td>
                      <td>{it.qty}</td>
                      <td>R{Number(it.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
