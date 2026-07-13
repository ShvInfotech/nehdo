import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar, IoChevronBack, IoChevronForward } from "react-icons/io5";

const testimonialsData = [
    { id: 1, text: "Amazing quality and fast delivery! StyleHub is my go-to store now. The fabrics feel premium and the fits are always perfect.", name: "Cameron Williamson", role: "Marketing Manager", avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/xnqc4ba1_expires_30_days.png", rating: 5 },
    { id: 2, text: "The best clothing store ever. Everything fits perfectly and the customer service is outstanding. Highly recommend to everyone!", name: "Darrell Steward", role: "UI Designer", avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/2rm1077r_expires_30_days.png", rating: 5 },
    { id: 3, text: "Outstanding customer service and incredible fabric quality. I've been shopping here for months and every order exceeds expectations.", name: "Courtney Henry", role: "Software Developer", avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/2lp2lwtj_expires_30_days.png", rating: 5 },
    { id: 4, text: "I highly recommend this shop to anyone looking for great fashion at reasonable prices. The variety is incredible!", name: "Bessie Cooper", role: "Freelance Writer", avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/xnqc4ba1_expires_30_days.png", rating: 4 },
    { id: 5, text: "My absolute favorite place to shop! Always trendy, affordable, and the packaging is beautiful. Five stars all the way!", name: "Albert Flores", role: "Photographer", avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/2rm1077r_expires_30_days.png", rating: 5 },
];

const Testimonials = () => {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Show 1 on mobile, 3 on desktop
    const itemsPerView = typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;
    const maxIndex = Math.max(0, testimonialsData.length - itemsPerView);

    // Auto-play
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused, maxIndex]);

    const visibleTestimonials = testimonialsData.slice(current, current + itemsPerView);
    // Handle wrap-around
    if (visibleTestimonials.length < itemsPerView) {
        visibleTestimonials.push(...testimonialsData.slice(0, itemsPerView - visibleTestimonials.length));
    }

    return (
        <section
            className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10 md:mb-14"
            >
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    What Our Customers Say
                </h2>
                <p className="text-muted text-base md:text-lg max-w-lg mx-auto">
                    Thousands of happy customers trust us with their everyday style
                </p>
                <div className="w-16 h-1 bg-brand rounded-full mt-5 mx-auto" />
            </motion.div>

            {/* Cards */}
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {visibleTestimonials.map((t, i) => (
                            <motion.div
                                key={`${t.id}-${current}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="relative bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-shadow group"
                            >
                                {/* Quotation mark */}
                                <div className="absolute -top-3 left-6 md:left-8 w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                                    <span className="text-white font-heading text-xl font-bold leading-none">"</span>
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-1 mb-4 mt-3">
                                    {[...Array(5)].map((_, s) => (
                                        <IoStar
                                            key={s}
                                            size={16}
                                            className={s < t.rating ? "text-gold" : "text-gray-200"}
                                        />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
                                    {t.text}
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-brand/10"
                                    />
                                    <div>
                                        <h4 className="font-heading font-semibold text-sm text-gray-900">{t.name}</h4>
                                        <p className="text-xs text-muted">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Nav arrows */}
                <button
                    onClick={() => setCurrent((p) => (p > 0 ? p - 1 : maxIndex))}
                    className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-brand hover:text-white text-gray-600 transition-all z-10"
                >
                    <IoChevronBack size={16} />
                </button>
                <button
                    onClick={() => setCurrent((p) => (p < maxIndex ? p + 1 : 0))}
                    className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-brand hover:text-white text-gray-600 transition-all z-10"
                >
                    <IoChevronForward size={16} />
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`rounded-full transition-all duration-300 ${
                            current === idx
                                ? "w-8 h-2.5 bg-brand"
                                : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
