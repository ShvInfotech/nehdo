import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoHeartOutline, IoTrashOutline, IoBagAddOutline } from "react-icons/io5";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import Breadcrumb from "../components/Breadcrumb";
import { IoStar } from "react-icons/io5";

const Wishlist = () => {
   const { items, toggle, count } = useWishlist();

const wishlistIds = items.map(item => item.productId);
    const { addItem } = useCart();
    const wishlistProducts = products.filter(p =>
  wishlistIds.includes(String(p.id))
);

 

    const handleMoveToCart = (p: typeof products[0]) => {
        addItem({ productId: p.id, name: p.name, brand: p.brand, image: p.image, price: p.price, originalPrice: p.originalPrice, size: p.sizes[0], color: p.colors[0]?.name || "" });
        toggle(p.id);
    };

    if (wishlistProducts.length === 0) return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-20 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><IoHeartOutline size={40} className="text-red-300" /></div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                <p className="text-muted mb-6">Save items you love for later</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-2xl font-semibold hover:bg-brand-light transition-colors shadow-button">Explore Products</Link>
            </motion.div>
        </div>
    );

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Wishlist" }]} /></div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Wishlist <span className="text-muted text-xl font-normal">({count} items)</span></h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistProducts.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                        <Link to={`/product/${p.id}`}>
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {p.isNew && <span className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">New</span>}
                            </div>
                        </Link>
                        <div className="px-1">
                            <p className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1">{p.brand}</p>
                            <h3 className="font-heading font-semibold text-sm text-gray-900 mb-1 truncate">{p.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, s) => <IoStar key={s} size={11} className={s < Math.floor(p.rating) ? "text-gold" : "text-gray-200"} />)}
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-heading font-bold text-base text-accent">₹{p.price.toFixed(2)}</span>
                                {p.originalPrice && <span className="text-xs text-muted line-through">₹{p.originalPrice.toFixed(2)}</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleMoveToCart(p)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand text-white rounded-xl text-xs font-semibold hover:bg-brand-light transition-colors"><IoBagAddOutline size={14} /> Move to Cart</button>
                                <button onClick={() => toggle(p.id)} className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"><IoTrashOutline size={16} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
