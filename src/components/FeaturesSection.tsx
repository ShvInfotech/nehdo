import React from "react";
import { motion } from "framer-motion";
import {
    IoRocketOutline,
    IoRefreshOutline,
    IoShieldCheckmarkOutline,
    IoHeadsetOutline,
    IoLockClosedOutline,
    IoCashOutline,
} from "react-icons/io5";

const features = [
    {
        icon: IoRocketOutline,
        title: "Free Delivery",
        desc: "On orders above ₹499",
        color: "bg-blue-50 text-blue-600",
        badge: null,
    },
    {
        icon: IoLockClosedOutline,
        title: "100% Discreet",
        desc: "Plain packaging, private billing",
        color: "bg-rose-50 text-rose-600",
        badge: "Privacy",
    },
    {
        icon: IoCashOutline,
        title: "Cash on Delivery",
        desc: "Pay when it arrives",
        color: "bg-green-50 text-green-600",
        badge: "COD",
    },
    {
        icon: IoShieldCheckmarkOutline,
        title: "Secure Payment",
        desc: "UPI, Cards, Wallets accepted",
        color: "bg-amber-50 text-amber-600",
        badge: null,
    },
    {
        icon: IoRefreshOutline,
        title: "Easy Returns",
        desc: "7-day hassle-free returns",
        color: "bg-purple-50 text-purple-600",
        badge: null,
    },
    {
        icon: IoHeadsetOutline,
        title: "24/7 Support",
        desc: "Call, chat or WhatsApp",
        color: "bg-teal-50 text-teal-600",
        badge: null,
    },
];

const FeaturesSection = () => {
    return (
        <section className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 -mt-8 md:-mt-12 mb-16 md:mb-24">
            <div className="bg-white rounded-3xl shadow-card-hover p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="relative flex flex-col items-center text-center gap-2.5 group cursor-default p-3 rounded-2xl hover:bg-surface transition-colors"
                        >
                            {f.badge && (
                                <span className="absolute -top-1 -right-1 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                    {f.badge}
                                </span>
                            )}
                            <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                                <f.icon size={22} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-xs md:text-sm text-gray-900 mb-0.5 leading-tight">
                                    {f.title}
                                </h3>
                                <p className="text-[10px] md:text-xs text-muted leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
