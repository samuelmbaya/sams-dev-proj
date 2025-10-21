import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Products.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // ✅ Alert state

  // ----------------------------
  // FETCH PRODUCTS (with localStorage caching)
  // ----------------------------
  const fetchProducts = async (category = "all") => {
    try {
      const cacheKey = `products_${category}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        setProducts(parsed);
        setDisplayedProducts(parsed.slice(0, 8));
      }

      const url =
        category === "all"
          ? "http://localhost:5000/products"
          : `http://localhost:5000/products?category=${category}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      const productArray = Array.isArray(result) ? result : result.data || [];

      setProducts(productArray);
      setDisplayedProducts(productArray.slice(0, 8));
      setShowAll(false);
      localStorage.setItem(cacheKey, JSON.stringify(productArray));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const handleSeeMore = () => {
    setShowAll(true);
    setDisplayedProducts(products);
  };

  // ----------------------------
  // CART PERSISTENCE
  // ----------------------------
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse cart from localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart]);

  const getId = (product) => product._id || product.id;

  // ✅ Show temporary alert
  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2500);
  };

  const addToCart = (product, opts = { navigateToCart: false }) => {
    const id = getId(product);
    const existing = cart.find((it) => it.id === id);

    let newCart;
    if (existing) {
      newCart = cart.map((it) =>
        it.id === id ? { ...it, qty: it.qty + 1 } : it
      );
    } else {
      const price =
        typeof product.price === "number"
          ? product.price
          : parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;

      newCart = [
        ...cart,
        {
          id,
          name: product.name,
          price,
          image: product.image,
          qty: 1,
        },
      ];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    showAlert("✅ Successfully added to cart");

    if (opts.navigateToCart) navigate("/cart");
  };

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  return (
    <>
      <div className={styles.navbarFixed}>
        <Navbar />
      </div>

      {/* Floating Cart Icon */}
      <div className={styles.cartWidget}>
        <button
          className={styles.cartButton}
          onClick={() => navigate("/cart")}
          aria-label="Go to cart page"
        >
          🛒
          <span className={styles.cartBadge}>{cartCount}</span>
        </button>
      </div>

      <section className={styles.productSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Products</h2>
          <div className={styles.categoryButtons}>
            {["all", "mens", "women", "kids"].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category ? styles.active : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className={styles.productGrid}>
          {displayedProducts.map((product) => (
            <div
              key={product._id || product.id}
              className={styles.productCard}
            >
              <div className={styles.imageContainer}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{product.price}</p>
                <button
                  className={styles.buybutton}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAll && displayedProducts.length >= 8 && (
          <div className={styles.seeMoreContainer}>
            <button onClick={handleSeeMore} className={styles.seeMoreBtn}>
              See More
            </button>
          </div>
        )}
      </section>

      {/* ✅ Alert message */}
      {alertMessage && <div className={styles.alertBox}>{alertMessage}</div>}

      <Footer />
    </>
  );
};

export default Products;
