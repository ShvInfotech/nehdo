import React from "react";
import { motion } from "framer-motion";
import { IoRocketOutline, IoRefreshOutline, IoShieldCheckmarkOutline, IoHeadsetOutline } from "react-icons/io5";

const features = [
    {
        icon: IoRocketOutline,
        title: "Free Shipping",
        desc: "On orders above ₹250",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: IoRefreshOutline,
        title: "Easy Returns",
        desc: "30 days return policy",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: IoShieldCheckmarkOutline,
        title: "Secure Payment",
        desc: "100% secure payment",
        color: "bg-amber-50 text-amber-600",
    },
    {
        icon: IoHeadsetOutline,
        title: "24/7 Support",
        desc: "Dedicated support",
        color: "bg-purple-50 text-purple-600",
    },
];

const FeaturesSection = () => {
    return (
        <section className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 -mt-8 md:-mt-12 mb-16 md:mb-24">
            <div className="bg-white rounded-3xl shadow-card-hover p-6 md:p-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-center sm:text-left group cursor-default p-3 rounded-2xl hover:bg-surface transition-colors"
                        >
                            <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <f.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-sm md:text-base text-gray-900 mb-1">
                                    {f.title}
                                </h3>
                                <p className="text-xs md:text-sm text-muted leading-relaxed">
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
