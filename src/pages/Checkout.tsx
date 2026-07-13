import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoCardOutline, IoLocationOutline, IoLockClosedOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";

const Checkout = () => {
    const { items, subtotal, shipping, total, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
                <h2 className="font-heading text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/shop" className="text-brand font-semibold hover:underline">Return to Shop</Link>
            </div>
        );
    }

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            clearCart();
            navigate("/order-confirmation");
        }, 2000);
    };

    return (
        <div className="bg-surface-warm min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
                    <Link to="/" className="font-heading text-xl font-bold text-brand">NEHDO</Link>
                    <div className="flex items-center gap-1 text-sm text-green-600 font-semibold"><IoLockClosedOutline size={16} /> Secure Checkout</div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16 py-8">
                <div className="mb-6"><Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} /></div>

                {/* Progress */}
                <div className="flex items-center justify-between max-w-lg mx-auto mb-10 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                    <div className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
                    
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? "bg-brand text-white" : "bg-gray-200 text-gray-500"}`}>
                            {step > s ? <IoCheckmarkCircle size={18} /> : s}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Forms */}
                    <div className="lg:col-span-7 space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white rounded-3xl p-6 md:p-8 shadow-card">
                                    <div className="flex items-center gap-3 mb-6"><IoLocationOutline size={24} className="text-brand" /><h2 className="font-heading text-xl font-bold">Shipping Address</h2></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input type="text" placeholder="First Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand" />
                                        <input type="text" placeholder="Last Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand" />
                                    </div>
                                    <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand mb-4" />
                                    <input type="text" placeholder="Street Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand mb-4" />
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <input type="text" placeholder="City" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand" />
                                        <input type="text" placeholder="Postal Code" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand" />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all">Continue to Payment</button>
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="bg-white rounded-3xl p-6 md:p-8 shadow-card">
                                    <div className="flex items-center gap-3 mb-6"><IoCardOutline size={24} className="text-brand" /><h2 className="font-heading text-xl font-bold">Payment Method</h2></div>
                                    <div className="p-4 border-2 border-brand rounded-xl mb-6 bg-brand/5 relative">
                                        <div className="absolute top-4 right-4 flex gap-1">
                                            <div className="w-8 h-5 bg-blue-600 rounded" />
                                            <div className="w-8 h-5 bg-red-500 rounded" />
                                        </div>
                                        <label className="flex items-center gap-3 font-semibold mb-4"><input type="radio" checked readOnly className="accent-brand" /> Credit / Debit Card</label>
                                        <input type="text" placeholder="Card Number" required pattern="\d*" maxLength={16} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand mb-4 bg-white" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand bg-white" />
                                            <input type="text" placeholder="CVV" required pattern="\d*" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand bg-white" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Back</button>
                                        <button type="submit" className="flex-1 py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all">Review Order</button>
                                    </div>
                                </motion.form>
                            )}

                            {step === 3 && (
                                <motion.form key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 md:p-8 shadow-card text-center">
                                    <h2 className="font-heading text-2xl font-bold mb-2">Review Your Order</h2>
                                    <p className="text-muted mb-8">Please confirm your details before placing the order.</p>
                                    
                                    <div className="text-left bg-gray-50 p-6 rounded-2xl mb-8">
                                        <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">Shipping To:</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">John Doe<br/>123 Fashion Ave, Apt 4B<br/>New York, NY 10001</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep(2)} disabled={isProcessing} className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50">Back</button>
                                        <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all flex items-center justify-center gap-2">
                                            {isProcessing ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Place Order"}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 bg-white rounded-3xl p-6 md:p-8 shadow-card">
                            <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
                                {items.map(item => (
                                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-muted mt-0.5">{item.size} / {item.color}</p>
                                            <p className="text-sm font-bold text-accent mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm mb-4">
                                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Shipping</span><span className="font-semibold">{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span></div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="font-heading font-bold text-lg">Total</span>
                                <span className="font-heading font-bold text-2xl text-brand">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
