import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoTrashOutline, IoRemoveOutline, IoAddOutline, IoArrowForward, IoBagOutline, IoFlashOutline } from "react-icons/io5";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";
import { triggerMagicCheckout } from "../utils/magicCheckout";
import { toast } from "react-toastify";

const Cart = () => {
    const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
    const { user, setSession } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('appliedCoupon');
        sessionStorage.removeItem('shippingCharge');
    }, []);

    const finalTotal = subtotal;

    if (items.length === 0)
        return (
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-20 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoBagOutline size={40} className="text-gray-400" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3"> Your cart is empty </h2>
                    <p className="text-muted mb-6"> Looks like you haven't added anything yet </p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-2xl font-semibold hover:bg-brand-light transition-colors shadow-button" >
                        Continue Shopping <IoArrowForward size={18} />
                    </Link>
                </motion.div>
            </div>
        );

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6">
                <Breadcrumb items={[{ label: "Cart" }]} />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Shopping Cart
                <span className="text-muted text-xl font-normal">({itemCount} items)</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div key={`${item.productId}-${item.size}-${item.color}`} layout exit={{ opacity: 0, x: -50, height: 0 }} className="flex gap-4 md:gap-6 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-card" >
                                <Link to={`/product/${item.productId}`} className="flex-shrink-0 w-24 h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-gray-100" >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </Link>

                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[11px] text-muted font-medium uppercase tracking-wider">{item.brand}</p>

                                        <Link to={`/product/${item.productId}`} className="font-heading font-semibold text-sm md:text-base text-gray-900 hover:text-brand transition-colors truncate block" >
                                            {item.name}
                                        </Link>

                                        <p className="text-xs text-muted mt-0.5"> Size: {item.size} · Color: {item.color} </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors" >
                                                <IoRemoveOutline size={14} />
                                            </button>

                                            <span className="px-3 py-2 text-sm font-semibold"> {item.quantity} </span>

                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors" >
                                                <IoAddOutline size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-heading font-bold text-base text-accent"> ₹{(item.price * item.quantity).toFixed(2)} </span>

                                            <button onClick={() => removeItem(item._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" >
                                                <IoTrashOutline size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 className="font-heading font-bold text-lg text-gray-900 mb-5"> Order Summary </h2>

                        <div className="space-y-3 text-sm mb-5">
                            <div className="flex justify-between">
                                <span className="text-muted">Subtotal</span>
                                <span className="font-semibold"> ₹{subtotal.toFixed(2)} </span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 mb-5" />

                        <div className="flex justify-between mb-6">
                            <span className="font-heading font-bold text-lg"> Total </span>
                            <span className="font-heading font-bold text-xl text-brand"> ₹{finalTotal.toFixed(2)} </span>
                        </div>

                        <button
                            type="button"
                            disabled={isCheckingOut}
                            onClick={() => {
                                setIsCheckingOut(true);
                                triggerMagicCheckout({
                                    items,
                                    user,
                                    onSuccess: (res) => {
                                        setIsCheckingOut(false);
                                        if (res.accessToken && res.user) {
                                            setSession(res.user, res.accessToken);
                                        }
                                        clearCart();
                                        sessionStorage.removeItem("appliedCoupon");
                                        sessionStorage.removeItem("shippingCharge");
                                        toast.success("Order placed successfully!");
                                        navigate("/order-confirmation");
                                    },
                                    onError: () => {
                                        setIsCheckingOut(false);
                                    },
                                    onClose: () => {
                                        setIsCheckingOut(false);
                                    }
                                });
                            }}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white text-center rounded-2xl font-bold text-base shadow-button hover:shadow-button-hover transition-all cursor-pointer disabled:opacity-60"
                        >
                            {isCheckingOut ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Opening Magic Checkout...</span>
                                </>
                            ) : (
                                <>
                                    <IoFlashOutline size={20} className="animate-pulse" />
                                    <span>Proceed to Magic Checkout ⚡</span>
                                </>
                            )}
                        </button>

                        <Link to="/shop" className="block text-center text-sm text-muted hover:text-brand mt-4 transition-colors" >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;