import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoPersonOutline,
    IoBagHandleOutline,
    IoHeartOutline,
    IoChevronDown,
    IoLocationOutline,
    IoCubeOutline,
    IoCardOutline,
    IoStar,
    IoShieldCheckmarkOutline,
} from "react-icons/io5";

import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from "../services/apiService";



// =========================
// Types
// =========================

interface ShippingAddress {
    addressline: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: string;
}

interface Payment {
    orderId: string;
    paymentId: string;
    method: string;
    status: string;
}

interface OrderItem {
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    productId: string;
    variantId?: string;
    sku?: string;
    size?: string;
    color?: string;
    HSCode?: string;
    quantity: number;
    image: string;
    price: number;
    total: number;
    weight?: number;
    _id: string;
}

interface ApiOrder {
    shippingAddress: ShippingAddress;
    payment: Payment;

    _id: string;
    orderNumber: string;
    userId: string;

    items: OrderItem[];

    subtotal: number;
    discount: number;
    couponId: string | null;
    shippingCharge: number;
    totalAmount: number;

    status: string;

    shiprocketOrderId?: string;
    shiprocketShipmentId?: string;
    trackingNumber?: string | null;
    trackingUrl?: string | null;

    createdAt: string;
    updatedAt: string;
}

interface OrdersResponse {
    success: boolean;
    message: string;
    orders: ApiOrder[];
}

// =========================
// Sidebar
// =========================

