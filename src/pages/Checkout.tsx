import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoCheckmarkCircle,
    IoCardOutline,
    IoLocationOutline,
    IoLockClosedOutline,
    IoCloseOutline,
} from "react-icons/io5";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from "../services/apiService";

const Checkout = () => {
    const {
        items,
        subtotal,
        shipping,
        clearCart,
        setShippingCharge
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] =
        useState<"upi" | "card" | "netbanking">("upi");

    const [CoupenId, setCoupenId] = useState("");

    // Backend error UI mate
    const [errorMessage, setErrorMessage] = useState("");

    // ================================
    // DEFAULT ADDRESS
    // ================================
    const defaultAddress = user?.address?.find(
        (address) => address.defaultaddress === true
    );

    // ================================
    // USER NAME
    // ================================
    const nameParts = user?.name?.trim().split(" ") || [];

    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // ================================
    // GET ERROR MESSAGE
    // ================================
    const getErrorMessage = (error: any) => {
        console.error("Checkout Error:", error);

        // Axios response error
        if (error?.response?.data) {
            const data = error.response.data;

            if (typeof data?.message === "string") {
                return data.message;
            }

            if (typeof data?.error === "string") {
                return data.error;
            }

            if (typeof data?.errors === "string") {
                return data.errors;
            }

            // errors object
            if (data?.errors && typeof data.errors === "object") {
                const messages = Object.values(data.errors)
                    .flat()
                    .filter(Boolean);

                if (messages.length > 0) {
                    return messages.join(", ");
                }
            }
        }

        // apiRequest direct thrown error
        if (typeof error?.message === "string") {
            return error.message;
        }

        if (typeof error === "string") {
            return error;
        }

        return "Something went wrong. Please try again.";
    };

    // ================================
    // EMPTY CART
    // ================================
    if (items.length === 0 && !isProcessing) {
        return (
            <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
                <h2 className="font-heading text-2xl font-bold mb-4">
                    Your cart is empty
                </h2>

                <Link
                    to="/shop"
                    className="text-brand font-semibold hover:underline"
                >
                    Return to Shop
                </Link>
            </div>
        );
    }

    // ================================
    // PLACE ORDER
    // ================================
    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMessage("");
        setIsProcessing(true);

        setTimeout(() => {
            clearCart();

            sessionStorage.removeItem("shippingCharge");
            sessionStorage.removeItem("appliedCoupon");

            navigate("/order-confirmation");

            setIsProcessing(false);
        }, 2000);
    };

    // ================================
    // LOAD RAZORPAY
    // ================================
    const loadRazorpay = () => {
        return new Promise<boolean>((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);

            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    // ================================
    // RAZORPAY PAYMENT
    // ================================
    const handleRazorpayPayment = async () => {
        try {
            // Old error clear
            setErrorMessage("");
            setIsProcessing(true);

            // Address check
            if (!defaultAddress?._id) {
                setErrorMessage(
                    "Please add and select a default shipping address."
                );

                setIsProcessing(false);
                setStep(1);

                return;
            }

            // Cart check
            const cartIds = items
                .map((item) => item._id)
                .filter(Boolean);

            if (!cartIds.length) {
                setErrorMessage("Cart items not found.");

                setIsProcessing(false);

                return;
            }

            // 1. Load Razorpay SDK
            const sdkLoaded = await loadRazorpay();

            if (!sdkLoaded) {
                setErrorMessage(
                    "Razorpay SDK failed to load. Please try again."
                );

                setIsProcessing(false);

                return;
            }

            // ==================================
            // 2. CREATE PAYMENT ORDER
            // BACKEND STOCK ERROR AHI AVSE
            // ==================================
            const result = await userapiRequest(
                "/user/api/v1/common/paymentOrder",
                "POST",
                {
                    cartIds,
                    discount,
                    shippingcharge: shipping,
                }
            );

            // Backend success false
            if (result?.success === false) {
                setErrorMessage(
                    result?.message ||
                    "Unable to create payment order."
                );

                setIsProcessing(false);

                return;
            }

            // Razorpay order check
            if (!result?.order?.id) {
                setErrorMessage(
                    result?.message ||
                    "Razorpay order ID not found."
                );

                setIsProcessing(false);

                return;
            }

            setIsProcessing(false);

            // ==================================
            // 3. RAZORPAY OPTIONS
            // ==================================
            const options = {
                key: "rzp_test_MJ6kGUsiZlv1c9",

                amount: result.order.amount,

                currency: result.order.currency,

                order_id: result.order.id,

                name: "NEHDO",

                description: "Nehdo Order Payment",

                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || "",
                },

                theme: {
                    color: "#000000",
                },

                handler: async function (response: any) {
                    try {
                        setErrorMessage("");
                        setIsProcessing(true);

                        // ================================
                        // 4. VERIFY PAYMENT
                        // BACKEND ERROR UI MA AVSE
                        // ================================
                        const verifyResponse =
                            await userapiRequest(
                                "/user/api/v1/common/verifypayment",
                                "POST",
                                {
                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature,

                                    coupenId: CoupenId,

                                    addressId:
                                        defaultAddress._id,

                                    cartIds,

                                    shipping,

                                    discount,
                                }
                            );

                        // Backend success false
                        if (verifyResponse?.success === false) {
                            setErrorMessage(
                                verifyResponse?.message ||
                                "Payment verification failed."
                            );

                            setIsProcessing(false);

                            return;
                        }

                        // ================================
                        // PAYMENT VERIFIED
                        // ================================
                        if (verifyResponse?.success) {
                            if (
                                verifyResponse?.order?.orderNumber
                            ) {
                                localStorage.setItem(
                                    "orderId",
                                    verifyResponse.order.orderNumber
                                );
                            }

                            setIsProcessing(false);

                            setStep(3);
                        } else {
                            setErrorMessage(
                                verifyResponse?.message ||
                                "Payment verification failed."
                            );

                            setIsProcessing(false);
                        }

                    } catch (error: any) {
                        setErrorMessage(
                            getErrorMessage(error)
                        );

                        setIsProcessing(false);
                    }
                },
            };

            // ==================================
            // 4. OPEN RAZORPAY
            // ==================================
            const razorpay = new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (response: any) {
                    console.error(
                        "Payment Failed:",
                        response.error
                    );

                    setErrorMessage(
                        response?.error?.description ||
                        response?.error?.reason ||
                        "Payment failed. Please try again."
                    );

                    setIsProcessing(false);
                }
            );

            razorpay.open();

        } catch (error: any) {
            setErrorMessage(
                getErrorMessage(error)
            );

            setIsProcessing(false);
        }
    };

    // ================================
    // SHIPPING + COUPON
    // ================================
    useEffect(() => {
        const storedShipping =
            sessionStorage.getItem("shippingCharge");

        if (storedShipping !== null) {
            setShippingCharge(
                Number(storedShipping)
            );
        }

        const storedCoupon =
            sessionStorage.getItem("appliedCoupon");

        if (storedCoupon) {
            try {
                const appliedCoupon =
                    JSON.parse(storedCoupon);

                if (appliedCoupon?.discount) {
                    setDiscount(
                        Number(appliedCoupon.discount)
                    );

                    setCoupenId(
                        appliedCoupon.couponId || ""
                    );
                }
            } catch (error) {
                console.error(
                    "Coupon parse error:",
                    error
                );
            }
        }
    }, [setShippingCharge]);

    const finalTotal =
        subtotal - discount + shipping;

    return (
        <div className="bg-surface-warm min-h-screen pb-20">

            {/* ================= HEADER ================= */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">

                    <Link
                        to="/"
                        className="font-heading text-xl font-bold text-brand"
                    >
                        NEHDO
                    </Link>

                    <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                        <IoLockClosedOutline size={16} />
                        Secure Checkout
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16 py-8">

                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            {
                                label: "Cart",
                                href: "/cart",
                            },
                            {
                                label: "Checkout",
                            },
                        ]}
                    />
                </div>

                {/* ================= ERROR MESSAGE ================= */}

                <AnimatePresence>
                    {errorMessage && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -10,
                            }}
                            className="mb-6 max-w-[700px] mx-auto"
                        >
                            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600">

                                <p className="text-sm font-medium">
                                    {errorMessage}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setErrorMessage("")
                                    }
                                    className="flex-shrink-0 hover:opacity-70"
                                >
                                    <IoCloseOutline size={20} />
                                </button>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ================= PROGRESS ================= */}

                <div className="flex items-center justify-between max-w-lg mx-auto mb-10 relative">

                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />

                    <div
                        className="absolute top-1/2 left-0 h-1 bg-brand -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                            width:
                                step === 1
                                    ? "0%"
                                    : step === 2
                                        ? "50%"
                                        : "100%",
                        }}
                    />

                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s
                                ? "bg-brand text-white"
                                : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {step > s ? (
                                <IoCheckmarkCircle size={18} />
                            ) : (
                                s
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* ================= FORMS ================= */}

                    <div className="lg:col-span-7 space-y-6">

                        <AnimatePresence mode="wait">

                            {/* ================= STEP 1 ================= */}

                            {step === 1 && (
                                <motion.form
                                    key="s1"
                                    initial={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: -20,
                                    }}
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        setErrorMessage("");

                                        if (!defaultAddress?._id) {
                                            setErrorMessage(
                                                "Please add a default shipping address."
                                            );

                                            return;
                                        }

                                        setStep(2);
                                    }}
                                    className="bg-white rounded-3xl p-6 md:p-8 shadow-card"
                                >

                                    <div className="flex items-center gap-3 mb-6">
                                        <IoLocationOutline
                                            size={24}
                                            className="text-brand"
                                        />

                                        <h2 className="font-heading text-xl font-bold">
                                            Shipping Address
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                                        <input
                                            type="text"
                                            value={firstName}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                                        />

                                        <input
                                            type="text"
                                            value={lastName}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                                        />

                                    </div>

                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed mb-4"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            defaultAddress
                                                ? `${defaultAddress.addressline || ""} ${defaultAddress.landmark || ""}`.trim()
                                                : ""
                                        }
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed mb-4"
                                    />

                                    <div className="grid grid-cols-2 gap-4 mb-6">

                                        <input
                                            type="text"
                                            value={
                                                defaultAddress?.city || ""
                                            }
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                                        />

                                        <input
                                            type="text"
                                            value={
                                                defaultAddress?.postalCode || ""
                                            }
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all"
                                    >
                                        Continue to Payment
                                    </button>

                                </motion.form>
                            )}

                            {/* ================= STEP 2 ================= */}

                            {step === 2 && (
                                <motion.div
                                    key="s2"
                                    initial={{
                                        opacity: 0,
                                        x: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: 20,
                                    }}
                                    className="bg-white rounded-3xl p-6 md:p-8 shadow-card"
                                >

                                    <div className="flex items-center gap-3 mb-6">
                                        <IoCardOutline
                                            size={24}
                                            className="text-brand"
                                        />

                                        <h2 className="font-heading text-xl font-bold">
                                            Payment Method
                                        </h2>
                                    </div>

                                    <div className="space-y-3 mb-6">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("upi")
                                            }
                                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${paymentMethod === "upi"
                                                ? "border-brand bg-brand/5"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold">
                                                    UPI
                                                </div>

                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-900">
                                                        UPI
                                                    </p>

                                                    <p className="text-xs text-muted">
                                                        Google Pay, PhonePe, Paytm & more
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "upi"
                                                    ? "border-brand"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {paymentMethod === "upi" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                                                )}
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("card")
                                            }
                                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${paymentMethod === "card"
                                                ? "border-brand bg-brand/5"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">

                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <IoCardOutline size={22} />
                                                </div>

                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-900">
                                                        Credit / Debit Card
                                                    </p>

                                                    <p className="text-xs text-muted">
                                                        Visa, Mastercard, RuPay & more
                                                    </p>
                                                </div>

                                            </div>

                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card"
                                                    ? "border-brand"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {paymentMethod === "card" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                                                )}
                                            </div>

                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("netbanking")
                                            }
                                            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${paymentMethod === "netbanking"
                                                ? "border-brand bg-brand/5"
                                                : "border-gray-200"
                                                }`}
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    🏦
                                                </div>

                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-900">
                                                        Net Banking
                                                    </p>

                                                    <p className="text-xs text-muted">
                                                        Pay using your bank account
                                                    </p>
                                                </div>

                                            </div>

                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "netbanking"
                                                    ? "border-brand"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                {paymentMethod === "netbanking" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                                                )}
                                            </div>

                                        </button>

                                    </div>

                                    <div className="p-5 bg-gray-50 rounded-xl mb-6">

                                        <div className="flex justify-between items-center">

                                            <span className="font-semibold text-gray-700">
                                                Amount Payable
                                            </span>

                                            <span className="font-heading font-bold text-2xl text-brand">
                                                ₹{finalTotal.toFixed(2)}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex gap-4">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setErrorMessage("");
                                                setStep(1);
                                            }}
                                            disabled={isProcessing}
                                            className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleRazorpayPayment}
                                            disabled={isProcessing}
                                            className="flex-1 py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Pay Now ₹{finalTotal.toFixed(2)}
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </motion.div>
                            )}

                            {/* ================= STEP 3 ================= */}

                            {step === 3 && (
                                <motion.form
                                    key="s3"
                                    initial={{
                                        opacity: 0,
                                        scale: 0.95,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    onSubmit={handlePlaceOrder}
                                    className="bg-white rounded-3xl p-6 md:p-8 shadow-card text-center"
                                >

                                    <h2 className="font-heading text-2xl font-bold mb-2">
                                        Review Your Order
                                    </h2>

                                    <p className="text-muted mb-8">
                                        Please confirm your details before placing the order.
                                    </p>

                                    <div className="text-left bg-gray-50 p-6 rounded-2xl mb-8">

                                        <h3 className="font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">
                                            Shipping To:
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-relaxed">

                                            {firstName} {lastName}

                                            <br />

                                            {defaultAddress
                                                ? `${defaultAddress.addressline || ""} ${defaultAddress.landmark || ""}`.trim()
                                                : ""
                                            }

                                            <br />

                                            {defaultAddress?.city || ""},
                                            {" "}
                                            {defaultAddress?.state || ""}
                                            {" "}
                                            {defaultAddress?.postalCode || ""}

                                        </p>

                                    </div>

                                    <div className="flex gap-4">

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setErrorMessage("");
                                                setStep(2);
                                            }}
                                            disabled={isProcessing}
                                            className="px-6 py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="flex-1 py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light transition-all flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                "Place Order"
                                            )}
                                        </button>

                                    </div>

                                </motion.form>
                            )}

                        </AnimatePresence>

                    </div>

                    {/* ================= ORDER SUMMARY ================= */}

                    <div className="lg:col-span-5">

                        <div className="sticky top-8 bg-white rounded-3xl p-6 md:p-8 shadow-card">

                            <h2 className="font-heading text-xl font-bold mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">

                                {items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}`}
                                        className="flex gap-4"
                                    >

                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />

                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                                                {item.quantity}
                                            </span>

                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                {item.name}
                                            </p>

                                            <p className="text-xs text-muted mt-0.5">
                                                {item.size} / {item.color}
                                            </p>

                                            <p className="text-sm font-bold text-accent mt-1">
                                                ₹{(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>

                                        </div>

                                    </div>
                                ))}

                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm mb-4">

                                <div className="flex justify-between">

                                    <span className="text-muted">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        ₹{subtotal.toFixed(2)}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-muted">
                                        Shipping
                                    </span>

                                    <span className="font-semibold">

                                        {shipping === 0
                                            ? "FREE"
                                            : `₹${shipping.toFixed(2)}`
                                        }

                                    </span>

                                </div>

                            </div>

                            {discount !== 0 && (
                                <div className="flex justify-between">

                                    <span className="text-muted">
                                        Discount
                                    </span>

                                    <span className="font-semibold text-green-600">
                                        -₹{discount.toFixed(2)}
                                    </span>

                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">

                                <span className="font-heading font-bold text-lg">
                                    Total
                                </span>

                                <span className="font-heading font-bold text-2xl text-brand">
                                    ₹{finalTotal.toFixed(2)}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;