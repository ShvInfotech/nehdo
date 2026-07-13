import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMailOutline, IoSparkles } from "react-icons/io5";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setEmail("");
            }, 3000);
        }
    };

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-brand-100 via-surface to-brand-50 py-14 md:py-20 px-6 md:px-12"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-gold rounded-full animate-float pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-brand/30 rounded-full animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
                <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-accent/20 rounded-full animate-float pointer-events-none" style={{ animationDelay: "4s" }} />

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-2xl mb-6"
                    >
                        <IoMailOutline className="text-brand" size={28} />
                    </motion.div>

                    <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Stay in the Loop
                    </h2>
                    <p className="text-muted text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
                        Get <span className="text-brand font-semibold">10% off</span> your first order + exclusive access to new arrivals, sales, and style tips.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
                        <div className="relative flex-1">
                            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full pl-12 pr-4 py-4 text-sm bg-white rounded-2xl border border-gray-200 shadow-card focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                            />
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-8 py-4 rounded-2xl text-sm font-semibold shadow-button transition-all flex items-center justify-center gap-2 ${
                                submitted
                                    ? "bg-green-500 text-white"
                                    : "bg-brand hover:bg-brand-light text-white hover:shadow-button-hover"
                            }`}
                        >
                            {submitted ? (
                                <>
                                    <IoSparkles size={16} /> Subscribed!
                                </>
                            ) : (
                                "Subscribe"
                            )}
                        </motion.button>
                    </form>

                    <p className="text-xs text-muted">
                        No spam, ever. Unsubscribe anytime. Read our{" "}
                        <a href="/privacy" className="underline hover:text-brand transition-colors">Privacy Policy</a>.
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default NewsletterSection;
