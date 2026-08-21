import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import { userapiRequest } from "../services/apiService";

interface Banner {
    _id: string;
    title: string;
    subtitle: string;
    ctaButtonText: string;
    priority: number;
    desktopImage: string;
    mobileImage: string;
}

const PromotionalBanners = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    /* ─────────────────────────────────────────
       GET PROMOTIONAL BANNERS
    ───────────────────────────────────────── */

    const GetBanners = async () => {
        try {
            setLoading(true);

            const query = new URLSearchParams({
                category: "Promotional Strip",
            });

            const response = await userapiRequest(
                `/user/api/v1/common/banner?${query.toString()}`,
                "GET"
            );

            console.log(
                "GET PROMOTIONAL BANNERS RESPONSE:",
                response
            );

            if (response?.success) {
                setBanners(
                    Array.isArray(response?.banners)
                        ? response.banners
                        : []
                );
            } else {
                setBanners([]);
            }
        } catch (error) {
            console.error(
                "GET PROMOTIONAL BANNERS ERROR:",
                error
            );

            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    /* ─────────────────────────────────────────
       FETCH ON LOAD
    ───────────────────────────────────────── */

    useEffect(() => {
        GetBanners();
    }, []);

    /* ─────────────────────────────────────────
       LOADING
    ───────────────────────────────────────── */

    if (loading) {
        return (
            <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:auto-rows-[280px]">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className={`animate-pulse bg-gray-200 rounded-2xl md:rounded-[2rem] ${
                                item === 0
                                    ? "lg:row-span-2 min-h-[400px] lg:min-h-full"
                                    : "min-h-[280px]"
                            }`}
                        />
                    ))}
                </div>
            </section>
        );
    }

    /* ─────────────────────────────────────────
       NO BANNERS
    ───────────────────────────────────────── */

    if (banners.length === 0) {
        return null;
    }

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:auto-rows-[280px]">

                {banners.map((banner, i) => {
                    // First banner full height on desktop
                    const isFeatured = i === 0;

                    // Existing UI theme logic maintain
                    const isDark = i === 0;

                    return (
                        <motion.div
                            key={banner._id}
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            whileInView={{
                                opacity: 1,
                                scale: 1,
                            }}
                            viewport={{
                                once: true,
                                margin: "-50px",
                            }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.15,
                                ease: "easeOut",
                            }}
                            className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer ${
                                isFeatured
                                    ? "lg:row-span-2 min-h-[400px] lg:min-h-full"
                                    : "min-h-[280px]"
                            }`}
                        >
                            {/* BACKGROUND IMAGE */}

                            <img
                                src={banner.desktopImage}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                            />

                            {/* GRADIENT OVERLAY */}

                            <div
                                className={`absolute inset-0 bg-gradient-to-t ${
                                    isDark
                                        ? "from-black/90 via-black/40"
                                        : "from-black/60 via-black/20"
                                } to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
                            />

                            {/* CONTENT */}

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 lg:p-10 justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">

                                    {/* TITLE = TAG */}

                                    <span
                                        className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-full backdrop-blur-md border ${
                                            isDark
                                                ? "bg-white/10 text-white border-white/20"
                                                : "bg-black/20 text-white border-white/30"
                                        }`}
                                    >
                                        {banner.title}
                                    </span>

                                    {/* SUBTITLE = HEADLINE */}

                                    <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3 whitespace-pre-line leading-tight text-white">
                                        {banner.subtitle}
                                    </h3>

                                    {/* DESC REMOVED */}

                                    {/* CTA */}

                                    {banner.ctaButtonText && (
                                        <div className="overflow-hidden">
                                            <button
                                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
                                                    isDark
                                                        ? "bg-white text-gray-900 hover:bg-gray-100"
                                                        : "bg-brand text-white hover:bg-brand-light"
                                                }`}
                                            >
                                                {banner.ctaButtonText}

                                                <IoArrowForward
                                                    size={16}
                                                    className="group-hover:translate-x-1 transition-transform"
                                                />
                                            </button>
                                        </div>
                                    )}

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