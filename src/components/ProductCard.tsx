import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoHeartOutline, IoHeart, IoEyeOutline, IoBagAddOutline, IoStar } from "react-icons/io5";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard: React.FC<{ product: Product; index?: number }> = ({ product, index = 0 }) => {
    const { addItem } = useCart();
    const { toggle, has } = useWishlist();
    const [addedToCart, setAddedToCart] = useState(false);
    const inWishlist = has(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            productId: product.id, name: product.name, brand: product.brand,
            image: product.image, price: product.price, originalPrice: product.originalPrice,
            size: product.sizes[0], color: product.colors[0]?.name || "Default",
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 1200);
    };

   const handleWishlist = async (e: React.MouseEvent) => {
  e.preventDefault();
  await toggle(product.id);
};


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link to={`/product/${product.id}`} className="group block">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.isNew && <div className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">New</div>}
                    {product.originalPrice && <div className={`absolute top-3 left-3 ${product.isNew ? "mt-7" : ""} bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>Sale</div>}

                    <button onClick={handleWishlist} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-sm transition-all hover:scale-110 z-10">
                        {inWishlist ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                                <IoHeart size={18} className="text-red-500" />
                            </motion.div>
                        ) : <IoHeartOutline size={18} className="text-gray-600" />}
                    </button>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
                            <IoEyeOutline size={16} /> Quick View
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="px-1">
                    <p className="text-[11px] text-muted font-medium uppercase tracking-wider mb-1">{product.brand}</p>
                    <h3 className="font-heading font-semibold text-sm md:text-base text-gray-900 mb-1.5 group-hover:text-brand transition-colors truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, s) => <IoStar key={s} size={12} className={s < Math.floor(product.rating) ? "text-gold" : "text-gray-200"} />)}
                        <span className="text-[11px] text-muted ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-base text-accent">₹{product.price.toFixed(2)}</span>
                            {product.originalPrice && <span className="text-xs text-muted line-through">₹{product.originalPrice.toFixed(2)}</span>}
                        </div>
                        <button onClick={handleAddToCart} className={`p-2 rounded-xl transition-all ${addedToCart ? "bg-green-500 text-white scale-110" : "bg-brand/10 text-brand hover:bg-brand hover:text-white"}`}>
                            <IoBagAddOutline size={16} />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
