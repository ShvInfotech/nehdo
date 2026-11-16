import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoFlashOutline, IoArrowForward, IoAddOutline, IoBagAddOutline, IoTimerOutline } from "react-icons/io5";
import { userapiRequest } from "../services/apiService";
import { useCart } from "../context/CartContext";

interface ComboProduct {
    _id: string;
    name: string;
    salePrice: number;
    price: number;
    productImage: string;
    category: string;
}

interface Combo {
    _id: string;
    name: string;
    description: string;
    products: ComboProduct[];
    comboPrice: number;
    originalTotal: number;
    savingsPercent: number;
    tag?: string;
}

// Countdown timer hook
function useCountdown(targetHours = 6) {
    const [time, setTime] = useState(() => {
        const now = new Date();
        const target = new Date();
        target.setHours(now.getHours() + targetHours, 0, 0, 0);
        return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    });

    useEffect(() => {
        if (time <= 0) return;
        const timer = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
        return () => clearInterval(timer);
    }, [time]);

    const h = String(Math.floor(time / 3600)).padStart(2, "0");
    const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    return { h, m, s };
}

const ComboDeals = () => {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const { h, m, s } = useCountdown(8);

    const fetchCombos = async () => {
        try {
            setLoading(true);
            const res = await userapiRequest("/user/api/v1/common/combo", "GET");
            if (res?.success && Array.isArray(res.combos)) {
                setCombos(res.combos);
            } else {
                setCombos([]);
            }
        } catch {
            setCombos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    const handleAddCombo = async (combo: Combo) => {
        for (const p of combo.products) {
            await addItem({
                shipping: false,
                productId: p._id,
                name: p.name,
                brand: "",
                image: p.productImage,
                price: combo.comboPrice / combo.products.length,
                originalPrice: p.price,
                size: "",
                color: "Default",
            });
        }
    };

    if (!loading && combos.length === 0) return null;

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                            <IoFlashOutline size={18} className="text-white" />
                        </div>
                        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                            Combo Deals
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-16 h-1 bg-brand rounded-full" />
                        <p className="text-sm text-muted font-medium">Save more when you buy together</p>
                    </div>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-brand/10 to-accent/10 border border-brand/20 rounded-2xl px-5 py-3">
                    <IoTimerOutline size={18} className="text-brand flex-shrink-0" />
                    <span className="text-xs font-medium text-brand uppercase tracking-wider mr-1">Ends in</span>
                    {[h, m, s].map((unit, i) => (
                        <React.Fragment key={i}>
                            <div className="bg-brand text-white text-sm font-bold w-9 h-9 rounded-lg flex items-center justify-center tabular-nums">
                                {unit}
                            </div>
                            {i < 2 && <span className="text-brand font-bold">:</span>}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-72" />
                    ))}
                </div>
            )}

            {/* Combo Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {combos.map((combo, i) => {
                        const savings = combo.originalTotal
                            ? Math.round(((combo.originalTotal - combo.comboPrice) / combo.originalTotal) * 100)
                            : combo.savingsPercent || 0;

                        return (
                            <motion.div
                                key={combo._id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative bg-white border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                            >
                                {/* Savings Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-brand to-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-button">
                                    SAVE {savings}%
                                </div>

                                {/* Tag */}
                                {combo.tag && (
                                    <div className="absolute top-4 right-4 z-10 bg-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                        {combo.tag}
                                    </div>
                                )}

                                {/* Products Row */}
                                <div className="flex items-center justify-center gap-2 p-6 pb-4 bg-gradient-to-br from-surface to-brand-50">
                                    {combo.products.map((p, pi) => (
                                        <React.Fragment key={p._id}>
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden bg-white shadow-card">
                                                    <img
                                                        src={p.productImage}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-muted mt-1 text-center max-w-[80px] truncate font-medium">
                                                    {p.name}
                                                </p>
                                            </div>
                                            {pi < combo.products.length - 1 && (
                                                <div className="w-6 h-6 bg-brand/15 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <IoAddOutline size={14} className="text-brand" />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Info */}
                                <div className="p-5 pt-4">
                                    <h3 className="font-heading font-bold text-base text-gray-900 mb-1 truncate">
                                        {combo.name}
                                    </h3>
                                    {combo.description && (
                                        <p className="text-xs text-muted mb-3 line-clamp-2 leading-relaxed">
                                            {combo.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-heading font-black text-xl text-brand">
                                                    ₹{Number(combo.comboPrice).toLocaleString("en-IN")}
                                                </span>
                                                {combo.originalTotal > 0 && (
                                                    <span className="text-sm text-muted line-through">
                                                        ₹{Number(combo.originalTotal).toLocaleString("en-IN")}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                                                You save ₹{Number((combo.originalTotal || 0) - combo.comboPrice).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleAddCombo(combo)}
                                            className="flex items-center gap-2 bg-brand hover:bg-brand-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-button hover:shadow-button-hover hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <IoBagAddOutline size={16} />
                                            Add Combo
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* View All CTA */}
            {!loading && combos.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <a
                        href="/shop?filter=combo"
                        className="inline-flex items-center gap-2 border-2 border-brand text-brand hover:bg-brand hover:text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300"
                    >
                        View All Combos <IoArrowForward size={16} />
                    </a>
                </motion.div>
            )}
        </section>
    );
};

export default ComboDeals;

