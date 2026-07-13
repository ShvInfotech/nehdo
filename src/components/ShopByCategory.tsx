import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";

const categories = [
    {
        name: "Men",
        desc: "Shirts, Pants & More",
        gradient: "from-amber-800/70 to-brand-dark/80",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/3s9gvz4s_expires_30_days.png",
    },
    {
        name: "Women",
        desc: "Dresses, Tops & More",
        gradient: "from-rose-800/70 to-brand/80",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/63iiorfx_expires_30_days.png",
    },
    {
        name: "Kids",
        desc: "Fun & Comfy Styles",
        gradient: "from-sky-700/70 to-indigo-800/80",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/b04fl77e_expires_30_days.png",
    },
    {
        name: "Shoes",
        desc: "Sneakers & Boots",
        gradient: "from-stone-700/70 to-stone-900/80",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/8kkh7d52_expires_30_days.png",
    },
    {
        name: "Bags",
        desc: "Handbags & Backpacks",
        gradient: "from-brand/70 to-brand-dark/80",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/hqmbvsbi_expires_30_days.png",
    },
];

const ShopByCategory = () => {
    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12"
            >
                <div>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Shop By Category
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mt-3" />
                </div>
                <Link to="/shop" className="group flex items-center gap-2 text-muted hover:text-brand transition-colors text-sm md:text-base font-medium">
                    View all categories
                    <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
            </motion.div>

            {/* Category Grid - Bento Box Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px] lg:auto-rows-[300px]">
                {categories.map((cat, i) => {
                    // Determine grid spans for the bento layout
                    let spanClasses = "";
                    if (i === 0) spanClasses = "md:col-span-2 md:row-span-2"; // First item (Men) is large
                    else spanClasses = "col-span-1 row-span-1"; // Others are small blocks

                    return (
                        <Link
                            key={cat.name}
                            to={`/shop?category=${cat.name.toLowerCase()}`}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer block ${spanClasses}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                                className="w-full h-full"
                            >
                                {/* Background Image */}
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />

                                {/* Gradient Overlay - Modified for Bento */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                                
                                {/* Inner Border Effect */}
                                <div className="absolute inset-4 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-500 pointer-events-none" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 flex flex-col justify-end h-full">
                                    <div className="overflow-hidden">
                                        <h3 className={`font-heading font-bold text-white mb-2 transform group-hover:-translate-y-1 transition-transform duration-500 ${i === 0 ? "text-3xl md:text-4xl lg:text-5xl" : "text-xl md:text-2xl"}`}>
                                            {cat.name}
                                        </h3>
                                    </div>
                                    <div className="overflow-hidden h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-white/80 text-sm font-medium mb-3">
                                            {cat.desc}
                                        </p>
                                        <span className="inline-flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider">
                                            Shop Now <IoArrowForward size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default ShopByCategory;
