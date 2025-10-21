import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";
import { RiEBike2Fill } from "react-icons/ri";
import {
  SiApplepay,
  SiGooglepay,
  SiHuawei,
} from "react-icons/si";
import { MdOutlinePayment, MdShoppingCartCheckout } from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("same-day");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const discount = subtotal * 0.15;

  const deliveryOptions = {
    "same-day": { label: "Same-Day Delivery", cost: 30, eta: "Today" },
    express: { label: "Express Delivery", cost: 15, eta: "1-2 Days" },
    normal: { label: "Standard Delivery", cost: 8, eta: "3-5 Days" },
  };

  const deliveryCost = deliveryOptions[deliveryMethod].cost;
  const total = subtotal - discount + deliveryCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["cardName", "cardNumber", "expiry", "cvv"].includes(name)) {
      setPaymentData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.postalCode,
      paymentMethod,
    ];

    // If paying by card, all card fields must be filled
    if (paymentMethod === "card") {
      requiredFields.push(
        paymentData.cardName,
        paymentData.cardNumber,
        paymentData.expiry,
        paymentData.cvv
      );
    }

    return requiredFields.every((f) => f.trim() !== "");
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!validateForm())
      return alert("Please fill in all required fields before placing your order.");

    const now = new Date();
    const order = {
      ...formData,
      cartItems,
      subtotal,
      discount,
      deliveryCost,
      total,
      deliveryMethod,
      paymentMethod,
      paymentData: paymentMethod === "card" ? paymentData : null,
      date: now.toISOString(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));
    localStorage.removeItem("cart");

    alert("Payment successful! Your order has been placed.");
    navigate("/orders");
  };

  const displayDate = new Date().toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Navbar />

      <div className={styles.checkoutWrapper}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate("/cart")}>
            ← Back to cart
          </button>
          <h1>
            <MdShoppingCartCheckout className={styles.iconHeader} /> Checkout
          </h1>
          <p className={styles.subText}>
            Finalize your delivery and payment details below to complete your purchase.
          </p>
        </div>

        <div className={styles.grid}>
          {/* LEFT SIDE */}
          <div className={styles.left}>
            {/* Contact Info */}
            <div className={styles.section}>
              <h3>
                <FaUser className={styles.iconTitle} /> 1. Contact Information
              </h3>
              <div className={styles.twoCol}>
                <div className={styles.inputGroup}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <FaUser className={styles.inputIcon} />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.inputGroup}>
                  <FaPhone className={styles.inputIcon} />
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <FaEnvelope className={styles.inputIcon} />
                  <input
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className={styles.section}>
              <h3>
                <RiEBike2Fill className={styles.iconTitle} /> 2. Delivery Method
              </h3>
              <div className={styles.deliveryOptions}>
                {Object.entries(deliveryOptions).map(([key, opt]) => (
                  <button
                    key={key}
                    className={`${styles.deliveryBtn} ${
                      deliveryMethod === key ? styles.active : ""
                    }`}
                    onClick={() => setDeliveryMethod(key)}
                  >
                    <strong>{opt.label}</strong>
                    <span className={styles.deliveryMeta}>
                      R{opt.cost} • {opt.eta}
                    </span>
                  </button>
                ))}
              </div>
              <div className={styles.inputGroup}>
                <FaMapMarkerAlt className={styles.inputIcon} />
                <input
                  name="postalCode"
                  placeholder="Postal / Zip Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment */}
            <div className={styles.section}>
              <h3>
                <MdOutlinePayment className={styles.iconTitle} /> 3. Payment Method
              </h3>
              <div className={styles.paymentOptions}>
                <button
                  className={`${styles.payBtn} ${
                    paymentMethod === "card" ? styles.active : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <FaCreditCard /> Card Payment
                </button>
                <button
                  className={`${styles.payBtn} ${
                    paymentMethod === "applepay" ? styles.active : ""
                  }`}
                  onClick={() => setPaymentMethod("applepay")}
                >
                  <SiApplepay /> Apple Pay
                </button>
                <button
                  className={`${styles.payBtn} ${
                    paymentMethod === "gpay" ? styles.active : ""
                  }`}
                  onClick={() => setPaymentMethod("gpay")}
                >
                  <SiGooglepay /> Google Pay
                </button>
                <button
                  className={`${styles.payBtn} ${
                    paymentMethod === "cod" ? styles.active : ""
                  }`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <SiHuawei /> Pay on Delivery
                </button>
              </div>

              {/* Only show card fields if card is selected */}
              {paymentMethod === "card" && (
                <div className={styles.cardDetails}>
                  <div className={styles.inputGroup}>
                    <FaUser className={styles.inputIcon} />
                    <input
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={paymentData.cardName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <FaCreditCard className={styles.inputIcon} />
                    <input
                      name="cardNumber"
                      placeholder="Card Number"
                      maxLength="19"
                      value={paymentData.cardNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.twoCol}>
                    <div className={styles.inputGroup}>
                      <FaCalendarAlt className={styles.inputIcon} />
                      <input
                        name="expiry"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentData.expiry}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <FaLock className={styles.inputIcon} />
                      <input
                        name="cvv"
                        placeholder="CVV"
                        maxLength="4"
                        value={paymentData.cvv}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.right}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>

              {cartItems.length > 0 && (
                <p className={styles.orderDate}>Order time: {displayDate}</p>
              )}

              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className={styles.itemsList}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <img src={item.image} alt={item.name} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemQty}>
                          Qty: {item.qty} × R{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className={styles.itemTotal}>
                        R{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount (15%)</span>
                <span>-R{discount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery ({deliveryOptions[deliveryMethod].label})</span>
                <span>R{deliveryCost.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>

              <button className={styles.payNowBtn} onClick={handlePlaceOrder}>
                {paymentMethod === "cod" ? "Place Order" : "Pay Now →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
