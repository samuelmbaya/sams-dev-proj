import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Products.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const backendurl = import.meta.env.VITE_BACKENDURL;

// ── helpers ──────────────────────────────────────────────────────────────────

const renderStars = (rating = 4.8, size = "star") => {
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className={styles.stars}>
      {Array(full).fill(0).map((_, i) => <span key={`f${i}`} className={styles[size]}>★</span>)}
      {half && <span className={styles[size]}>½</span>}
      {Array(empty).fill(0).map((_, i) => <span key={`e${i}`} className={styles.starEmpty}>★</span>)}
    </div>
  );
};

const parsePrice = (price) =>
  typeof price === "number"
    ? price
    : parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;

// ── mock data for the detail view ─────────────────────────────────────────────
// These enrich the product with extra info that likely isn't in the DB.
// Swap these for real API fields if/when they exist.

const MOCK_SIZES   = ["S", "M", "L", "XL", "XXL"];
const MOCK_ATTRS   = [
  { attr: "Material",      value: "Premium Canvas / Leather" },
  { attr: "Sole",          value: "Rubber, Cushioned Insole" },
  { attr: "Fit",           value: "True to size" },
  { attr: "Care",          value: "Wipe clean with damp cloth" },
  { attr: "Origin",        value: "Vietnam" },
];
const MOCK_REVIEWS = [
  { name: "Jordan K.",   date: "Feb 2025", rating: 5, text: "Incredible quality and comfort. Wore these all day at the mall with zero blisters." },
  { name: "Sam T.",      date: "Jan 2025", rating: 4, text: "Great fit, runs slightly large. Sizing down half a size worked perfectly for me." },
  { name: "Alex M.",     date: "Dec 2024", rating: 5, text: "Clean design, premium feel. Already got three compliments on the first day." },
];

// ── ProductDetailModal ────────────────────────────────────────────────────────

