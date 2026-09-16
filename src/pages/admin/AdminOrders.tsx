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
import { apiRequest } from "../../services/apiService";

interface OrderItem {
    _id?: string;
    productId: string;
    variantId: string | null;
    sku?: string;
    name?: string;
    image?: string;
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
    shiprocketOrderId?: string | null;
    shiprocketShipmentId?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    updatedAt?: string;
    createdAt?: string;
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

    // ============================
    // SEARCH STATE
    // ============================
    const [searchTerm, setSearchTerm] = useState("");

    // ============================
    // PAGINATION STATE
    // ============================
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 25;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await apiRequest(
                "/admin/api/v1/order/get",
                "GET"
            );

            if (response?.success) {
                setOrders(response.orders || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    const toggleSelection = (_id: string) => {
        setSelectedIds((prev) =>
            prev.includes(_id)
                ? prev.filter((x) => x !== _id)
                : [...prev, _id]
        );
    };

    // =====================================================
    // FILTER + SEARCH
    // =====================================================
    const filteredOrders = orders.filter((order) => {
        // -----------------------------
        // STATUS FILTER
        // -----------------------------
        const matchesStatus =
            activeStatus === "all" ||
            order.status === activeStatus;

        if (!matchesStatus) {
            return false;
        }

        // -----------------------------
        // SEARCH FILTER
        // -----------------------------
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return true;
        }

        const orderNumber =
            order.orderNumber?.toLowerCase() || "";

        const customerName =
            order.user?.name?.toLowerCase() || "";

        const customerEmail =
            order.user?.email?.toLowerCase() || "";

        const customerPhone =
            order.user?.phone?.toLowerCase() || "";

        const orderId =
            order._id?.toLowerCase() || "";

        const trackingNumber =
            order.trackingNumber?.toLowerCase() || "";

        const shipmentId =
            order.shiprocketShipmentId?.toLowerCase() || "";

        // Product SKU / Name search
        const productMatch = order.items?.some((item) => {
            const sku =
                item.sku?.toLowerCase() || "";

            const productName =
                item.name?.toLowerCase() || "";

            const productId =
                item.productId?.toLowerCase() || "";

            const color =
                item.color?.toLowerCase() || "";

            const size =
                item.size?.toLowerCase() || "";

            return (
                sku.includes(search) ||
                productName.includes(search) ||
                productId.includes(search) ||
                color.includes(search) ||
                size.includes(search)
            );
        });

        return (
            orderNumber.includes(search) ||
            customerName.includes(search) ||
            customerEmail.includes(search) ||
            customerPhone.includes(search) ||
            orderId.includes(search) ||
            trackingNumber.includes(search) ||
            shipmentId.includes(search) ||
            productMatch
        );
    });

    // =====================================================
    // RESET PAGINATION
    // =====================================================
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeStatus]);

    // =====================================================
    // PAGINATION
    // =====================================================
    const totalPages = Math.ceil(
        filteredOrders.length / rowsPerPage
    );

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // =====================================================
    // SELECT ALL
    // =====================================================
    const handleSelectAll = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.checked) {
            setSelectedIds(
                filteredOrders.map((order) => order._id)
            );
        } else {
            setSelectedIds([]);
        }
    };

    // =====================================================
    // BULK ACCEPT
    // =====================================================
    const handleBulkAccept = async () => {
        if (selectedIds.length === 0) {
            alert("Please select pending orders.");
            return;
        }

        try {
            const response = await apiRequest(
                "/admin/api/v1/order/accepte",
                "POST",
                {
                    orderIds: selectedIds
                }
            );

            if (response?.success) {
                const count = selectedIds.length;

                setSelectedIds([]);

                await fetchOrders();

                alert(
                    `${count} orders accepted successfully!`
                );
            } else {
                alert(
                    response?.message ||
                    "Failed to accept orders."
                );
            }
        } catch (error) {
            console.error(error);
            alert(
                "Something went wrong while accepting orders."
            );
        }
    };

    // =====================================================
    // PRINT LABEL
    // =====================================================
    const handalPrintlabel = async (ordersData: Order[]) => {
        console.log(selectedIds);

        const acceptedOrder = ordersData.filter((order) =>
            selectedIds.includes(order._id)
        );

        console.log(
            "Selected Orders:",
            acceptedOrder
        );

        const shipmentIds = acceptedOrder
            .map((order) => order.shiprocketShipmentId)
            .filter(Boolean);

        if (!shipmentIds.length) {
            alert(
                "Pending order has no generated label."
            );
            return;
        }

        try {
            const response = await apiRequest(
                "/admin/api/v1/order/label",
                "POST",
                { shipmentIds }
            );

            console.log(
                "Label Response:",
                response
            );

            if (
                response?.success &&
                response?.label_url
            ) {
                setSelectedIds([]);

                await fetchOrders();

                const link =
                    document.createElement("a");

                link.href = response.label_url;
                link.target = "_blank";
                link.rel =
                    "noopener noreferrer";

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
            } else {
                setSelectedIds([]);

                alert(
                    response?.message ||
                    "Unable to generate shipping label."
                );
            }
        } catch (error) {
            console.log(error);

            alert(
                "Something went wrong while generating label."
            );
        }
    };

    // =====================================================
    // PRINT LABEL VIEW
    // =====================================================
    if (printModalData) {
        return (
            <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto print:bg-white print:p-0">
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
                        <button
                            type="button"
                            onClick={() =>
                                window.print()
                            }
                            className="px-6 py-2 bg-brand text-white font-bold rounded-lg shadow hover:bg-brand-light flex items-center gap-2"
                        >
                            <IoPrintOutline size={20} />
                            Print Labels
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setPrintModalData(null)
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:max-w-none print:space-y-0">
                    {printModalData.map((order) => {
                        const awb = String(
                            order.trackingNumber || ""
                        ).trim();

                        const totalQuantity =
                            order.items.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(
                                        item.quantity || 0
                                    ),
                                0
                            );

                        const paymentMethod =
                            order.payment?.method?.toLowerCase();

                        const paymentType =
                            paymentMethod === "cod"
                                ? "COD"
                                : "PREPAID";

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
                                className="bg-white mx-auto w-[4in] h-[6in] p-2 print:w-[4in] print:h-[6in] print:page-break-after-always print:p-2 box-border"
                            >
                                <div className="w-full h-full border-[2px] border-black flex flex-col font-sans text-black overflow-hidden relative box-border">
                                    {/* HEADER */}
                                    <div className="flex border-b-[2px] border-black h-12">
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex border-b-[2px] border-black px-1 py-0.5 items-end">
                                                <span className="font-bold text-lg leading-none mr-2">
                                                    STD
                                                </span>

                                                <span className="text-xs leading-none">
                                                    E-Kart Logistics
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="flex-1 px-1 text-sm font-medium truncate">
                                                    OD{" "}
                                                    {
                                                        order.orderNumber
                                                    }
                                                </span>

                                                <span className="font-bold text-sm px-2 border-l-[2px] border-black text-indigo-900 leading-none py-1 h-full flex items-center">
                                                    {paymentType}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-8 border-l-[2px] border-black flex items-center justify-center font-bold">
                                            E
                                        </div>
                                    </div>

                                    {/* AWB */}
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

                                    {/* ADDRESS */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="flex-1 flex items-center justify-center p-4">
                                            <QRCode
                                                value={qrValue}
                                                size={160}
                                                level="M"
                                            />
                                        </div>

                                        <div className="border-t-[2px] border-black p-1 text-[11px] leading-tight h-[85px] overflow-hidden">
                                            <span className="font-medium">
                                                Shipping/Customer address:
                                            </span>

                                            <br />

                                            <span>
                                                Name:
                                            </span>

                                            <span className="text-[13px] font-semibold">
                                                {" "}
                                                {order.user?.name ||
                                                    "Customer"}
                                            </span>

                                            <br />

                                            {order.shippingAddress?.addressline && (
                                                <>
                                                    {
                                                        order
                                                            .shippingAddress
                                                            .addressline
                                                    }
                                                    ,
                                                </>
                                            )}

                                            {order.shippingAddress?.landmark && (
                                                <>
                                                    {" "}
                                                    {
                                                        order
                                                            .shippingAddress
                                                            .landmark
                                                    }
                                                    ,
                                                </>
                                            )}

                                            <br />

                                            {
                                                order
                                                    .shippingAddress
                                                    ?.city
                                            }

                                            {" - "}

                                            <span className="font-bold text-[13px]">
                                                {
                                                    order
                                                        .shippingAddress
                                                        ?.postalCode
                                                }
                                            </span>

                                            {order.shippingAddress?.state && (
                                                <>
                                                    ,{" "}
                                                    {
                                                        order
                                                            .shippingAddress
                                                            .state
                                                    }
                                                </>
                                            )}

                                            <br />

                                            {order.user?.phone && (
                                                <>
                                                    Phone:{" "}
                                                    {
                                                        order.user
                                                            .phone
                                                    }
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* SOLD BY */}
                                    <div className="border-t-[2px] border-black p-1 text-[9px] leading-[1.1] h-[45px] overflow-hidden">
                                        Sold By:

                                        <span className="font-bold">
                                            {" "}
                                            M/s NEHDO Retail Ventures,
                                        </span>

                                        {" "}
                                        PHOENIX MILLS COMPOUND,
                                        SENAPATI BAPAT MARG,
                                        LOWER PAREL, MUMBAI,
                                        MAHARASHTRA - 400013

                                        <br />

                                        <span className="text-indigo-900 border-b border-indigo-900 inline-block mt-0.5">
                                            GSTIN:
                                        </span>

                                        {" "}
                                        27AAIFU3374R1ZO
                                    </div>

                                    {/* ITEMS */}
                                    <div className="border-t-[2px] border-black flex flex-col min-h-[50px]">
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

                                        <div className="flex flex-col">
                                            {order.items.map(
                                                (item) => (
                                                    <div
                                                        key={
                                                            item._id ||
                                                            `${item.productId}-${item.variantId}`
                                                        }
                                                        className="flex text-[9px] border-b border-black last:border-b-0"
                                                    >
                                                        <div className="flex-1 px-1 border-r-[2px] border-black py-0.5">
                                                            <div className="font-semibold truncate">
                                                                {
                                                                    item.sku ||
                                                                    item.productId
                                                                }
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

                                                        <div className="w-10 px-1 border-r-[2px] border-black text-center flex items-center justify-center">
                                                            {
                                                                item.quantity
                                                            }
                                                        </div>

                                                        <div className="w-16 px-1 text-center flex items-center justify-center">
                                                            ₹
                                                            {Number(
                                                                item.total ||
                                                                0
                                                            ).toFixed(2)}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* FOOTER */}
                                    <div className="border-t-[2px] border-black p-1 text-[10px] flex justify-between items-center">
                                        <div>
                                            <span>
                                                Order:{" "}
                                            </span>

                                            <span className="font-semibold">
                                                {
                                                    order.orderNumber
                                                }
                                            </span>

                                            <span className="ml-3">
                                                Qty:{" "}
                                                {totalQuantity}
                                            </span>
                                        </div>

                                        <span className="font-bold">
                                            ₹
                                            {Number(
                                                order.totalAmount ||
                                                0
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

    // =====================================================
    // ORDER DETAIL
    // =====================================================
    if (selectedOrder) {
        return (
            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                setSelectedOrder(null)
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <IoChevronBackOutline size={22} />
                        </button>

                        <div>
                            <h1 className="font-heading text-2xl font-bold text-gray-900">
                                {
                                    selectedOrder.orderNumber
                                }
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Order details and tracking
                                information.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedIds([
                                    selectedOrder._id
                                ]);

                                handalPrintlabel([
                                    selectedOrder
                                ]);
                            }}
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
                    {/* MAIN */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* STATUS */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Order Status
                            </h2>

                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                {statusFlow.map(
                                    (
                                        status,
                                        index
                                    ) => {
                                        const currentIndex =
                                            statusFlow.indexOf(
                                                selectedOrder.status
                                            );

                                        const isPast =
                                            index <
                                            currentIndex;

                                        const isCurrent =
                                            status ===
                                            selectedOrder.status;

                                        return (
                                            <React.Fragment
                                                key={status}
                                            >
                                                {index >
                                                    0 && (
                                                        <div
                                                            className={`h-0.5 w-8 flex-shrink-0 ${index <=
                                                                currentIndex
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
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    )}

                                                    {
                                                        statusLabels[
                                                        status
                                                        ]
                                                    }
                                                </div>
                                            </React.Fragment>
                                        );
                                    }
                                )}

                                {selectedOrder.status ===
                                    "cancelled" && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-red-100 text-red-700">
                                            <IoCloseOutline
                                                size={14}
                                            />
                                            Cancelled
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* ITEMS */}
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
                                        {selectedOrder.items.map(
                                            (item) => (
                                                <tr
                                                    key={
                                                        item._id ||
                                                        `${item.productId}-${item.variantId}`
                                                    }
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                                {item.image ? (
                                                                    <img
                                                                        src={
                                                                            item.image
                                                                        }
                                                                        alt={
                                                                            item.name ||
                                                                            "Product"
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="text-xs text-gray-400">
                                                                        No
                                                                        Image
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div>
                                                                {item.name && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>
                                                                )}

                                                                <p className="font-semibold text-gray-900">
                                                                    {
                                                                        item.sku ||
                                                                        item.productId
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-600">
                                                        {item.color}/
                                                        {
                                                            item.size
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 text-center">
                                                        {
                                                            item.quantity
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        ₹
                                                        {Number(
                                                            item.price ||
                                                            0
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 text-right font-semibold">
                                                        ₹
                                                        {Number(
                                                            item.total ||
                                                            0
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium">
                                        ₹
                                        {Number(
                                            selectedOrder.subtotal ||
                                            0
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span className="font-medium text-green-600">
                                        - ₹{" "}
                                        {Number(
                                            selectedOrder.discount ||
                                            0
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span className="font-medium">
                                        ₹
                                        {Number(
                                            selectedOrder.shippingCharge ||
                                            0
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-3 flex justify-between">
                                    <span className="font-bold">
                                        Total
                                    </span>

                                    <span className="font-bold text-lg text-brand">
                                        ₹
                                        {Number(
                                            selectedOrder.totalAmount ||
                                            0
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        {/* CUSTOMER */}
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
                                        {
                                            selectedOrder
                                                .user
                                                ?.name
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Email
                                    </p>

                                    <p className="text-sm font-medium text-brand">
                                        {
                                            selectedOrder
                                                .user
                                                ?.email
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Phone
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {
                                            selectedOrder
                                                .user
                                                ?.phone
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Shiproket Info
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        orderID
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {
                                            selectedOrder?.shiprocketOrderId
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        ShipmentId
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {
                                            selectedOrder?.shiprocketShipmentId
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        awb Number
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {
                                            selectedOrder?.trackingNumber
                                        }
                                    </p>
                                </div>




                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Payment Info
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Method
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {
                                            selectedOrder
                                                .payment
                                                ?.method
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Payment Status
                                    </p>

                                    <span
                                        className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${selectedOrder
                                            .payment
                                            ?.status ===
                                            "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-orange-100 text-orange-700"
                                            }`}
                                    >
                                        {
                                            selectedOrder
                                                .payment
                                                ?.status
                                        }
                                    </span>
                                </div>

                                {selectedOrder.payment
                                    ?.method !== "cod" && (
                                        <>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                                    Order ID
                                                </p>

                                                <p className="text-sm font-medium text-gray-900 break-all">
                                                    {
                                                        selectedOrder
                                                            .payment
                                                            ?.orderId
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase">
                                                    Payment ID
                                                </p>

                                                <p className="text-sm font-medium text-gray-900 break-all">
                                                    {
                                                        selectedOrder
                                                            .payment
                                                            ?.paymentId
                                                    }
                                                </p>
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN ORDER LIST
    // =====================================================
    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
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
                            {/* BULK ACCEPT */}
                            {activeStatus === "pending" && (
                                <button
                                    onClick={
                                        handleBulkAccept
                                    }
                                    disabled={
                                        selectedIds.length ===
                                        0
                                    }
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-700"
                                >
                                    Bulk Accept (
                                    {selectedIds.length})
                                </button>
                            )}

                            {/* PRINT LABEL */}
                            {activeStatus !== "all" &&
                                activeStatus !==
                                "pending" && (
                                    <button
                                        onClick={() =>
                                            handalPrintlabel(
                                                orders
                                            )
                                        }
                                        className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-light flex items-center gap-2"
                                    >
                                        <IoPrintOutline
                                            size={16}
                                        />
                                        Print Labels
                                    </button>
                                )}
                        </>
                    )}
                </div>
            </div>

            {/* MAIN CONTAINER */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* STATUS TABS */}
                <div className="flex gap-2 overflow-x-auto px-4 border-b border-gray-100">
                    {[
                        {
                            value: "all",
                            label: "All"
                        },
                        {
                            value: "pending",
                            label: "Pending"
                        },
                        {
                            value: "accepted",
                            label: "Accepted"
                        },
                        {
                            value: "processing",
                            label: "Processing"
                        },
                        {
                            value: "shipped",
                            label: "Shipped"
                        },
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
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setActiveStatus(
                                    tab.value
                                );
                                setSelectedIds([]);
                            }}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${activeStatus ===
                                tab.value
                                ? "border-brand text-brand"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* SEARCH */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            placeholder="Search order ID, customer, email, phone..."
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />

                        {/* CLEAR SEARCH */}
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                                <IoCloseOutline
                                    size={18}
                                />
                            </button>
                        )}
                    </div>

                    {/* RESULT COUNT */}
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                            {filteredOrders.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {
                                orders.filter(
                                    (order) =>
                                        activeStatus ===
                                        "all" ||
                                        order.status ===
                                        activeStatus
                                ).length
                            }
                        </span>{" "}
                        orders
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredOrders.length >
                                            0 &&
                                            filteredOrders.every(
                                                (order) =>
                                                    selectedIds.includes(
                                                        order._id
                                                    )
                                            )
                                        }
                                        onChange={
                                            handleSelectAll
                                        }
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
                            {paginatedOrders.map(
                                (order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() =>
                                            toggleSelection(
                                                order._id
                                            )
                                        }
                                    >
                                        {/* CHECKBOX */}
                                        <td
                                            className="px-6 py-4"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    order._id
                                                )}
                                                onChange={() =>
                                                    toggleSelection(
                                                        order._id
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                            />
                                        </td>

                                        {/* ORDER ID */}
                                        <td className="px-6 py-4 font-medium text-brand">
                                            {
                                                order.orderNumber
                                            }
                                        </td>

                                        {/* CUSTOMER */}
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">
                                                {
                                                    order
                                                        .user
                                                        ?.name
                                                }
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {
                                                    order
                                                        .user
                                                        ?.email
                                                }
                                            </p>
                                        </td>

                                        {/* DATE */}
                                        <td className="px-6 py-4 text-gray-500">
                                            {order.updatedAt
                                                ? new Date(
                                                    order.updatedAt
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )
                                                : "-"}
                                        </td>

                                        {/* ITEMS */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.items.reduce(
                                                (
                                                    total,
                                                    item
                                                ) =>
                                                    total +
                                                    item.quantity,
                                                0
                                            )}
                                        </td>

                                        {/* AMOUNT */}
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹
                                            {Number(
                                                order.totalAmount ||
                                                0
                                            ).toFixed(2)}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {
                                                    statusLabels[
                                                    order.status
                                                    ]
                                                }
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td
                                            className="px-6 py-4 text-right"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <button
                                                className="text-brand text-sm font-semibold hover:underline"
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        order
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}

                            {/* NO RESULTS */}
                            {filteredOrders.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <IoSearchOutline
                                                    size={40}
                                                    className="text-gray-300 mb-3"
                                                />

                                                <p className="text-gray-500 font-medium">
                                                    {searchTerm
                                                        ? "No orders found for your search."
                                                        : "No orders found for this status."}
                                                </p>

                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSearchTerm(
                                                                ""
                                                            )
                                                        }
                                                        className="mt-2 text-sm text-brand font-semibold hover:underline"
                                                    >
                                                        Clear
                                                        search
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {/* ==========================================
                    PAGINATION
                ========================================== */}

                {filteredOrders.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-900">
                                {(currentPage - 1) *
                                    rowsPerPage +
                                    1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-gray-900">
                                {Math.min(
                                    currentPage *
                                    rowsPerPage,
                                    filteredOrders.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-900">
                                {filteredOrders.length}
                            </span>{" "}
                            orders
                        </p>

                        <div className="flex items-center gap-1">
                            {/* PREVIOUS */}
                            <button
                                type="button"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.max(
                                                1,
                                                prev - 1
                                            )
                                    )
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {/* PAGE NUMBERS */}
                            {Array.from(
                                {
                                    length: totalPages
                                },
                                (_, index) =>
                                    index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            page
                                        )
                                    }
                                    className={`min-w-9 px-3 py-2 rounded-lg text-sm font-semibold ${currentPage ===
                                        page
                                        ? "bg-brand text-white"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* NEXT */}
                            <button
                                type="button"
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.min(
                                                totalPages,
                                                prev + 1
                                            )
                                    )
                                }
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;