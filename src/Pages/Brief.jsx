import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './Brief.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiGlobe, FiLock, FiUser, FiCalendar } from "react-icons/fi";

// ✅ Import images
import WomenImg from '../assets/women.png';
import MenImg from '../assets/men.png';
import AdidasLogo from '../assets/adidas.png';
import NikeLogo from '../assets/nike.png';

// ✅ Import limited edition images
import MainShoe from '../assets/limited_main.png';
import BackShoe from '../assets/limited_back.png';
import SideShoe from '../assets/limited_side.png';

const Brief = () => {
    const navigate = useNavigate();

    // Redirect helpers
    const handleShop = (category) => {
        if (category === "all") {
            navigate("/products");
        } else {
            navigate(`/products?category=${category}`);
        }
    };

    return (
        <div className={styles.home}>
            {/* Navbar */}
            <div className={styles.navWrapper}>
                <Navbar />
            </div>

            {/* Hero Banner */}
            <div className={styles.pbanner}>
                <button 
                    className={styles.shopicons} 
                    onClick={() => handleShop("all")}
                >
                    Shop All
                </button>
            </div>

            {/* Products Shop Section */}
            <div className={styles.pshop}>
                {/* Shop Women’s Section */}
                <div className={styles.shopSection}>
                    <div className={styles.infoBox}>
                        <h1 className={styles.title}>Shop Women’s</h1>
                        <p className={styles.desc}>
                            Fresh kicks for every look—classic, sporty, or bold. Shop top styles from Adidas, Nike, Vans & more.
                            Whether you’re hitting the gym, heading out with friends, or keeping it cool on the weekend, our women’s collection has you covered.
                        </p>
                        <button 
                            className={styles.shopBtn} 
                            onClick={() => handleShop("all")}
                        >
                            Shop Now
                        </button>
                    </div>

                    <div className={styles.imageBox}>
                        <img src={WomenImg} alt="Women's Collection" />
                    </div>
                </div>

                {/* Shop Men’s Section */}
                <div className={styles.shopSection}>
                    <div className={styles.imageBox}>
                        <img src={MenImg} alt="Men's Collection" />
                    </div>

                    <div className={styles.infoBox}>
                        <h1 className={styles.title}>Shop Men’s</h1>
                        <p className={styles.desc}>
                            From street classics to modern essentials—step up your style with sneakers from Nike, Adidas, Timberland & more.
                            Discover the perfect pair to match your pace, whether you’re keeping it clean or going bold.
                        </p>
                        <button
                            className={styles.shopBtn}
                            onClick={() => handleShop("all")}
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Rivalry Section */}
            <div className={styles.rivalry}>
                <h1 className={styles.rivalryTitle}>Our Biggest Rivals</h1>
                <div className={styles.rivalCards}>
                    {/* Adidas Card */}
                    <div className={styles.rivalCard}>
                        <div className={styles.rivalImage}>
                            <img src={AdidasLogo} alt="Adidas" />
                        </div>
                        <div className={styles.rivalContent}>
                            <h2>Adidas</h2>
                            <p>
                                Adidas is a leading sportswear brand offering high-quality shoes and apparel.
                                It blends athletic performance with modern fashion, creating products that provide
                                comfort, durability, and style for athletes and lifestyle enthusiasts around the world.
                            </p>
                        </div>
                    </div>

                    {/* Nike Card */}
                    <div className={styles.rivalCard}>
                        <div className={styles.rivalImage}>
                            <img src={NikeLogo} alt="Nike" />
                        </div>
                        <div className={styles.rivalContent}>
                            <h2>Nike</h2>
                            <p>
                                Nike is a global sportswear brand known for innovative athletic footwear and apparel.
                                It combines performance technology with stylish designs to inspire athletes and casual
                                wearers alike, helping them achieve their best in sports and everyday life.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Limited Edition Section */}
            <div className={styles.limitedSection}>
                <h1 className={styles.limitedTitle}>Nike SB x Air Jordan 4 “Navy”</h1>
                <div className={styles.limitedGrid}>
                    <div className={styles.limitedMain}>
                        <img src={MainShoe} alt="Nike SB x Air Jordan 4 Navy" />
                        <div className={styles.limitedMainText}>
                            <h2>Nike SB x Air Jordan 4 “Navy”</h2>
                            <p>
                                The Nike SB x Air Jordan 4 “Navy” is a fusion of basketball heritage and skateboarding functionality.
                            </p>
                            <p className={styles.price}>R4,200</p>
                        </div>
                    </div>
                    <div className={styles.limitedDetails}>
                        <div className={styles.limitedItem}>
                            <img src={BackShoe} alt="Back view" />
                            <p>
                                Upper: White leather with grey suede overlays and navy accents on the eyelets, midsole, and heel tab.
                                Branding: Crimson Jumpman logo on the tongue and embossed Nike SB branding on the heel.
                            </p>
                        </div>
                        <div className={styles.limitedItem}>
                            <img src={SideShoe} alt="Side view" />
                            <p>
                                Sole: Gum rubber outsole with herringbone traction pattern for improved grip.
                                Comfort: Poron foam sockliner for impact cushioning and flexibility.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid Section */}
            <div className={styles.infoGrid}>
                <h1 className={styles.infoHeading}>Personalization</h1>
                <div className={styles.infoItems}>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}><FiGlobe className={styles.icon} /></div>
                        <h3>Access</h3>
                        <p>
                            "Welcome to our global platform. Click the Earth icon to change your language or explore content tailored for your region."
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}><FiLock className={styles.icon} /></div>
                        <h3>Privacy</h3>
                        <p>
                            "Your privacy matters to us. Click the lock icon to review our global privacy policies and learn how we protect your personal information across all regions."
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}><FiUser className={styles.icon} /></div>
                        <h3>Profile</h3>
                        <p>
                            "Manage your global profile settings and preferences. Click the profile icon to update your information and customize your experience worldwide."
                        </p>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.iconWrapper}><FiCalendar className={styles.icon} /></div>
                        <h3>New Arrivals</h3>
                        <p>
                            "Discover the latest arrivals from around the world. Click the calendar icon to explore new products and updates from every corner of the globe."
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Brief;
