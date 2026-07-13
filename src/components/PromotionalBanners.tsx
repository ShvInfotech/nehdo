import React from "react";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";

const banners = [
    {
        tag: "Summer Sale",
        headline: "Up to\n50% OFF",
        desc: "Limited time offer!",
        cta: "Shop Sale",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/u62jio7x_expires_30_days.png",
        theme: "dark" as const,
        gradient: "from-black/60 via-black/30 to-transparent",
    },
    {
        tag: "New Arrivals",
        headline: "Just\nDropped!",
        desc: "Check out the latest styles of the week.",
        cta: "Explore Now",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/jqy99s0t_expires_30_days.png",
        theme: "light" as const,
        gradient: "from-white/50 via-white/20 to-transparent",
    },
    {
        tag: "Men's Collection",
        headline: "Stylish &\nComfortable",
        desc: "Made for you.",
        cta: "Shop Now",
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/ksewr6ek_expires_30_days.png",
        theme: "light" as const,
        gradient: "from-white/50 via-white/20 to-transparent",
    },
];

const PromotionalBanners = () => {
    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:auto-rows-[280px]">
                {banners.map((b, i) => {
                    const isDark = b.theme === "dark";
                    // First banner takes full height (2 rows) on desktop
                    const isFeatured = i === 0;

                    return (
                        <motion.div
                            key={b.tag}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                            className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer ${
                                isFeatured ? "lg:row-span-2 min-h-[400px] lg:min-h-full" : "min-h-[280px]"
                            }`}
                        >
                            {/* Background Image */}
                            <img
                                src={b.image}
                                alt={b.tag}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            />
                            
                            {/* Gradient Overlays */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/90 via-black/40" : "from-black/60 via-black/20"} to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
                            
                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 lg:p-10 justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <span className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-md border ${
                                        isDark ? "bg-white/10 text-white border-white/20" : "bg-black/20 text-white border-white/30"
                                    }`}>
                                        {b.tag}
                                    </span>
                                    
                                    <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3 whitespace-pre-line leading-tight text-white">
                                        {b.headline}
                                    </h3>
                                    
                                    <p className="text-sm md:text-base mb-6 text-white/80 max-w-sm">
                                        {b.desc}
                                    </p>

                                    <div className="overflow-hidden">
                                        <div
                                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                                                isDark
                                                    ? "bg-white text-gray-900 hover:bg-gray-100"
                                                    : "bg-brand text-white hover:bg-brand-light"
                                            }`}
                                        >
                                            {b.cta}
                                            <IoArrowForward size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default PromotionalBanners;
