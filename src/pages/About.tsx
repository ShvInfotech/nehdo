import React from "react";
import { motion } from "framer-motion";
import { IoLeafOutline, IoShirtOutline, IoEarthOutline } from "react-icons/io5";
import Breadcrumb from "../components/Breadcrumb";

const About = () => {
    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="bg-brand-50/50 py-16 md:py-24">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Redefining Everyday Style</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-muted max-w-2xl mx-auto">We believe that premium fashion should be accessible, sustainable, and designed to make you feel confident every single day.</motion.p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
                <div className="mb-12"><Breadcrumb items={[{ label: "About Us" }]} /></div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { icon: IoShirtOutline, title: "Premium Quality", desc: "Every garment is crafted with meticulous attention to detail using high-quality materials built to last." },
                        { icon: IoLeafOutline, title: "Sustainable Practices", desc: "We are committed to reducing our environmental footprint through eco-friendly fabrics and ethical manufacturing." },
                        { icon: IoEarthOutline, title: "Global Inspiration", desc: "Our designs are inspired by global trends, bringing you a curated collection of modern, versatile pieces." }
                    ].map((v, i) => (
                        <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-8 bg-white rounded-3xl shadow-card border border-gray-100">
                            <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-6"><v.icon size={32} /></div>
                            <h3 className="font-heading font-bold text-xl mb-3">{v.title}</h3>
                            <p className="text-muted leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[2.5rem] overflow-hidden aspect-[4/3] bg-gray-100">
                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/64ofuakc_expires_30_days.png" alt="Our story" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                        <p className="text-muted leading-relaxed mb-4">Founded in 2026, Nehdo started with a simple vision: to create a fashion destination where quality meets accessibility. We noticed a gap between high-end luxury and fast fashion, and we set out to fill it.</p>
                        <p className="text-muted leading-relaxed mb-6">Today, Nehdo is a global community of style enthusiasts. Our team of designers works tirelessly to bring you collections that blend timeless elegance with contemporary trends.</p>
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div>
                                <h4 className="font-heading text-3xl font-bold text-brand mb-1">10k+</h4>
                                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="font-heading text-3xl font-bold text-brand mb-1">500+</h4>
                                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">Unique Styles</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
