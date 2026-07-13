import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoSearchOutline } from "react-icons/io5";
import Breadcrumb from "../components/Breadcrumb";

const faqs = [
    { category: "Orders & Shipping", questions: [
        { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. International shipping times vary by destination." },
        { q: "Do you offer free shipping?", a: "Yes, we offer free standard shipping on all orders over ₹250." },
        { q: "How can I track my order?", a: "Once your order ships, you will receive a confirmation email with a tracking link. You can also track your order directly from your Account Dashboard." }
    ]},
    { category: "Returns & Exchanges", questions: [
        { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached." },
        { q: "How do I start a return?", a: "Log into your account, go to Order History, select the order, and click 'Initiate Return'. Follow the prompts to get your return shipping label." }
    ]},
    { category: "Payment & Account", questions: [
        { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, Google Pay, and Apple Pay." },
        { q: "Is my payment information secure?", a: "Absolutely. Our checkout process is fully encrypted and PCI compliant. We do not store your credit card information on our servers." }
    ]}
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<string>("0-0");
    const [search, setSearch] = useState("");

    return (
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-12 pb-24">
            <div className="mb-8"><Breadcrumb items={[{ label: "Help Center" }]} /></div>
            
            <div className="text-center mb-12">
                <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">How can we help?</h1>
                <div className="relative max-w-lg mx-auto">
                    <IoSearchOutline size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search for answers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-brand shadow-sm" />
                </div>
            </div>

            <div className="space-y-12">
                {faqs.map((cat, cIdx) => {
                    const filtered = cat.questions.filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()));
                    if (filtered.length === 0) return null;

                    return (
                        <div key={cat.category}>
                            <h2 className="font-heading text-xl font-bold mb-6 text-brand">{cat.category}</h2>
                            <div className="space-y-4">
                                {filtered.map((item, qIdx) => {
                                    const id = `${cIdx}-${qIdx}`;
                                    const isOpen = openIndex === id;
                                    return (
                                        <div key={id} className={`border rounded-2xl transition-all overflow-hidden ${isOpen ? "border-brand bg-brand/5" : "border-gray-200 bg-white"}`}>
                                            <button onClick={() => setOpenIndex(isOpen ? "" : id)} className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold">
                                                {item.q}
                                                <IoChevronDown size={20} className={`text-brand transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                                        <div className="px-6 pb-5 text-muted leading-relaxed">{item.a}</div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 bg-gray-50 rounded-3xl p-8 text-center border border-gray-100">
                <h3 className="font-heading font-bold text-xl mb-2">Still need help?</h3>
                <p className="text-muted mb-6">Our customer support team is available 24/7 to assist you.</p>
                <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">Contact Support</button>
            </div>
        </div>
    );
};

export default FAQ;
