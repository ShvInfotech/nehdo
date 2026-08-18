import React, { useEffect, useState } from "react";
import {
    IoSearchOutline,
    IoChevronBackOutline,
    IoPrintOutline,
    IoMailOutline,
    IoCheckmarkCircleOutline,
    IoCloseOutline
} from "react-icons/io5";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { apiRequest, userapiRequest } from "../../services/apiService";

interface OrderItem {
    productId: string;
    variantId: string | null;
    size: string;
    color: string;
    quantity: number;
    price: number;
    total: number;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}

interface Order {
    _id: string;
    orderNumber: string;
    userId: string;

    items: OrderItem[];

    shippingAddress: {
        addressline: string;
        landmark: string;
        city: string;
        state: string;
        postalCode: string;
    };

    subtotal: number;
    discount: number;
    shippingCharge: number;
    totalAmount: number;

    payment: {
        orderId: string;
        paymentId: string;
        method: string;
        status: string;
    };

    status:
    | "pending"
    | "accepted"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";

    user: {
        name: string;
        email: string;
        phone: string;
    };
}

const statusFlow = [
    "pending",
    "accepted",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered"
];

const statusLabels: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled"
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "delivered":
            return "bg-green-100 text-green-700";

        case "accepted":
        case "processing":
        case "shipped":
        case "out_for_delivery":
            return "bg-blue-100 text-blue-700";

        case "pending":
            return "bg-orange-100 text-orange-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [activeStatus, setActiveStatus] = useState("all");

    const [printModalData, setPrintModalData] = useState<Order[] | null>(null);


    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await apiRequest("/admin/api/v1/order/get", "GET");

            if (response?.success) {
                setOrders(response.orders || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    const toggleSelection = (_id: string) => {
        setSelectedIds(prev =>
            prev.includes(_id)
                ? prev.filter(x => x !== _id)
                : [...prev, _id]
        );
    };

    /*
     * Active tab પ્રમાણે orders
     */
    const filteredOrders = orders.filter(order => {
        if (activeStatus === "all") {
            return true;
        }

        return order.status === activeStatus;
    });

    /*
     * Select All - માત્ર current tab ના orders
     */
    const handleSelectAll = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.checked) {
            setSelectedIds(filteredOrders.map(order => order._id));
        } else {
            setSelectedIds([]);
        }
    };

    /*
     * Pending -> Accepted
     */
    const handleBulkAccept = async () => {
        if (selectedIds.length === 0) {
            alert("Please select pending orders.");
            return;
        }

        console.log("Selected pending order IDs:", selectedIds);
        const respons = await apiRequest('/admin/api/v1/order/accepte', 'POST', { orderIds: selectedIds })


        setSelectedIds([]);
        await fetchOrders();

        alert(
            `${selectedIds.length} orders accepted successfully!`
        );
    };

    /*
     * PRINT LABEL VIEW
     */
    if (printModalData) {
        return (
            <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto print:bg-white print:p-0">

                {/* =========================
                PRINT HEADER
            ========================== */}
                <div className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 print:hidden">

                    <div>
                        <h2 className="text-xl font-bold">
                            Print Shipping Labels
                        </h2>

                        <p className="text-sm text-gray-500">
                            {printModalData.length}{" "}
                            {printModalData.length === 1
                                ? "label"
                                : "labels"}{" "}
                            ready to print.
                        </p>
                    </div>

                    <div className="flex gap-2">

                        {/* PRINT */}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-brand text-white font-bold rounded-lg shadow hover:bg-brand-light flex items-center gap-2"
                        >
                            <IoPrintOutline size={20} />
                            Print Labels
                        </button>

                        {/* CLOSE */}
                        <button
                            type="button"
                            onClick={() => setPrintModalData(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>

                    </div>
                </div>

                {/* =========================
                LABEL CONTAINER
            ========================== */}
                <div className="p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:max-w-none print:space-y-0">

                    {printModalData.map((order) => {
                        console.log(order)
                        /*
                         * IMPORTANT:
                         * AWB random generate nahi karvu.
                         * Backend/Shiprocket mathi aavel trackingNumber use karvo.
                         */
                        const awb = String(order.trackingNumber || "").trim();



                        /*
                         * Total quantity
                         */
                        const totalQuantity = order.items.reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0
                        );

                        /*
                         * Payment
                         */
                        const paymentMethod =
                            order.payment?.method?.toLowerCase();

                        const paymentType =
                            paymentMethod === "cod"
                                ? "COD"
                                : "PREPAID";

                        /*
                         * QR value
                         *
                         * trackingUrl available hoy to trackingUrl.
                         * Nahi hoy to internal tracking URL.
                         */
                        const qrValue =
                            order.trackingUrl ||
                            (
                                awb
                                    ? `https://nehdo.com/track/${awb}`
                                    : `https://nehdo.com/order/${order.orderNumber}`
                            );

                        return (
                            <div
                                key={order._id}
                                className="
                                bg-white
                                mx-auto
                                w-[4in]
                                h-[6in]
                                p-2
                                print:w-[4in]
                                print:h-[6in]
                                print:page-break-after-always
                                print:p-2
                                box-border
                            "
                            >

                                {/* =========================
                                LABEL
                            ========================== */}
                                <div
                                    className="
                                    w-full
                                    h-full
                                    border-[2px]
                                    border-black
                                    flex
                                    flex-col
                                    font-sans
                                    text-black
                                    overflow-hidden
                                    relative
                                    box-border
                                "
                                >

                                    {/* =========================
                                    HEADER
                                ========================== */}
                                    <div className="flex border-b-[2px] border-black h-12">

                                        <div className="flex-1 flex flex-col justify-between">

                                            {/* Courier */}
                                            <div className="flex border-b-[2px] border-black px-1 py-0.5 items-end">

                                                <span className="font-bold text-lg leading-none mr-2">
                                                    STD
                                                </span>

                                                <span className="text-xs leading-none">
                                                    E-Kart Logistics
                                                </span>

                                            </div>

                                            {/* Order + Payment */}
                                            <div className="flex items-center">

                                                <span className="flex-1 px-1 text-sm font-medium truncate">
                                                    OD {order.orderNumber}
                                                </span>

                                                <span
                                                    className="
                                                    font-bold
                                                    text-sm
                                                    px-2
                                                    border-l-[2px]
                                                    border-black
                                                    text-indigo-900
                                                    leading-none
                                                    py-1
                                                    h-full
                                                    flex
                                                    items-center
                                                "
                                                >
                                                    {paymentType}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="w-8 border-l-[2px] border-black flex items-center justify-center font-bold">
                                            E
                                        </div>

                                    </div>

                                    {/* =========================
                                    AWB + BARCODE
                                ========================== */}
                                    <div className="flex flex-col items-center justify-center p-2 border-b-[2px] border-black min-h-[65px]">

                                        {awb ? (
                                            <>
                                                <Barcode
                                                    value={awb}
                                                    width={1.2}
                                                    height={35}
                                                    fontSize={10}
                                                    displayValue={true}
                                                />

                                                <p className="text-[9px] font-bold mt-1">
                                                    AWB: {awb}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-center">

                                                <p className="text-xs font-bold text-red-600">
                                                    AWB NOT ASSIGNED
                                                </p>

                                                <p className="text-[9px] text-gray-500">
                                                    Shipment is not ready for tracking
                                                </p>

                                            </div>
                                        )}

                                    </div>

                                    {/* =========================
                                    ADDRESS AREA
                                ========================== */}
                                    <div className="flex-1 flex flex-col min-w-0">

                                        {/* QR */}
                                        <div className="flex-1 flex items-center justify-center p-4">

                                            <QRCode
                                                value={qrValue}
                                                size={160}
                                                level="M"
                                            />

                                        </div>

                                        {/* Customer Address */}
                                        <div
                                            className="
                                            border-t-[2px]
                                            border-black
                                            p-1
                                            text-[11px]
                                            leading-tight
                                            h-[85px]
                                            overflow-hidden
                                        "
                                        >

                                            <span className="font-medium">
                                                Shipping/Customer address:
                                            </span>

                                            <br />

                                            <span>
                                                Name:
                                            </span>

                                            <span className="text-[13px] font-semibold">
                                                {" "}
                                                {order.user?.name || "Customer"}
                                            </span>

                                            <br />

                                            {order.shippingAddress?.addressline && (
                                                <>
                                                    {order.shippingAddress.addressline}
                                                    {","}
                                                </>
                                            )}

                                            {order.shippingAddress?.landmark && (
                                                <>
                                                    {" "}
                                                    {order.shippingAddress.landmark}
                                                    {","}
                                                </>
                                            )}

                                            <br />

                                            {order.shippingAddress?.city && (
                                                <>
                                                    {order.shippingAddress.city}
                                                </>
                                            )}

                                            {" - "}

                                            <span className="font-bold text-[13px]">
                                                {order.shippingAddress?.postalCode}
                                            </span>

                                            {order.shippingAddress?.state && (
                                                <>
                                                    {", "}
                                                    {order.shippingAddress.state}
                                                </>
                                            )}

                                            <br />

                                            {order.user?.phone && (
                                                <>
                                                    Phone: {order.user.phone}
                                                </>
                                            )}

                                        </div>

                                    </div>

                                    {/* =========================
                                    SOLD BY
                                ========================== */}
                                    <div
                                        className="
                                        border-t-[2px]
                                        border-black
                                        p-1
                                        text-[9px]
                                        leading-[1.1]
                                        h-[45px]
                                        overflow-hidden
                                    "
                                    >

                                        Sold By:

                                        <span className="font-bold">
                                            {" "}
                                            M/s NEHDO Retail Ventures,
                                        </span>

                                        {" "}
                                        PHOENIX MILLS COMPOUND, SENAPATI
                                        BAPAT MARG, LOWER PAREL, MUMBAI,
                                        MAHARASHTRA - 400013

                                        <br />

                                        <span className="text-indigo-900 border-b border-indigo-900 inline-block mt-0.5">
                                            GSTIN:
                                        </span>

                                        {" "}
                                        27AAIFU3374R1ZO

                                    </div>

                                    {/* =========================
                                    ITEMS
                                ========================== */}
                                    <div className="border-t-[2px] border-black flex flex-col min-h-[50px]">

                                        {/* Table Header */}
                                        <div className="flex border-b-[2px] border-black font-bold text-[10px] bg-gray-100">

                                            <div className="flex-1 px-1 border-r-[2px] border-black text-center">
                                                SKU ID | Description
                                            </div>

                                            <div className="w-10 px-1 border-r-[2px] border-black text-center">
                                                Qty
                                            </div>

                                            <div className="w-16 px-1 text-center">
                                                Amount
                                            </div>

                                        </div>

                                        {/* Items */}
                                        <div className="flex flex-col">

                                            {order.items.map((item) => (

                                                <div
                                                    key={item._id}
                                                    className="flex text-[9px] border-b border-black last:border-b-0"
                                                >

                                                    {/* SKU / Description */}
                                                    <div className="flex-1 px-1 border-r-[2px] border-black py-0.5">

                                                        <div className="font-semibold truncate">
                                                            {item.sku ||
                                                                item.productId}
                                                        </div>

                                                        <div className="text-[8px] text-gray-600">
                                                            {item.color &&
                                                                `Color: ${item.color}`}
                                                            {item.color &&
                                                                item.size &&
                                                                " | "}
                                                            {item.size &&
                                                                `Size: ${item.size}`}
                                                        </div>

                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="w-10 px-1 border-r-[2px] border-black text-center flex items-center justify-center">
                                                        {item.quantity}
                                                    </div>

                                                    {/* Amount */}
                                                    <div className="w-16 px-1 text-center flex items-center justify-center">
                                                        ₹
                                                        {Number(
                                                            item.total || 0
                                                        ).toFixed(2)}
                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                    {/* =========================
                                    FOOTER
                                ========================== */}
                                    <div
                                        className="
                                        border-t-[2px]
                                        border-black
                                        p-1
                                        text-[10px]
                                        flex
                                        justify-between
                                        items-center
                                    "
                                    >

                                        <div>
                                            <span>
                                                Order:{" "}
                                            </span>

                                            <span className="font-semibold">
                                                {order.orderNumber}
                                            </span>

                                            <span className="ml-3">
                                                Qty: {totalQuantity}
                                            </span>
                                        </div>

                                        <span className="font-bold">
                                            ₹
                                            {Number(
                                                order.totalAmount || 0
                                            ).toFixed(2)}
                                        </span>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        );
    }

    /*
     * ORDER DETAIL VIEW
     */
    if (selectedOrder) {
        return (
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <IoChevronBackOutline size={22} />
                        </button>

                        <div>
                            <h1 className="font-heading text-2xl font-bold text-gray-900">
                                Order {selectedOrder._id}
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Order details and tracking information.
                            </p>
                        </div>

                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={() =>
                                setPrintModalData([selectedOrder])
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-light shadow-sm"
                        >
                            <IoPrintOutline size={18} />
                            Print Label
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            <IoMailOutline size={18} />
                            Send Email
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Status */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Order Status
                            </h2>

                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">

                                {statusFlow.map((status, index) => {

                                    const currentIndex =
                                        statusFlow.indexOf(
                                            selectedOrder.status
                                        );

                                    const isPast =
                                        index < currentIndex;

                                    const isCurrent =
                                        status === selectedOrder.status;

                                    return (
                                        <React.Fragment key={status}>

                                            {index > 0 && (
                                                <div
                                                    className={`h-0.5 w-8 flex-shrink-0 ${index <= currentIndex
                                                        ? "bg-brand"
                                                        : "bg-gray-200"
                                                        }`}
                                                />
                                            )}

                                            <div
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${isCurrent
                                                    ? "bg-brand text-white"
                                                    : isPast
                                                        ? "bg-brand/10 text-brand"
                                                        : "bg-gray-100 text-gray-400"
                                                    }`}
                                            >

                                                {isPast && (
                                                    <IoCheckmarkCircleOutline
                                                        size={14}
                                                    />
                                                )}

                                                {statusLabels[status]}

                                            </div>
                                        </React.Fragment>
                                    );
                                })}

                                {selectedOrder.status === "cancelled" && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-red-100 text-red-700">
                                        <IoCloseOutline size={14} />
                                        Cancelled
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            <div className="p-6 border-b border-gray-100">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Order Items
                                </h2>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm">

                                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                                        <tr>

                                            <th className="px-6 py-3 text-left">
                                                Product
                                            </th>

                                            <th className="px-6 py-3 text-left">
                                                Variant
                                            </th>

                                            <th className="px-6 py-3 text-center">
                                                Qty
                                            </th>

                                            <th className="px-6 py-3 text-right">
                                                Unit Price
                                            </th>

                                            <th className="px-6 py-3 text-right">
                                                Total
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {selectedOrder.items.map((item) => (

                                            <tr key={item._id}>

                                                {/* Product */}
                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <span className="text-xs text-gray-400">
                                                                Product
                                                            </span>
                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-gray-900">
                                                                {item.productId}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                Product ID
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Variant */}
                                                <td className="px-6 py-4 text-gray-600">
                                                    {item.color} / {item.size}
                                                </td>

                                                {/* Quantity */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.quantity}
                                                </td>

                                                {/* Price */}
                                                <td className="px-6 py-4 text-right">
                                                    ₹{item.price.toFixed(2)}
                                                </td>

                                                {/* Total */}
                                                <td className="px-6 py-4 text-right font-semibold">
                                                    ₹{item.total.toFixed(2)}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        </div>

                        {/* Amount Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3">

                                {/* Subtotal */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium">
                                        ₹{selectedOrder.subtotal.toFixed(2)}
                                    </span>

                                </div>

                                {/* Discount */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span className="font-medium text-green-600">
                                        - ₹{selectedOrder.discount.toFixed(2)}
                                    </span>

                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span className="font-medium">
                                        ₹{selectedOrder.shippingCharge.toFixed(2)}
                                    </span>

                                </div>

                                {/* Total */}
                                <div className="border-t border-gray-100 pt-3 flex justify-between">

                                    <span className="font-bold">
                                        Total
                                    </span>

                                    <span className="font-bold text-lg text-brand">
                                        ₹{selectedOrder.totalAmount.toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Customer Details
                            </h2>

                            <div className="space-y-3">

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Name
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedOrder.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Email
                                    </p>

                                    <p className="text-sm font-medium text-brand">
                                        {selectedOrder.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Phone
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedOrder.phone}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Payment Info
                            </h2>

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Method
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {selectedOrder.payment?.method}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Payment Status
                                </p>

                                <span
                                    className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${selectedOrder.payment?.status === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {selectedOrder.payment?.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Order ID
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {selectedOrder.payment?.orderId}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                    Payment ID
                                </p>

                                <p className="text-sm font-medium text-gray-900">
                                    {selectedOrder.payment?.paymentId}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        );
    }

    /*
     * MAIN ORDERS LIST
     */
    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>

                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Orders
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track customer orders.
                    </p>

                </div>

                <div className="flex gap-2">

                    {selectedIds.length > 0 && (
                        <>
                            {/* Bulk Accept - Only Pending */}
                            {activeStatus === "pending" && (
                                <button
                                    onClick={handleBulkAccept}
                                    disabled={selectedIds.length === 0}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-700"
                                >
                                    Bulk Accept ({selectedIds.length})
                                </button>
                            )}

                            {/* Print Labels - All statuses except All & Pending */}
                            {activeStatus !== "all" && activeStatus !== "pending" && (
                                <button
                                    onClick={() =>
                                        setPrintModalData(
                                            orders.filter(order =>
                                                selectedIds.includes(order._id)
                                            )
                                        )
                                    }
                                    className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-light flex items-center gap-2"
                                >
                                    <IoPrintOutline size={16} />
                                    Print Labels
                                </button>
                            )}
                        </>
                    )}

                </div>
            </div>

            {/* Main Order Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* STATUS TABS */}
                <div className="flex gap-2 overflow-x-auto px-4 border-b border-gray-100">

                    {[
                        { value: "all", label: "All" },
                        { value: "pending", label: "Pending" },
                        { value: "accepted", label: "Accepted" },
                        { value: "processing", label: "Processing" },
                        { value: "shipped", label: "Shipped" },
                        {
                            value: "out_for_delivery",
                            label: "Out for Delivery"
                        },
                        {
                            value: "delivered",
                            label: "Delivered"
                        },
                        {
                            value: "cancelled",
                            label: "Cancelled"
                        }
                    ].map(tab => (

                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setActiveStatus(tab.value);
                                setSelectedIds([]);
                            }}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${activeStatus === tab.value
                                ? "border-brand text-brand"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search by order ID, customer..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />

                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-left">

                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                            <tr>

                                <th className="px-6 py-4">

                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredOrders.length > 0 &&
                                            selectedIds.length ===
                                            filteredOrders.length
                                        }
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                    />

                                </th>

                                <th className="px-6 py-4">
                                    Order ID
                                </th>

                                <th className="px-6 py-4">
                                    Customer
                                </th>

                                <th className="px-6 py-4">
                                    Date
                                </th>

                                <th className="px-6 py-4">
                                    Items
                                </th>

                                <th className="px-6 py-4">
                                    Amount
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredOrders.map(order => (

                                <tr
                                    key={order._id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => toggleSelection(order._id)}
                                >

                                    <td
                                        className="px-6 py-4"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(order._id)}
                                            onChange={() => toggleSelection(order._id)}
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                        />
                                    </td>

                                    {/* Order ID */}
                                    <td className="px-6 py-4 font-medium text-brand">
                                        {order.orderNumber}
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4">

                                        <p className="font-medium text-gray-900">
                                            {order.user?.name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {order.user?.email}
                                        </p>

                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-gray-500">
                                        {order.updatedAt
                                            ? new Date(order.updatedAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </td>

                                    {/* Items */}
                                    <td className="px-6 py-4 text-gray-600">
                                        {order.items.reduce(
                                            (total, item) => total + item.quantity,
                                            0
                                        )}
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ₹{order.totalAmount.toFixed(2)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {statusLabels[order.status] || order.status}
                                        </span>

                                    </td>

                                    {/* Actions */}
                                    <td
                                        className="px-6 py-4 text-right"
                                        onClick={e => e.stopPropagation()}
                                    >

                                        <button
                                            className="text-brand text-sm font-semibold hover:underline"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            ))}

                            {filteredOrders.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        No orders found for this status.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AdminOrders;