const SidebarNav = ({ active }: { active: string }) => {
    const navs = [
        {
            id: "profile",
            label: "My Profile",
            icon: IoPersonOutline,
            href: "/account",
        },
        {
            id: "orders",
            label: "My Orders",
            icon: IoBagHandleOutline,
            href: "/orders",
        },
        {
            id: "wishlist",
            label: "Wishlist",
            icon: IoHeartOutline,
            href: "/wishlist",
        },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100">
            <nav className="flex flex-col gap-2">
                {navs.map((n) => (
                    <Link
                        key={n.id}
                        to={n.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active === n.id
                            ? "bg-brand text-white shadow-button"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <n.icon size={20} />
                        {n.label}
                    </Link>
                ))}

                <div className="h-px bg-gray-100 my-2 mx-4" />

                {/* <button
                    type="button"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
                >
                    <IoLogOutOutline size={20} />
                    Logout
                </button> */}
            </nav>
        </div>
    );
};

// =========================
// Helpers
// =========================

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatPrice = (price: number) => {
    return `₹${Number(price || 0).toFixed(2)}`;
};

const getDisplayStatus = (status: string) => {
    switch (status) {
        case "pending":
            return "Processing";

        case "accepted":
            return "Processing";

        case "processing":
            return "Processing";

        case "shipped":
            return "Shipped";

        case "out_for_delivery":
            return "Out for Delivery";

        case "delivered":
            return "Delivered";

        case "cancelled":
            return "Cancelled";

        default:
            return "Processing";
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Processing":
            return "bg-blue-100 text-blue-700";

        case "Shipped":
            return "bg-amber-100 text-amber-700";

        case "Out for Delivery":
            return "bg-purple-100 text-purple-700";

        case "Delivered":
            return "bg-green-100 text-green-700";

        case "Cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};

// =========================
// Order Card
// =========================

interface OrderCardProps {
    order: ApiOrder;
}

const OrderCard = ({ order }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        review: "",
    });

    const handleReviewSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const payload = {
                orderId:order._id,
               productIds: [...new Set(order.items.map((item) => item.productId))],
                rating: reviewForm.rating,
                review: reviewForm.review,
            };

           
             const respons = await userapiRequest('/user/api/v1/product/review/create',"POST",payload)

            setReviewSubmitted(true);
        } catch (error) {
            console.error("REVIEW SUBMIT ERROR:", error);
        }
    };
    const displayStatus = getDisplayStatus(order.status);

    const handleExpand = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-card transition-shadow overflow-hidden mb-6">
            {/* Header */}
            <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/50">
                <div className="flex flex-wrap gap-8">
                    {/* Date */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Order Placed
                        </p>

                        <p className="font-semibold text-gray-900">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>

                    {/* Total */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Total
                        </p>

                        <p className="font-semibold text-gray-900">
                            {formatPrice(order.totalAmount)}
                        </p>
                    </div>

                    {/* Order Number */}
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Order #
                        </p>

                        <p className="font-semibold text-brand">
                            {order.orderNumber}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                            displayStatus
                        )}`}
                    >
                        {displayStatus}
                    </span>

                    <button
                        type="button"
                        onClick={handleExpand}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <IoChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div
                className="p-6 md:p-8 cursor-pointer"
                onClick={handleExpand}
            >
                <h3 className="font-heading font-bold text-lg mb-4">
                    {displayStatus === "Delivered"
                        ? `Delivered on ${formatDate(order.updatedAt)}`
                        : displayStatus === "Cancelled"
                            ? "Order Cancelled"
                            : "Estimated delivery in 3-5 days"}
                </h3>

                <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.items.map((item) => (
                        <div
                            key={item._id}
                            className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                        >
                            <img
                                src={item.image}
                                alt={`Product ${item.sku || ""}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        className="overflow-hidden border-t border-gray-100"
                    >
                        <div className="p-6 md:p-8 bg-gray-50/30">
                            {/* Items */}
                            <h4 className="font-heading font-bold mb-4">
                                Items
                            </h4>

                            <div className="space-y-4 mb-8">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex gap-4"
                                    >
                                        {/* Image */}
                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={`Product ${item.sku || ""}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <Link
                                                to={`/product/${item.productId}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="font-semibold hover:text-brand transition-colors"
                                            >
                                                {item.sku || "Product"}
                                            </Link>

                                            <p className="text-xs text-muted mt-1">
                                                {item.size &&
                                                    `Size: ${item.size}`}
                                                {item.size &&
                                                    item.color &&
                                                    " | "}
                                                {item.color &&
                                                    `Color: ${item.color}`}
                                                {" | "}
                                                Qty: {item.quantity}
                                            </p>

                                            <p className="font-bold text-accent mt-1">
                                                {formatPrice(item.price)}
                                            </p>

                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Item total:{" "}
                                                    {formatPrice(item.total)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Buy Again */}
                                        <div className="flex-shrink-0 hidden md:block">
                                            <Link
                                                to={`/product/${item.productId}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:border-brand transition-colors"
                                            >
                                                Buy Again
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                                {/* Shipping Address */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <IoLocationOutline
                                            size={20}
                                            className="text-brand"
                                        />

                                        <h4 className="font-heading font-bold">
                                            Shipping Address
                                        </h4>
                                    </div>

                                    <div className="text-sm text-gray-600 leading-6">
                                        <p>
                                            {order.shippingAddress.addressline}
                                        </p>

                                        {order.shippingAddress.landmark && (
                                            <p>
                                                {
                                                    order.shippingAddress
                                                        .landmark
                                                }
                                            </p>
                                        )}

                                        <p>
                                            {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.state}
                                        </p>

                                        <p>
                                            {
                                                order.shippingAddress
                                                    .postalCode
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Tracking */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <IoCubeOutline
                                            size={20}
                                            className="text-brand"
                                        />

                                        <h4 className="font-heading font-bold">
                                            Tracking
                                        </h4>
                                    </div>

                                    {order.trackingNumber ? (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Tracking Number
                                            </p>

                                            <p className="font-semibold text-gray-900 mt-1">
                                                {order.trackingNumber}
                                            </p>

                                            {order.trackingUrl && (
                                                <a
                                                    href={order.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="inline-block mt-3 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:opacity-90"
                                                >
                                                    Track Order
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            Tracking not available yet
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Payment + Price Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-200">
                                {/* Payment */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <IoCardOutline
                                            size={20}
                                            className="text-brand"
                                        />

                                        <h4 className="font-heading font-bold">
                                            Payment
                                        </h4>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        Method:{" "}
                                        <span className="font-semibold text-gray-900">
                                            {order.payment.method}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        Status:{" "}
                                        <span className="font-semibold text-green-600 capitalize">
                                            {order.payment.status}
                                        </span>
                                    </p>
                                </div>

                                {/* Summary */}
                                <div>
                                    <h4 className="font-heading font-bold mb-3">
                                        Order Summary
                                    </h4>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Subtotal
                                            </span>

                                            <span className="font-medium">
                                                {formatPrice(order.subtotal)}
                                            </span>
                                        </div>

                                        {order.discount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Discount
                                                </span>

                                                <span className="font-medium text-green-600">
                                                    -{" "}
                                                    {formatPrice(
                                                        order.discount
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Shipping
                                            </span>

                                            <span className="font-medium">
                                                {formatPrice(
                                                    order.shippingCharge
                                                )}
                                            </span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                                            <span className="font-bold">
                                                Total
                                            </span>

                                            <span className="font-bold text-brand">
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shiprocket IDs */}
                            {(order.shiprocketOrderId ||
                                order.shiprocketShipmentId) && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h4 className="font-heading font-bold mb-3">
                                            Shipment Details
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            {order.shiprocketOrderId && (
                                                <p className="text-gray-600">
                                                    Shiprocket Order ID:{" "}
                                                    <span className="font-semibold text-gray-900">
                                                        {order.shiprocketOrderId}
                                                    </span>
                                                </p>
                                            )}

                                            {order.shiprocketShipmentId && (
                                                <p className="text-gray-600">
                                                    Shipment ID:{" "}
                                                    <span className="font-semibold text-gray-900">
                                                        {
                                                            order.shiprocketShipmentId
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Review */}
                            {displayStatus === "Delivered" && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8">
                                        {reviewSubmitted ? (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <IoShieldCheckmarkOutline size={32} />
                                                </div>

                                                <h4 className="font-bold text-lg mb-2">
                                                    Review Submitted!
                                                </h4>

                                                <p className="text-sm text-gray-500 mb-6">
                                                    Thank you for sharing your thoughts.
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReviewSubmitted(false);
                                                        setReviewForm({
                                                            rating: 5,
                                                            review: "",
                                                        });
                                                    }}
                                                    className="text-brand font-semibold text-sm hover:underline"
                                                >
                                                    Write another review
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="font-heading font-bold text-xl mb-6">
                                                    Write a Review
                                                </h3>

                                                <form
                                                    onSubmit={handleReviewSubmit}
                                                    className="space-y-5"
                                                >
                                                    {/* Rating */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                            Rating
                                                        </label>

                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();

                                                                        setReviewForm((prev) => ({
                                                                            ...prev,
                                                                            rating: star,
                                                                        }));
                                                                    }}
                                                                    className="p-1 hover:scale-110 transition-transform"
                                                                >
                                                                    <IoStar
                                                                        size={24}
                                                                        className={
                                                                            star <= reviewForm.rating
                                                                                ? "text-gold"
                                                                                : "text-gray-200"
                                                                        }
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Review */}
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                            Review
                                                        </label>

                                                        <textarea
                                                            required
                                                            rows={4}
                                                            value={reviewForm.review}
                                                            onChange={(e) => {
                                                                e.stopPropagation();

                                                                setReviewForm((prev) => ({
                                                                    ...prev,
                                                                    review: e.target.value,
                                                                }));
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand resize-none text-sm"
                                                            placeholder="What did you like or dislike?"
                                                        />
                                                    </div>

                                                    {/* Submit */}
                                                    <button
                                                        type="submit"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-full py-3.5 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light hover:shadow-button-hover transition-all text-sm"
                                                    >
                                                        Submit Review
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// =========================
// Orders Page
// =========================

const Orders = () => {
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("All Orders");

    // =========================
    // Fetch Orders
    // =========================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("accessToken");

            const response = await userapiRequest('/user/api/v1/orders/get', "GET")
            if (response.success) {
                setOrders(response.orders || []);
            } else {
                throw new Error(
                    response.message || "Failed to fetch orders"
                );
            }
        } catch (err) {
            console.error("FETCH ORDERS ERROR:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while fetching orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // =========================
    // Filter Orders
    // =========================

    const filteredOrders = useMemo(() => {
        if (activeTab === "All Orders") {
            return orders;
        }

        return orders.filter(
            (order) =>
                getDisplayStatus(order.status) === activeTab
        );
    }, [orders, activeTab]);

    // =========================
    // Tabs
    // =========================

    const tabs = [
        "All Orders",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ];

    // =========================
    // UI
    // =========================

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        {
                            label: "Account",
                            href: "/account",
                        },
                        {
                            label: "Orders",
                        },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <SidebarNav active="orders" />
                </div>

                {/* Main */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <h1 className="font-heading text-2xl md:text-3xl font-bold">
                            Order History
                        </h1>

                        {!loading && orders.length > 0 && (
                            <span className="text-sm text-gray-500">
                                {orders.length}{" "}
                                {orders.length === 1
                                    ? "Order"
                                    : "Orders"}
                            </span>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab
                                    ? "bg-gray-900 text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-6 mt-6">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="bg-white border border-gray-100 rounded-3xl p-8 animate-pulse"
                                >
                                    <div className="flex justify-between gap-4">
                                        <div className="space-y-3">
                                            <div className="h-3 w-24 bg-gray-200 rounded" />
                                            <div className="h-5 w-40 bg-gray-200 rounded" />
                                        </div>

                                        <div className="h-8 w-24 bg-gray-200 rounded-full" />
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        {[1, 2, 3].map((image) => (
                                            <div
                                                key={image}
                                                className="w-20 h-24 bg-gray-200 rounded-xl"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
                            <p className="text-red-600 font-semibold mb-4">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchOrders}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* No Orders */}
                    {!loading &&
                        !error &&
                        filteredOrders.length === 0 && (
                            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <IoBagHandleOutline
                                        size={30}
                                        className="text-gray-400"
                                    />
                                </div>

                                <h3 className="font-heading font-bold text-lg text-gray-900">
                                    {activeTab === "All Orders"
                                        ? "No Orders Yet"
                                        : `No ${activeTab} Orders`}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                    {activeTab === "All Orders"
                                        ? "You haven't placed any orders yet."
                                        : "There are no orders in this category."}
                                </p>

                                {activeTab === "All Orders" && (
                                    <Link
                                        to="/shop"
                                        className="inline-block mt-5 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold"
                                    >
                                        Continue Shopping
                                    </Link>
                                )}
                            </div>
                        )}

                    {/* Orders */}
                    {!loading &&
                        !error &&
                        filteredOrders.length > 0 && (
                            <div className="mt-6">
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order._id}
                                        order={order}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Orders;