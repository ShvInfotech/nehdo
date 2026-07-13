import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const promos = [
    "Summer Special ✦ Up to 50% OFF on Selected Items!  Shop Now →",
    "Free Shipping on All Orders Above ₹250 ✦ Limited Time!",
    "New Collection 2026 Just Dropped ✦ Explore Now →",
];

const TopBar = () => {
    const [visible, setVisible] = useState(true);
    const [currentPromo, setCurrentPromo] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    return (
        <div className="relative bg-gradient-to-r from-brand-dark via-brand to-brand-light py-3 px-4 md:px-16 overflow-hidden">
            {/* Decorative shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

            <div className="flex items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={currentPromo}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-white text-xs md:text-sm font-medium tracking-wide text-center"
                    >
                        {promos[currentPromo]}
                    </motion.span>
                </AnimatePresence>

                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-0 text-white/70 hover:text-white transition-colors p-1"
                    aria-label="Dismiss announcement"
                >
                    <IoCloseOutline size={18} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
