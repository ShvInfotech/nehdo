import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoArrowForward,
    IoHeartOutline,
    IoHeart,
    IoEyeOutline,
    IoBagAddOutline,
    IoChevronBack,
    IoChevronForward,
    IoStar,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";




const products = [
    { id: 1, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/bkt7vcv1_expires_30_days.png", name: "Yves Saint", brand: "YSL", price: "₹39.99", originalPrice: "₹59.99", reviews: 128, rating: 4.8, isNew: true },
    { id: 2, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/gw9whifd_expires_30_days.png", name: "Gucci Classic", brand: "Gucci", price: "₹45.99", originalPrice: null, reviews: 210, rating: 4.9, isNew: true },
    { id: 3, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/b2qfbw9i_expires_30_days.png", name: "Prada Elite", brand: "Prada", price: "₹59.99", originalPrice: "₹79.99", reviews: 95, rating: 4.7, isNew: false },
    { id: 4, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/64ofuakc_expires_30_days.png", name: "Dior Summer", brand: "Dior", price: "₹49.99", originalPrice: null, reviews: 142, rating: 4.6, isNew: true },
    { id: 5, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/mb4krc3r_expires_30_days.png", name: "Chanel Vibe", brand: "Chanel", price: "₹65.99", originalPrice: "₹89.99", reviews: 312, rating: 5.0, isNew: false },
    { id: 6, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/bkt7vcv1_expires_30_days.png", name: "Armani Suit", brand: "Armani", price: "₹89.99", originalPrice: null, reviews: 88, rating: 4.5, isNew: false },
    { id: 7, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/gw9whifd_expires_30_days.png", name: "Fendi Jacket", brand: "Fendi", price: "₹55.99", originalPrice: "₹75.99", reviews: 176, rating: 4.8, isNew: true },
    { id: 8, image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/b2qfbw9i_expires_30_days.png", name: "Burberry Coat", brand: "Burberry", price: "₹120.00", originalPrice: null, reviews: 34, rating: 4.4, isNew: false },
];

const tabs = ["All", "Men", "Women", "Kids", "Accessories"];

const NewArrivals = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("All");
    const { addItem: addToCart } = useCart();
    const { toggle: toggleWishlist, has: isInWishlist } = useWishlist();
    const [addedToCart, setAddedToCart] = useState<number | null>(null);

    const itemsToShow = typeof window !== "undefined" && window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 5;
    const maxIndex = Math.max(0, products.length - itemsToShow);

    const handlePrev = () => setCurrentIndex((p) => Math.max(0, p - 1));
    const handleNext = () => setCurrentIndex((p) => Math.min(maxIndex, p + 1));

    const handleAddToCart = (product: any) => {
        addToCart({
            productId: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice.replace(/[^0-9.]/g, '')) : null,
            color: 'Default',
            size: 'M'
        });
        setAddedToCart(product.id);
        setTimeout(() => setAddedToCart(null), 1200);
    };

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-10"
            >
                <div>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        New Arrivals
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mt-3" />
                </div>

                <div className="flex items-center gap-6">
                    {/* Filter Tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${activeTab === tab
                                        ? "bg-brand text-white shadow-button"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <Link to="/shop" className="hidden md:flex group items-center gap-2 text-muted hover:text-brand transition-colors text-sm font-medium">
                        View all
                        <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={14} />
                    </Link>
                </div>
            </motion.div>

            {/* Product Carousel */}
            <div className="relative">
                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4 md:gap-6"
                        animate={{ x: `-${currentIndex * (100 / itemsToShow + 1.5)}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="flex-shrink-0 group"
                                style={{ width: `calc(${100 / itemsToShow}% - ${((itemsToShow - 1) * 24) / itemsToShow}px)` }}
                            >
                                {/* Image Container */}
                                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* NEW Badge */}
                                    {product.isNew && (
                                        <div className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            New
                                        </div>
                                    )}

                                    {/* Sale Badge */}
                                    {product.originalPrice && (
                                        <div className="absolute top-3 left-3 mt-7 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Sale
                                        </div>
                                    )}

                                    {/* Wishlist button */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm transition-all hover:scale-110"
                                    >
                                        {isInWishlist(product.id) ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                                                <IoHeart size={18} className="text-red-500" />
                                            </motion.div>
                                        ) : (
                                            <IoHeartOutline size={18} className="text-gray-600" />
                                        )}
                                    </button>

                                    {/* Quick View overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-white"
                                        >
                                            <IoEyeOutline size={16} /> Quick View
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="px-1">
                                    <p className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1">{product.brand}</p>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-heading font-semibold text-sm md:text-base text-gray-900 mb-1.5 group-hover:text-brand transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, s) => (
                                            <IoStar
                                                key={s}
                                                size={12}
                                                className={s < Math.floor(product.rating) ? "text-gold" : "text-gray-200"}
                                            />
                                        ))}
                                        <span className="text-[11px] text-muted ml-1">({product.reviews})</span>
                                    </div>

                                    {/* Price & Add to Cart */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-heading font-bold text-base text-accent">{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-muted line-through">{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                                            className={`p-2 rounded-xl transition-all ${addedToCart === product.id
                                                    ? "bg-green-500 text-white scale-110"
                                                    : "bg-brand/10 text-brand hover:bg-brand hover:text-white"
                                                }`}
                                        >
                                            <IoBagAddOutline size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Navigation Arrows */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute -left-3 md:-left-5 top-[35%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-card-hover flex items-center justify-center hover:bg-brand hover:text-white text-gray-700 transition-all hover:scale-110 z-10"
                    >
                        <IoChevronBack size={18} />
                    </button>
                )}
                {currentIndex < maxIndex && (
                    <button
                        onClick={handleNext}
                        className="absolute -right-3 md:-right-5 top-[35%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-card-hover flex items-center justify-center hover:bg-brand hover:text-white text-gray-700 transition-all hover:scale-110 z-10"
                    >
                        <IoChevronForward size={18} />
                    </button>
                )}
            </div>

            {/* Mobile view-all link */}
            <div className="mt-6 text-center md:hidden">
                <Link to="/shop" className="inline-flex items-center gap-2 text-brand font-semibold text-sm">
                    View all products <IoArrowForward size={14} />
                </Link>
            </div>
        </section>
    );
};

export default NewArrivals;
