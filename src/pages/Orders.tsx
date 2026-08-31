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
    IoCloseOutline,
} from "react-icons/io5";

import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from "../services/apiService";
import { toast } from "react-toastify";

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

    deliveredAt?: string;

    createdAt: string;
    updatedAt: string;
}

interface OrdersResponse {
    success: boolean;
    message: string;
    orders: ApiOrder[];
}

interface BankDetails {
    holderName: string;
    accountNumber: string;
    ifscCode: string;
}

type ActionModalType = "cancel" | "return" | null;

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
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                            active === n.id
                                ? "bg-brand text-white shadow-button"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <n.icon size={20} />
                        {n.label}
                    </Link>
                ))}

                <div className="h-px bg-gray-100 my-2 mx-4" />
            </nav>
        </div>
    );
};

// =========================
// Helpers
// =========================

const formatDate = (date?: string) => {
    if (!date) return "";

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
    onOrderUpdated: () => void;
}

const OrderCard = ({
    order,
    onOrderUpdated,
}: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false);

    // Review
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        review: "",
    });

    // Order actions
    const [cancelLoading, setCancelLoading] = useState(false);
    const [returnLoading, setReturnLoading] = useState(false);

    // Action modal
    const [actionModal, setActionModal] =
        useState<ActionModalType>(null);

    const [reason, setReason] = useState("");

    const [bankDetails, setBankDetails] =
        useState<BankDetails>({
            holderName: "",
            accountNumber: "",
            ifscCode: "",
        });

    const displayStatus = getDisplayStatus(order.status);

    // =========================
    // Check COD + Paid
    // =========================

    const isCodPaid =
        order.payment?.method?.toLowerCase() === "cod" &&
        order.payment?.status?.toLowerCase() === "paid";

    // =========================
    // Open Cancel Modal
    // =========================

    const openCancelModal = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();

        setReason("");

        setBankDetails({
            holderName: "",
            accountNumber: "",
            ifscCode: "",
        });

        setActionModal("cancel");
    };

    // =========================
    // Open Return Modal
    // =========================

    const openReturnModal = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();

        setReason("");

        setBankDetails({
            holderName: "",
            accountNumber: "",
            ifscCode: "",
        });

        setActionModal("return");
    };

    // =========================
    // Close Modal
    // =========================

    const closeActionModal = () => {
        if (cancelLoading || returnLoading) return;

        setActionModal(null);
        setReason("");

        setBankDetails({
            holderName: "",
            accountNumber: "",
            ifscCode: "",
        });
    };

    // =========================
    // Submit Cancel
    // =========================

    const submitCancel = async () => {
        if (!reason) {
            toast.error("Please select a cancellation reason");
            return;
        }

        if (cancelLoading) return;

        try {
            setCancelLoading(true);

            const response = await userapiRequest(
                "/user/api/v1/orders/cancelle",
                "POST",
                {
                    orderId: order._id,
                    reason: reason,
                }
            );

            console.log("CANCEL RESPONSE:", response);

            if (response?.success === false) {
                throw new Error(
                    response?.message ||
                        "Failed to cancel order"
                );
            }

            toast.success(
                response?.message ||
                    "Order cancelled successfully"
            );

            closeActionModal();

            onOrderUpdated();
        } catch (error: any) {
            console.error(
                "CANCEL ORDER ERROR:",
                error
            );

            toast.error(
                error?.message ||
                    "Failed to cancel order"
            );
        } finally {
            setCancelLoading(false);
        }
    };

    // =========================
    // Submit Return
    // =========================

    const submitReturn = async () => {
        if (!reason) {
            toast.error("Please select a return reason");
            return;
        }

        // COD + Paid => Bank Details required
        if (isCodPaid) {
            if (!bankDetails.holderName.trim()) {
                toast.error(
                    "Please enter account holder name"
                );
                return;
            }

            if (!bankDetails.accountNumber.trim()) {
                toast.error(
                    "Please enter account number"
                );
                return;
            }

            if (!bankDetails.ifscCode.trim()) {
                toast.error(
                    "Please enter IFSC code"
                );
                return;
            }

            if (
                !/^[0-9]{6,20}$/.test(
                    bankDetails.accountNumber.trim()
                )
            ) {
                toast.error(
                    "Please enter a valid account number"
                );
                return;
            }

            if (
                !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                    bankDetails.ifscCode
                        .trim()
                        .toUpperCase()
                )
            ) {
                toast.error(
                    "Please enter a valid IFSC code"
                );
                return;
            }
        }

        if (returnLoading) return;

        try {
            setReturnLoading(true);

            const payload: {
                orderId: string;
                reason: string;
                bankDetails?: BankDetails;
            } = {
                orderId: order._id,
                reason: reason,
            };

            // Only send bank details for COD + Paid
            if (isCodPaid) {
                payload.bankDetails = {
                    holderName:
                        bankDetails.holderName.trim(),

                    accountNumber:
                        bankDetails.accountNumber.trim(),

                    ifscCode:
                        bankDetails.ifscCode
                            .trim()
                            .toUpperCase(),
                };
            }

            console.log(
                "RETURN PAYLOAD:",
                payload
            );

            const response = await userapiRequest(
                "/user/api/v1/orders/return",
                "POST",
                payload
            );

            console.log(
                "RETURN RESPONSE:",
                response
            );

            if (response?.success === false) {
                throw new Error(
                    response?.message ||
                        "Failed to submit return request"
                );
            }

            toast.success(
                response?.message ||
                    "Return request submitted successfully"
            );

            closeActionModal();

            onOrderUpdated();
        } catch (error: any) {
            console.error(
                "RETURN ORDER ERROR:",
                error
            );

            toast.error(
                error?.message ||
                    "Failed to submit return request"
            );
        } finally {
            setReturnLoading(false);
        }
    };

    // =========================
    // Submit Action
    // =========================

    const handleActionSubmit = async () => {
        if (actionModal === "cancel") {
            await submitCancel();
            return;
        }

        if (actionModal === "return") {
            await submitReturn();
            return;
        }
    };

    // =========================
    // Review Submit
    // =========================

    const handleReviewSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const payload = {
                orderId: order._id,

                productIds: [
                    ...new Set(
                        order.items.map(
                            (item) => item.productId
                        )
                    ),
                ],

                rating: reviewForm.rating,

                review: reviewForm.review,
            };

            await userapiRequest(
                "/user/api/v1/product/review/create",
                "POST",
                payload
            );

            setReviewSubmitted(true);

            toast.success(
                "Review submitted successfully"
            );
        } catch (error: any) {
            console.error(
                "REVIEW SUBMIT ERROR:",
                error
            );

            toast.error(
                error?.message ||
                    "Failed to submit review"
            );
        }
    };

    // =========================
    // Expand
    // =========================

    const handleExpand = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <>
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-card transition-shadow overflow-hidden mb-6">

                {/* =========================
                    Header
                ========================= */}

                <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/50">

                    <div className="flex flex-wrap gap-8">

                        {/* Date */}

                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Order Placed
                            </p>

                            <p className="font-semibold text-gray-900">
                                {formatDate(
                                    order.createdAt
                                )}
                            </p>
                        </div>

                        {/* Total */}

                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Total
                            </p>

                            <p className="font-semibold text-gray-900">
                                {formatPrice(
                                    order.totalAmount
                                )}
                            </p>
                        </div>

                        {/* Order Number */}

                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Order
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
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand();
                            }}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <IoChevronDown
                                size={20}
                                className={`transition-transform duration-300 ${
                                    expanded
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* =========================
                    Preview
                ========================= */}

                <div
                    className="p-6 md:p-8 cursor-pointer"
                    onClick={handleExpand}
                >
                    <h3 className="font-heading font-bold text-lg mb-4">

                        {displayStatus ===
                        "Delivered"
                            ? `Delivered on ${formatDate(
                                  order.deliveredAt
                              )}`
                            : displayStatus ===
                              "Cancelled"
                            ? "Order Cancelled"
                            : "Estimated delivery in 3-5 days"}

                    </h3>

                    <div className="flex gap-4 overflow-x-auto pb-2">

                        {order.items.map(
                            (item) => (
                                <div
                                    key={item._id}
                                    className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                                >
                                    <img
                                        src={
                                            item.image
                                        }
                                        alt={`Product ${
                                            item.sku ||
                                            ""
                                        }`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )
                        )}

                    </div>
                </div>

                {/* =========================
                    Expanded
                ========================= */}

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

                                    {order.items.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item._id
                                                }
                                                className="flex gap-4"
                                            >

                                                <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={`Product ${
                                                            item.sku ||
                                                            ""
                                                        }`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1">

                                                    <Link
                                                        to={`/product/${item.productId}`}
                                                        onClick={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="font-semibold hover:text-brand transition-colors"
                                                    >
                                                        {item.sku ||
                                                            "Product"}
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

                                                        Qty:{" "}
                                                        {
                                                            item.quantity
                                                        }

                                                    </p>

                                                    <p className="font-bold text-accent mt-1">
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>

                                                    {item.quantity >
                                                        1 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Item
                                                            total:{" "}
                                                            {formatPrice(
                                                                item.total
                                                            )}
                                                        </p>
                                                    )}

                                                </div>

                                                <div className="flex-shrink-0 hidden md:block">

                                                    <Link
                                                        to={`/product/${item.productId}`}
                                                        onClick={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:border-brand transition-colors"
                                                    >
                                                        Buy Again
                                                    </Link>

                                                </div>

                                            </div>
                                        )
                                    )}

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
                                                {
                                                    order
                                                        .shippingAddress
                                                        .addressline
                                                }
                                            </p>

                                            {order
                                                .shippingAddress
                                                .landmark && (
                                                <p>
                                                    {
                                                        order
                                                            .shippingAddress
                                                            .landmark
                                                    }
                                                </p>
                                            )}

                                            <p>
                                                {
                                                    order
                                                        .shippingAddress
                                                        .city
                                                }
                                                ,{" "}
                                                {
                                                    order
                                                        .shippingAddress
                                                        .state
                                                }
                                            </p>

                                            <p>
                                                {
                                                    order
                                                        .shippingAddress
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
                                                    Tracking
                                                    Number
                                                </p>

                                                <p className="font-semibold text-gray-900 mt-1">
                                                    {
                                                        order.trackingNumber
                                                    }
                                                </p>

                                                {order.trackingUrl && (
                                                    <a
                                                        href={
                                                            order.trackingUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(
                                                            e
                                                        ) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="inline-block mt-3 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:opacity-90"
                                                    >
                                                        Track
                                                        Order
                                                    </a>
                                                )}

                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-600">
                                                Tracking not
                                                available yet
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {/* Payment + Summary */}

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
                                                {
                                                    order
                                                        .payment
                                                        .method
                                                }
                                            </span>
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            Status:{" "}
                                            <span className="font-semibold text-green-600 capitalize">
                                                {
                                                    order
                                                        .payment
                                                        .status
                                                }
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
                                                    {formatPrice(
                                                        order.subtotal
                                                    )}
                                                </span>
                                            </div>

                                            {order.discount >
                                                0 && (
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

                                {/* =========================
                                    Action Buttons
                                ========================= */}

                                <div className="mt-8 pt-6 border-t border-gray-200">

                                    <div className="flex flex-wrap gap-3">

                                        {/* Cancel */}

                                        {displayStatus ===
                                            "Processing" && (
                                            <button
                                                type="button"
                                                onClick={
                                                    openCancelModal
                                                }
                                                disabled={
                                                    cancelLoading
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>

                                                Cancel
                                                Order
                                            </button>
                                        )}

                                        {/* Return */}

                                        {displayStatus ===
                                            "Delivered" && (
                                            <button
                                                type="button"
                                                onClick={
                                                    openReturnModal
                                                }
                                                disabled={
                                                    returnLoading
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition-all duration-200 hover:border-orange-300 hover:bg-orange-100 hover:text-orange-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 12a9 9 0 1 0 3-6.7"
                                                    />

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 4v6h6"
                                                    />
                                                </svg>

                                                Return
                                                Order
                                            </button>
                                        )}

                                    </div>

                                </div>

                                {/* Shiprocket IDs */}

                                {(order.shiprocketOrderId ||
                                    order.shiprocketShipmentId) && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">

                                        <h4 className="font-heading font-bold mb-3">
                                            Shipment
                                            Details
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

                                            {order.shiprocketOrderId && (
                                                <p className="text-gray-600">
                                                    Shiprocket
                                                    Order ID:{" "}
                                                    <span className="font-semibold text-gray-900">
                                                        {
                                                            order.shiprocketOrderId
                                                        }
                                                    </span>
                                                </p>
                                            )}

                                            {order.shiprocketShipmentId && (
                                                <p className="text-gray-600">
                                                    Shipment
                                                    ID:{" "}
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

                                {displayStatus ===
                                    "Delivered" && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">

                                        <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8">

                                            {reviewSubmitted ? (
                                                <div className="text-center py-8">

                                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">

                                                        <IoShieldCheckmarkOutline
                                                            size={
                                                                32
                                                            }
                                                        />

                                                    </div>

                                                    <h4 className="font-bold text-lg mb-2">
                                                        Review
                                                        Submitted!
                                                    </h4>

                                                    <p className="text-sm text-gray-500 mb-6">
                                                        Thank
                                                        you for
                                                        sharing
                                                        your
                                                        thoughts.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReviewSubmitted(
                                                                false
                                                            );

                                                            setReviewForm(
                                                                {
                                                                    rating: 5,
                                                                    review: "",
                                                                }
                                                            );
                                                        }}
                                                        className="text-brand font-semibold text-sm hover:underline"
                                                    >
                                                        Write
                                                        another
                                                        review
                                                    </button>

                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="font-heading font-bold text-xl mb-6">
                                                        Write
                                                        a Review
                                                    </h3>

                                                    <form
                                                        onSubmit={
                                                            handleReviewSubmit
                                                        }
                                                        className="space-y-5"
                                                    >

                                                        {/* Rating */}

                                                        <div>

                                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                                Rating
                                                            </label>

                                                            <div className="flex gap-1">

                                                                {[
                                                                    1,
                                                                    2,
                                                                    3,
                                                                    4,
                                                                    5,
                                                                ].map(
                                                                    (
                                                                        star
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                star
                                                                            }
                                                                            type="button"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();

                                                                                setReviewForm(
                                                                                    (
                                                                                        prev
                                                                                    ) => ({
                                                                                        ...prev,
                                                                                        rating: star,
                                                                                    })
                                                                                );
                                                                            }}
                                                                            className="p-1 hover:scale-110 transition-transform"
                                                                        >
                                                                            <IoStar
                                                                                size={
                                                                                    24
                                                                                }
                                                                                className={
                                                                                    star <=
                                                                                    reviewForm.rating
                                                                                        ? "text-gold"
                                                                                        : "text-gray-200"
                                                                                }
                                                                            />
                                                                        </button>
                                                                    )
                                                                )}

                                                            </div>

                                                        </div>

                                                        {/* Review */}

                                                        <div>

                                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                                Review
                                                            </label>

                                                            <textarea
                                                                required
                                                                rows={
                                                                    4
                                                                }
                                                                value={
                                                                    reviewForm.review
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();

                                                                    setReviewForm(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            review: e
                                                                                .target
                                                                                .value,
                                                                        })
                                                                    );
                                                                }}
                                                                onClick={(
                                                                    e
                                                                ) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand resize-none text-sm"
                                                                placeholder="What did you like or dislike?"
                                                            />

                                                        </div>

                                                        {/* Submit */}

                                                        <button
                                                            type="submit"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="w-full py-3.5 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light hover:shadow-button-hover transition-all text-sm"
                                                        >
                                                            Submit
                                                            Review
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

            {/* =====================================================
                CANCEL / RETURN MODAL
            ===================================================== */}

            <AnimatePresence>
                {actionModal && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
                        onClick={closeActionModal}
                    >
                        <motion.div
                            initial={{
                                scale: 0.95,
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                scale: 0.95,
                                opacity: 0,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* Modal Header */}

                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                                <div>
                                    <h3 className="font-heading text-xl font-bold text-gray-900">
                                        {actionModal ===
                                        "cancel"
                                            ? "Cancel Order"
                                            : "Return Order"}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Order #
                                        {
                                            order.orderNumber
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        closeActionModal
                                    }
                                    disabled={
                                        cancelLoading ||
                                        returnLoading
                                    }
                                    className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50"
                                >
                                    <IoCloseOutline
                                        size={22}
                                    />
                                </button>

                            </div>

                            {/* Modal Body */}

                            <div className="px-6 py-6">

                                <p className="text-sm text-gray-600">
                                    {actionModal ===
                                    "cancel"
                                        ? "Please select a reason for cancelling this order."
                                        : "Please select a reason for returning this order."}
                                </p>

                                {/* Reason */}

                                <div className="mt-5">

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        {actionModal ===
                                        "cancel"
                                            ? "Cancellation Reason"
                                            : "Return Reason"}
                                    </label>

                                    <select
                                        value={
                                            reason
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setReason(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                    >
                                        <option value="">
                                            Select reason
                                        </option>

                                        {actionModal ===
                                        "cancel" ? (
                                            <>
                                                <option value="changed_mind">
                                                    Changed
                                                    my
                                                    mind
                                                </option>

                                                <option value="ordered_by_mistake">
                                                    Ordered
                                                    by
                                                    mistake
                                                </option>

                                                <option value="found_better_price">
                                                    Found a
                                                    better
                                                    price
                                                </option>

                                                <option value="delivery_too_long">
                                                    Delivery
                                                    is
                                                    taking
                                                    too
                                                    long
                                                </option>

                                                <option value="other">
                                                    Other
                                                </option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="size_issue">
                                                    Size
                                                    issue
                                                </option>

                                                <option value="color_issue">
                                                    Color
                                                    issue
                                                </option>

                                                <option value="damaged">
                                                    Product
                                                    damaged
                                                </option>

                                                <option value="wrong_product">
                                                    Wrong
                                                    product
                                                    received
                                                </option>

                                                <option value="quality_issue">
                                                    Quality
                                                    issue
                                                </option>

                                                <option value="not_as_expected">
                                                    Not as
                                                    expected
                                                </option>

                                                <option value="other">
                                                    Other
                                                </option>
                                            </>
                                        )}
                                    </select>

                                </div>

                                {/* =================================================
                                    COD + PAID BANK DETAILS
                                ================================================= */}

                                {actionModal ===
                                    "return" &&
                                    isCodPaid && (
                                        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                                            <h4 className="font-heading font-bold text-gray-900">
                                                Refund Bank
                                                Details
                                            </h4>

                                            <p className="mt-1 text-xs leading-5 text-gray-600">
                                                Your COD
                                                payment is
                                                marked as
                                                paid. Please
                                                provide bank
                                                details for
                                                the refund.
                                            </p>

                                            <div className="mt-4 space-y-3">

                                                {/* Holder Name */}

                                                <div>

                                                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                                        Account
                                                        Holder
                                                        Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        placeholder="Enter account holder name"
                                                        value={
                                                            bankDetails.holderName
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setBankDetails(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    holderName:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />

                                                </div>

                                                {/* Account Number */}

                                                <div>

                                                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                                        Account
                                                        Number
                                                    </label>

                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="Enter account number"
                                                        value={
                                                            bankDetails.accountNumber
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setBankDetails(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    accountNumber:
                                                                        e
                                                                            .target
                                                                            .value
                                                                            .replace(
                                                                                /\D/g,
                                                                                ""
                                                                            ),
                                                                })
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand focus:outline-none"
                                                    />

                                                </div>

                                                {/* IFSC */}

                                                <div>

                                                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                                        IFSC
                                                        Code
                                                    </label>

                                                    <input
                                                        type="text"
                                                        maxLength={
                                                            11
                                                        }
                                                        placeholder="e.g. HDFC0001234"
                                                        value={
                                                            bankDetails.ifscCode
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setBankDetails(
                                                                (
                                                                    prev
                                                                ) => ({
                                                                    ...prev,
                                                                    ifscCode:
                                                                        e
                                                                            .target
                                                                            .value
                                                                            .toUpperCase(),
                                                                })
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm uppercase focus:border-brand focus:outline-none"
                                                    />

                                                </div>

                                            </div>

                                        </div>
                                    )}

                                {/* Payment Information */}

                                {actionModal ===
                                    "return" && (
                                    <div className="mt-4 rounded-xl bg-gray-50 p-4">

                                        <div className="flex justify-between text-sm">

                                            <span className="text-gray-500">
                                                Payment
                                                Method
                                            </span>

                                            <span className="font-semibold uppercase text-gray-900">
                                                {
                                                    order
                                                        .payment
                                                        .method
                                                }
                                            </span>

                                        </div>

                                        <div className="flex justify-between text-sm mt-2">

                                            <span className="text-gray-500">
                                                Payment
                                                Status
                                            </span>

                                            <span className="font-semibold capitalize text-gray-900">
                                                {
                                                    order
                                                        .payment
                                                        .status
                                                }
                                            </span>

                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* Modal Footer */}

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 px-6 py-5">

                                <button
                                    type="button"
                                    onClick={
                                        closeActionModal
                                    }
                                    disabled={
                                        cancelLoading ||
                                        returnLoading
                                    }
                                    className="w-full sm:w-auto rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleActionSubmit
                                    }
                                    disabled={
                                        !reason ||
                                        cancelLoading ||
                                        returnLoading ||
                                        (actionModal ===
                                            "return" &&
                                            isCodPaid &&
                                            (!bankDetails.holderName.trim() ||
                                                !bankDetails.accountNumber.trim() ||
                                                !bankDetails.ifscCode.trim()))
                                    }
                                    className={`w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                        actionModal ===
                                        "cancel"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                                >
                                    {actionModal ===
                                    "cancel"
                                        ? cancelLoading
                                            ? "Cancelling..."
                                            : "Confirm Cancellation"
                                        : returnLoading
                                            ? "Submitting..."
                                            : "Confirm Return"}
                                </button>

                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// =========================
// Orders Page
// =========================

const Orders = () => {
    const [orders, setOrders] =
        useState<ApiOrder[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeTab, setActiveTab] =
        useState("All Orders");

    // =========================
    // Fetch Orders
    // =========================

    const fetchOrders = async () => {
        try {
            setLoading(true);

            setError("");

            const response: OrdersResponse =
                await userapiRequest(
                    "/user/api/v1/orders/get",
                    "GET"
                );

            if (response.success) {
                setOrders(
                    response.orders || []
                );
            } else {
                toast.error(
                    response.message
                );

                throw new Error(
                    response.message ||
                        "Failed to fetch orders"
                );
            }
        } catch (err) {
            console.error(
                "FETCH ORDERS ERROR:",
                err
            );

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
                getDisplayStatus(
                    order.status
                ) === activeTab
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

                    <SidebarNav
                        active="orders"
                    />

                </div>

                {/* Main */}

                <div className="lg:col-span-3">

                    <div className="flex items-center justify-between gap-4 mb-8">

                        <h1 className="font-heading text-2xl md:text-3xl font-bold">
                            Order History
                        </h1>

                        {!loading &&
                            orders.length >
                                0 && (
                                <span className="text-sm text-gray-500">
                                    {
                                        orders.length
                                    }{" "}
                                    {orders.length ===
                                    1
                                        ? "Order"
                                        : "Orders"}
                                </span>
                            )}

                    </div>

                    {/* Tabs */}

                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">

                        {tabs.map(
                            (tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab
                                        )
                                    }
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                        activeTab ===
                                        tab
                                            ? "bg-gray-900 text-white"
                                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                                    }`}
                                >
                                    {tab}
                                </button>
                            )
                        )}

                    </div>

                    {/* Loading */}

                    {loading && (
                        <div className="space-y-6 mt-6">

                            {[1, 2].map(
                                (item) => (
                                    <div
                                        key={
                                            item
                                        }
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

                                            {[1, 2, 3].map(
                                                (
                                                    image
                                                ) => (
                                                    <div
                                                        key={
                                                            image
                                                        }
                                                        className="w-20 h-24 bg-gray-200 rounded-xl"
                                                    />
                                                )
                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                    {/* Error */}

                    {!loading &&
                        error && (
                            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">

                                <p className="text-red-600 font-semibold mb-4">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        fetchOrders
                                    }
                                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                    {/* No Orders */}

                    {!loading &&
                        !error &&
                        filteredOrders.length ===
                            0 && (
                            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">

                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">

                                    <IoBagHandleOutline
                                        size={30}
                                        className="text-gray-400"
                                    />

                                </div>

                                <h3 className="font-heading font-bold text-lg text-gray-900">

                                    {activeTab ===
                                    "All Orders"
                                        ? "No Orders Yet"
                                        : `No ${activeTab} Orders`}

                                </h3>

                                <p className="text-sm text-gray-500 mt-2">

                                    {activeTab ===
                                    "All Orders"
                                        ? "You haven't placed any orders yet."
                                        : "There are no orders in this category."}

                                </p>

                                {activeTab ===
                                    "All Orders" && (
                                    <Link
                                        to="/shop"
                                        className="inline-block mt-5 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold"
                                    >
                                        Continue
                                        Shopping
                                    </Link>
                                )}

                            </div>
                        )}

                    {/* Orders */}

                    {!loading &&
                        !error &&
                        filteredOrders.length >
                            0 && (
                            <div className="mt-6">

                                {filteredOrders.map(
                                    (order) => (
                                        <OrderCard
                                            key={
                                                order._id
                                            }
                                            order={
                                                order
                                            }
                                            onOrderUpdated={
                                                fetchOrders
                                            }
                                        />
                                    )
                                )}

                            </div>
                        )}

                </div>

            </div>
        </div>
    );
};

export default Orders;