const ProductDetailModal = ({ product, relatedProducts, onClose, onAddToCart, onBuyNow }) => {
  const [activeImg, setActiveImg]   = useState(0);
  const [activeSize, setActiveSize] = useState(MOCK_SIZES[1]);
  const [qty, setQty]               = useState(1);
  const [activeTab, setActiveTab]   = useState("info");

  // Build image array — use the same image repeated as placeholders for the
  // thumbnail row until real multi-image support is added.
  const images = [product.image, product.image, product.image, product.image];

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const price      = parsePrice(product.price);
  const origPrice  = (price * 1.3).toFixed(2);
  const discountPct = Math.round((1 - price / origPrice) * 100);

  return (
    <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalInner}>

        {/* Close */}
        <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>

        {/* ── TOP: gallery + details ── */}
        <div className={styles.modalTopSection}>

          {/* Gallery */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <img src={images[activeImg]} alt={product.name} className={styles.mainImage} />
              <button className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}  onClick={prevImg}>‹</button>
              <button className={`${styles.galleryArrow} ${styles.galleryArrowRight}`} onClick={nextImg}>›</button>
            </div>
            <div className={styles.thumbnailRow}>
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`${styles.thumbnail} ${i === activeImg ? styles.activeThumbnail : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className={styles.detailsSection}>
            <span className={styles.detailCategory}>{product.category || "Sneakers"}</span>

            <div className={styles.detailTitleRow}>
              <h2 className={styles.detailTitle}>{product.name}</h2>
              <span className={styles.stockBadge}>In Stock</span>
            </div>

            <div className={styles.ratingRow}>
              {renderStars(4.8)}
              <span className={styles.ratingText}>4.8 (124 Reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.priceSale}>R{price.toFixed(2)}</span>
              <span className={styles.priceOriginal}>R{origPrice}</span>
              <span className={styles.stockBadge}>{discountPct}% OFF</span>
            </div>

            <p className={styles.detailDescription}>
              {product.description ||
                "Premium construction meets everyday comfort. Designed for those who move fast and look effortless doing it."}
            </p>

            <hr className={styles.divider} />

            {/* Size */}
            <div>
              <div className={styles.sizeLabel}>Size: <strong style={{ color: "#fff" }}>{activeSize}</strong></div>
              <div className={styles.sizeOptions}>
                {MOCK_SIZES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${s === activeSize ? styles.activeSizeBtn : ""}`}
                    onClick={() => setActiveSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Qty + CTA */}
            <div className={styles.actionRow}>
              <div className={styles.qtyControl}>
                <button className={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyValue}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button
                className={styles.addToCartModalBtn}
                onClick={() => { onAddToCart(product, qty); }}
              >
                Add To Cart
              </button>
              <button
                className={styles.buyNowModalBtn}
                onClick={() => { onBuyNow(product, qty); }}
              >
                Buy Now
              </button>
              <button className={styles.wishlistBtn} title="Wishlist">♡</button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.metaInfo}>
              <div><strong>SKU:</strong> {product._id?.slice(-8)?.toUpperCase() || "N/A"}</div>
              <div><strong>Category:</strong> {product.category || "Sneakers"}</div>
              <div><strong>Tags:</strong> Sneakers, {product.category}, Footwear</div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className={styles.tabsSection}>
          <div className={styles.tabBar}>
            {[["desc", "Description"], ["info", "Additional Information"], ["reviews", "Reviews (124)"]].map(([key, label]) => (
              <button
                key={key}
                className={`${styles.tabBtn} ${activeTab === key ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "desc" && (
              <p className={styles.descriptionText}>
                {product.description ||
                  "Crafted with premium materials and engineered for all-day wear, this sneaker blends iconic silhouette design with modern comfort technology. The reinforced toe box and cushioned midsole provide superior support, while the breathable upper keeps your feet fresh from morning to night. A versatile staple that transitions seamlessly from streetwear to smart casual."}
              </p>
            )}

            {activeTab === "info" && (
              <table className={styles.attrTable}>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ATTRS.map(({ attr, value }) => (
                    <tr key={attr}>
                      <td>{attr}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "reviews" && (
              <div className={styles.reviewList}>
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewerName}>{r.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {renderStars(r.rating, "relatedStar")}
                        <span className={styles.reviewDate}>{r.date}</span>
                      </div>
                    </div>
                    <p className={styles.reviewText}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <p className={styles.relatedTitle}>Related Products</p>
            <h3 className={styles.relatedHeading}>
              Explore <span>Related Products</span>
            </h3>
            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((rp) => {
                const rPrice = parsePrice(rp.price);
                const rOrig  = (rPrice * 1.4).toFixed(2);
                return (
                  <div
                    key={rp._id || rp.id}
                    className={styles.relatedCard}
                    onClick={() => { /* parent will handle swapping product */ }}
                  >
                    <span className={styles.relatedBadge}>50% off</span>
                    <div className={styles.relatedImgWrap}>
                      <img src={rp.image} alt={rp.name} className={styles.relatedImg} />
                    </div>
                    <div className={styles.relatedInfo}>
                      <div className={styles.relatedCat}>{rp.category || "Sneakers"}</div>
                      <div className={styles.relatedName}>{rp.name}</div>
                      <div className={styles.relatedRatingRow}>
                        <span className={styles.relatedStar}>★</span>
                        <span className={styles.relatedRatingNum}>4.9</span>
                      </div>
                      <div className={styles.relatedPriceRow}>
                        <span className={styles.relatedSalePrice}>R{rPrice.toFixed(2)}</span>
                        <span className={styles.relatedOrigPrice}>R{rOrig}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer strip ── */}
        <div className={styles.modalFooterStrip}>
          {[
            { icon: "📦", title: "Free Shipping",     desc: "On orders above R500" },
            { icon: "💳", title: "Flexible Payment",  desc: "Multiple secure payment options" },
            { icon: "🎧", title: "24×7 Support",      desc: "We support online all days" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className={styles.footerFeature}>
              <span className={styles.footerIcon}>{icon}</span>
              <div className={styles.footerFeatureText}>
                <span className={styles.footerFeatureTitle}>{title}</span>
                <span className={styles.footerFeatureDesc}>{desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// ── Main Products page ────────────────────────────────────────────────────────

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts]               = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory]   = useState("all");
  const [showAll, setShowAll]                 = useState(false);
  const [alertMessage, setAlertMessage]       = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ----------------------------
  // FETCH PRODUCTS
  // ----------------------------
  const fetchProducts = async (category = "all") => {
    try {
      const cacheKey = `products_${category}`;
      const cached   = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        setProducts(parsed);
        setDisplayedProducts(parsed.slice(0, 8));
      }

      const url =
        category === "all"
          ? `${backendurl}/products`
          : `${backendurl}/products?category=${category}`;

      const res    = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result = await res.json();
      const arr    = Array.isArray(result) ? result : result.data || [];

      setProducts(arr);
      setDisplayedProducts(arr.slice(0, 8));
      setShowAll(false);
      localStorage.setItem(cacheKey, JSON.stringify(arr));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => { fetchProducts(selectedCategory); }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const handleSeeMore = () => {
    setShowAll(true);
    setDisplayedProducts(products);
  };

  // ----------------------------
  // CART
  // ----------------------------
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("cart", JSON.stringify(cart)); }
    catch (err) { console.error(err); }
  }, [cart]);

  const getId = (p) => p._id || p.id;

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2500);
  };

  const addToCart = (product, qty = 1) => {
    const id       = getId(product);
    const existing = cart.find((it) => it.id === id);
    let newCart;

    if (existing) {
      newCart = cart.map((it) =>
        it.id === id ? { ...it, qty: it.qty + qty } : it
      );
    } else {
      newCart = [
        ...cart,
        { id, name: product.name, price: parsePrice(product.price), image: product.image, qty },
      ];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    showAlert("✅ Successfully added to cart");
  };

  const handleBuyNow = (product, qty = 1) => {
    addToCart(product, qty);
    navigate("/cart");
  };

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  // Related = same category, exclude selected
  const relatedProducts = selectedProduct
    ? products
        .filter(
          (p) =>
            (p._id || p.id) !== (selectedProduct._id || selectedProduct.id) &&
            p.category === selectedProduct.category
        )
        .slice(0, 4)
    : [];

  return (
    <>
      <div className={styles.navbarFixed}>
        <Navbar />
      </div>

      {/* Floating Cart */}
      <div className={styles.cartWidget}>
        <button className={styles.cartButton} onClick={() => navigate("/cart")} aria-label="Go to cart">
          🛒
          <span className={styles.cartBadge}>{cartCount}</span>
        </button>
      </div>

      <section className={styles.productSection}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Products</h2>
          <div className={styles.categoryButtons}>
            {["all", "mens", "women", "kids"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className={styles.productGrid}>
          {displayedProducts.map((product) => (
            <div
              key={product._id || product.id}
              className={styles.productCard}
              onClick={() => setSelectedProduct(product)}
            >
              <div className={styles.imageContainer}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>R{parsePrice(product.price).toFixed(2)}</p>
                <button
                  className={styles.buybutton}
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {!showAll && displayedProducts.length >= 8 && (
          <div className={styles.seeMoreContainer}>
            <button onClick={handleSeeMore} className={styles.seeMoreBtn}>See More</button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          relatedProducts={relatedProducts}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {alertMessage && <div className={styles.alertBox}>{alertMessage}</div>}

      <Footer />
    </>
  );
};

export default Products;