import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoBagHandleOutline, IoArrowForward } from "react-icons/io5";

const OrderConfirmation = () => {
    // Generate a random order number
    const orderNumber = `ORD-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center justify-center text-center">
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8"
            >
                <IoCheckmarkCircle size={48} />
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
                Thank You for Your Order!
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="text-lg text-muted mb-8 max-w-lg"
            >
                Your order <span className="font-bold text-gray-900">#{orderNumber}</span> has been confirmed. We've sent a confirmation email with your order details and tracking information.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
                <Link to="/orders" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-2xl font-bold hover:border-brand hover:text-brand transition-all">
                    <IoBagHandleOutline size={20} /> View Order History
                </Link>
                <Link to="/shop" className="flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-button hover:bg-brand-light transition-all">
                    Continue Shopping <IoArrowForward size={20} />
                </Link>
            </motion.div>
        </div>
    );
};

export default OrderConfirmation;
