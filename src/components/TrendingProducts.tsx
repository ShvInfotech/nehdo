import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import ProductCard from "./ProductCard";
import { products } from "../data/products";

const TrendingProducts = () => {
    // Get 10 products for the 2-line grid (5 products per line)
    // First try to get trending ones, then pad with others if needed
    const trending = products.filter(p => p.isTrending);
    const others = products.filter(p => !p.isTrending);
    const displayProducts = [...trending].slice(0, 10);

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
                        Trending Products
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mt-3" />
                </div>

                <Link to="/shop" className="group flex items-center gap-2 text-muted hover:text-brand transition-colors text-sm font-medium">
                    View all
                    <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
            </motion.div>

            {/* 10 Products Grid: 2 rows of 5 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {displayProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>
            
            {/* Mobile view-all link */}
            <div className="mt-8 text-center md:hidden">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-xl text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors">
                    View all products <IoArrowForward size={14} />
                </Link>
            </div>
        </section>
    );
};

export default TrendingProducts;
