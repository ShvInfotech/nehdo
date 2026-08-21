import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    IoArrowForward,
    IoChevronBack,
    IoChevronForward,
} from "react-icons/io5";

import { products } from "../data/products";
import ProductCard from "./ProductCard";

const NewArrivals = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("All");

    // Screen pramane ketla products dekhadvana
    const [itemsToShow, setItemsToShow] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsToShow(2);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(3);
            } else {
                setItemsToShow(5);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Only New Arrival products
    const newProducts = useMemo(() => {
        return products.filter((product) => product.isNew);
    }, []);

    // New Arrival products mathi unique categories
    const tabs = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                newProducts
                    .map((product) => product.category)
                    .filter(Boolean)
            ),
        ];

        return ["All", ...uniqueCategories];
    }, [newProducts]);

    // Active tab pramane products filter
    const filteredProducts = useMemo(() => {
        if (activeTab === "All") {
            return newProducts;
        }

        return newProducts.filter(
            (product) => product.category === activeTab
        );
    }, [activeTab, newProducts]);

    // Filter change thay tyare carousel first position par
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeTab]);

    // IMPORTANT: filtered products ni length use karo
    const maxIndex = Math.max(
        0,
        filteredProducts.length - itemsToShow
    );

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(maxIndex, prev + 1)
        );
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
                    {/* Dynamic Filter Tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                                    activeTab === tab
                                        ? "bg-brand text-white shadow-button"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <Link
                        to="/shop"
                        className="hidden md:flex group items-center gap-2 text-muted hover:text-brand transition-colors text-sm font-medium"
                    >
                        View all

                        <IoArrowForward
                            className="group-hover:translate-x-1 transition-transform"
                            size={14}
                        />
                    </Link>
                </div>
            </motion.div>

            {/* Product Carousel */}
            <div className="relative">
                <div className="overflow-hidden">
                    <motion.div
                        className="flex gap-4 md:gap-6"
                        animate={{
                            x: `-${currentIndex * (100 / itemsToShow + 1.5)}%`,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        {filteredProducts.map((product, index) => (
                            /*
                             * Aa wrapper important che.
                             * Darek ProductCard ne same width malse.
                             */
                            <div
                                key={product.id}
                                className="
                                    shrink-0
                                    w-[calc((100%-16px)/2)]
                                    md:w-[calc((100%-48px)/3)]
                                    lg:w-[calc((100%-96px)/5)]
                                "
                            >
                                <ProductCard
                                    product={product}
                                    index={index}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Previous Arrow */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute -left-3 md:-left-5 top-[35%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-card-hover flex items-center justify-center hover:bg-brand hover:text-white text-gray-700 transition-all hover:scale-110 z-10"
                    >
                        <IoChevronBack size={18} />
                    </button>
                )}

                {/* Next Arrow */}
                {currentIndex < maxIndex && (
                    <button
                        onClick={handleNext}
                        className="absolute -right-3 md:-right-5 top-[35%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-card-hover flex items-center justify-center hover:bg-brand hover:text-white text-gray-700 transition-all hover:scale-110 z-10"
                    >
                        <IoChevronForward size={18} />
                    </button>
                )}
            </div>

            {/* Mobile View All */}
            <div className="mt-6 text-center md:hidden">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-brand font-semibold text-sm"
                >
                    View all products
                    <IoArrowForward size={14} />
                </Link>
            </div>
        </section>
    );
};

export default NewArrivals;