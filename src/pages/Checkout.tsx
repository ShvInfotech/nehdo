import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoFlashOutline,
    IoShieldCheckmarkOutline,
    IoLockClosedOutline,
    IoCloseOutline,
    IoSparklesOutline,
    IoBagHandleOutline,
    IoArrowForward,
    IoCheckmarkDoneCircle
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from "../services/apiService";
import { toast } from "react-toastify";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const Checkout: React.FC = () => {
    const { items, subtotal, shipping, clearCart, setShippingCharge } = useCart();
    const { user, setSession } = useAuth();
    const navigate = useNavigate();

    const [discount, setDiscount] = useState<number>(0);
    const [couponId, setCouponId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const autoLaunchTriggered = useRef<boolean>(false);

    // Load applied coupons or shipping charges from session storage if present
    useEffect(() => {
        const storedShipping = sessionStorage.getItem("shippingCharge");
        if (storedShipping !== null) {
            setShippingCharge(Number(storedShipping));
        }

        const storedCoupon = sessionStorage.getItem("appliedCoupon");
        if (storedCoupon) {
            try {
                const parsed = JSON.parse(storedCoupon);
                if (parsed?.discount) {
                    setDiscount(Number(parsed.discount));
                }
                if (parsed?.couponId) {
                    setCouponId(parsed.couponId);
                }
            } catch (err) {
                console.error("Coupon parse error:", err);
            }
        }
    }, [setShippingCharge]);

    // Load Razorpay Magic Checkout SDK script
    const loadRazorpay = (): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const getErrorMessage = (error: any): string => {
        if (error?.response?.data) {
            const data = error.response.data;
            if (typeof data?.message === "string") return data.message;
            if (typeof data?.error === "string") return data.error;
            if (typeof data?.errors === "string") return data.errors;
        }
        if (typeof error?.message === "string") return error.message;
        if (typeof error === "string") return error;
        return "Failed to complete checkout. Please try again.";
    };

    // ⚡ 1-Click Razorpay Magic Checkout
    const handleRazorpayMagicCheckout = async () => {
        try {
            setErrorMessage("");
            setIsProcessing(true);

            if (!items.length) {
                toast.error("Cart is empty.");
                setIsProcessing(false);
                return;
            }

            const sdkLoaded = await loadRazorpay();
            if (!sdkLoaded) {
                toast.error("Razorpay SDK failed to load. Please check your internet connection.");
                setIsProcessing(false);
                return;
            }

            // Extract cart IDs or item payload for guest items
            const cartIds = items.map((item) => item._id).filter(Boolean);
            const itemsPayload = items.map((item) => ({
                productId: (item.productId as any)?._id || item.productId || item._id,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price
            }));

            // Create Razorpay payment order configured for Magic Checkout
            const result = await userapiRequest("/api/v1/magic-checkout/create-order", "POST", {
                cartIds,
                items: itemsPayload,
                discount,
                shippingcharge: shipping,
                couponId: couponId,
                magic: true,
                contact: user?.phone || "",
                email: user?.email || "",
                name: user?.name || ""
            });

            if (result?.success === false || !result?.order?.id) {
                toast.error(result?.message || "Unable to initiate Magic Checkout.");
                setIsProcessing(false);
                return;
            }

            const razorpayKey = result.key || result.key_id || "rzp_live_TlHEi6zwAq3CaX";

            const clientLineItems = (result?.line_items || []).map((li: any) => ({
                item_id: li.variant_id || li.sku,
                variant_id: li.variant_id || li.sku,
                name: li.name,
                amount: li.price,
                price: li.price,
                offer_price: li.offer_price || li.price,
                currency: "INR",
                quantity: li.quantity,
                sku: li.sku,
                image: li.image_url,
                image_url: li.image_url
            }));

            const cleanPhone = user?.phone ? String(user.phone).replace(/\D/g, "").slice(-10) : "";
            const prefill: Record<string, string> = {};
            if (cleanPhone && cleanPhone.length === 10) {
                prefill.contact = cleanPhone;
            }
            if (user?.email && typeof user.email === "string" && user.email.includes("@")) {
                prefill.email = user.email;
            }
            if (user?.name && typeof user.name === "string" && user.name.trim()) {
                prefill.name = user.name.trim();
            }

            const options = {
                key: razorpayKey,
                amount: result.order.amount,
                currency: result.order.currency,
                order_id: result.order.id,
                name: "NEHDO",
                description: "1-Click Magic Checkout (Prepaid / COD)",
                image: `${window.location.origin}/logo.png`,
                one_click_checkout: true, // Activates Magic Checkout UI
                show_coupons: true,
                line_items: clientLineItems,
                prefill,
                notes: {
                    userId: user?._id || "",
                    cartIds: cartIds.join(","),
                    couponId: couponId || "",
                    discount: String(discount || 0),
                    shippingcharge: String(shipping || 0),
                    contact: cleanPhone || "",
                    phone: cleanPhone || "",
                    email: user?.email || "",
                    name: user?.name || "",
                    magic_checkout: "true"
                },
                theme: { color: "#000000" },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                },
                handler: async function (response: any) {
                    try {
                        setErrorMessage("");
                        setIsProcessing(true);

                        const isCod = Boolean(
                            response?.method === "cod" ||
                            !response?.razorpay_signature
                        );

                        // Call Magic Order Completion API
                        const completeRes = await userapiRequest("/api/v1/magic-checkout/verify-order", "POST", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id || (isCod ? `cod_${Date.now()}` : ""),
                            razorpay_signature: response.razorpay_signature || "",
                            isCod,
                            method: isCod ? "cod" : "online",
                            couponId: couponId,
                            cartIds,
                            items: itemsPayload,
                            shipping,
                            discount,
                            contact: response?.contact || user?.phone || "",
                            email: response?.email || user?.email || "",
                            customer: {
                                contact: response?.contact || user?.phone || "",
                                email: response?.email || user?.email || "",
                                name: response?.name || user?.name || ""
                            }
                        });

                        if (completeRes?.success) {
                            // Automatically log user in if token and user details are returned
                            if (completeRes?.accessToken && completeRes?.user) {
                                setSession(completeRes.user, completeRes.accessToken);
                            }

                            if (completeRes?.order?.orderNumber) {
                                localStorage.setItem("orderId", completeRes.order.orderNumber);
                            }

                            toast.success(completeRes.message || "Order placed successfully!");
                            clearCart();
                            sessionStorage.removeItem("shippingCharge");
                            sessionStorage.removeItem("appliedCoupon");
                            setIsProcessing(false);
                            navigate("/order-confirmation");
                        } else {
                            toast.error(completeRes?.message || "Order completion failed.");
                            setIsProcessing(false);
                        }
                    } catch (error: any) {
                        toast.error(getErrorMessage(error));
                        setErrorMessage(getErrorMessage(error));
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", function (response: any) {
                toast.error(response?.error?.description || response?.error?.reason || "Payment failed. Please try again.");
                setIsProcessing(false);
            });

            razorpay.open();
            setIsProcessing(false);
        } catch (error: any) {
            toast.error(getErrorMessage(error));
            setErrorMessage(getErrorMessage(error));
            setIsProcessing(false);
        }
    };

    // Auto-launch Magic Checkout once if items exist
    useEffect(() => {
        if (!autoLaunchTriggered.current && items.length > 0) {
            autoLaunchTriggered.current = true;
            // Short timeout to let the page mount cleanly
            const timer = setTimeout(() => {
                handleRazorpayMagicCheckout();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [items.length]);

    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <IoBagHandleOutline size={36} />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-3 text-gray-900">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any items to your cart yet. Explore our latest collection!
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold rounded-2xl shadow-button hover:bg-brand-light transition-all"
                >
                    Continue Shopping <IoArrowForward size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-surface-warm min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
                    <Link to="/" className="font-heading text-2xl font-bold text-brand tracking-tight">
                        NEHDO
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full font-semibold border border-green-200">
                        <IoLockClosedOutline size={16} />
                        <span>100% Secure Checkout</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16 py-8">
                <div className="mb-6">
                    <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Magic Checkout" }]} />
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 max-w-full mx-auto"
                        >
                            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                <p className="text-sm font-medium">{errorMessage}</p>
                                <button
                                    type="button"
                                    onClick={() => setErrorMessage("")}
                                    className="flex-shrink-0 hover:opacity-70"
                                >
                                    <IoCloseOutline size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Magic Checkout Card */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                                        <IoFlashOutline size={26} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900">
                                                Razorpay Magic Checkout
                                            </h2>
                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                Fast & Simple
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Order directly without prior login • Dynamic user details
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Checklist */}
                            <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-blue-50/70 border border-indigo-100 rounded-2xl p-5 mb-8">
                                <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                    <IoSparklesOutline className="text-indigo-600" size={18} />
                                    How Magic Checkout Works:
                                </h3>
                                <div className="space-y-2.5 text-xs md:text-sm text-gray-700">
                                    <div className="flex items-start gap-2.5">
                                        <IoCheckmarkDoneCircle className="text-indigo-600 mt-0.5 flex-shrink-0" size={18} />
                                        <span><strong>No prior password needed:</strong> Simply verify via OTP in Magic Checkout.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <IoCheckmarkDoneCircle className="text-indigo-600 mt-0.5 flex-shrink-0" size={18} />
                                        <span><strong>Auto-saved Addresses:</strong> Auto-fetches your delivery address across 100M+ stores.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <IoCheckmarkDoneCircle className="text-indigo-600 mt-0.5 flex-shrink-0" size={18} />
                                        <span><strong>Dynamic Coupons & Live Delivery:</strong> Automatically shows eligible discounts and courier rates for your pincode.</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <IoCheckmarkDoneCircle className="text-indigo-600 mt-0.5 flex-shrink-0" size={18} />
                                        <span><strong>All Payment Methods:</strong> UPI (Google Pay, PhonePe, Paytm), Cards, Net Banking, and COD.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={handleRazorpayMagicCheckout}
                                disabled={isProcessing}
                                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-button hover:shadow-button-hover transition-all flex items-center justify-center gap-3 text-base md:text-lg cursor-pointer disabled:opacity-60"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Opening Magic Checkout...</span>
                                    </>
                                ) : (
                                    <>
                                        <IoFlashOutline size={22} className="animate-pulse" />
                                        <span>Pay & Place Order with Magic Checkout ⚡</span>
                                    </>
                                )}
                            </button>

                            {/* Security Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5 text-green-700">
                                    <IoShieldCheckmarkOutline size={16} /> 100% Safe & Secure Payments
                                </span>
                                <span>•</span>
                                <span>Razorpay 1CC Protected</span>
                                <span>•</span>
                                <span>Prepaid & COD Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 sticky top-6">
                            <h3 className="font-heading font-bold text-xl mb-4 text-gray-900">
                                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                            </h3>

                            {/* Items List */}
                            <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto pr-1 mb-6">
                                {items.map((item, idx) => (
                                    <div key={idx} className="py-3 flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    🛍️
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.size && item.color && <span>•</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                                <span>•</span>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                            <p className="font-bold text-sm text-brand mt-1">
                                                ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-600 text-xs">
                                    <span>Delivery & COD Charges</span>
                                    <span className="text-gray-500 italic">Calculated in Magic Checkout</span>
                                </div>

                                <div className="h-px bg-gray-200 my-2" />

                                <div className="flex justify-between items-center text-base md:text-lg font-bold">
                                    <span className="text-gray-900">Estimated Total</span>
                                    <span className="text-brand">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-gray-400 mt-4 text-center">
                                Final shipping charges and COD fees are calculated dynamically based on your pincode inside Razorpay Magic Checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;