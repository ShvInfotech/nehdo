import React, { useEffect, useMemo, useState } from "react";
import {
    IoSearchOutline,
    IoFilterOutline,
    IoChevronBackOutline,
    IoMailOutline,
    IoBanOutline,
    IoCloseOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

interface Address {
    _id: string;
    userId: string;
    defaultaddress: boolean;
    addressline: string;
    landmark: string;
    city: string;
    state: string;
    postalCode: string;
}

interface CustomerOrder {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    updatedAt: string;
    itemsCount: number;
    payment?: {
        status: string;
    };
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile: string;
    createdAt: string;
    status?: string;
    defaultAddress?: Address;
    orders: CustomerOrder[];
    totalOrders: number;
    totalPaidAmount: number;
    averageSpendPerPaidOrder: number;
}

interface CustomersResponse {
    success: boolean;
    message: string;
    customers: Customer[];
}

const AdminCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] =
        useState<Customer | null>(null);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");

    // ---------------------------------------------
    // MODALS
    // ---------------------------------------------

    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showSendEmail, setShowSendEmail] = useState(false);

    // ---------------------------------------------
    // RESET PASSWORD FORM
    // ---------------------------------------------

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ---------------------------------------------
    // SEND EMAIL FORM
    // ---------------------------------------------

    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    // ----------------------------------------------------
    // GET CUSTOMERS
    // ----------------------------------------------------

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const response: CustomersResponse = await apiRequest(
                "/admin/api/v1/customers/get",
                "GET"
            );

            if (response?.success) {
                setCustomers(response.customers || []);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error("Get customers error:", error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // ----------------------------------------------------
    // SEARCH + FILTER
    // ----------------------------------------------------

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                customer.name?.toLowerCase().includes(searchValue) ||
                customer.email?.toLowerCase().includes(searchValue) ||
                customer.phone?.toLowerCase().includes(searchValue);

            const customerStatus =
                customer.status?.toLowerCase() || "active";

            const matchesStatus =
                statusFilter === "All Status" ||
                customerStatus === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [customers, search, statusFilter]);

    // ----------------------------------------------------
    // FORMATTERS
    // ----------------------------------------------------

    const formatCurrency = (amount: number) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (date: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-700";

            case "accepted":
                return "bg-blue-100 text-blue-700";

            case "processing":
                return "bg-yellow-100 text-yellow-700";

            case "shipped":
                return "bg-purple-100 text-purple-700";

            case "out_for_delivery":
                return "bg-indigo-100 text-indigo-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatOrderStatus = (status: string) => {
        if (!status) return "-";

        return status
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    // ====================================================
    // BLOCK CUSTOMER
    // ====================================================

    const handleBlockCustomer = async () => {
        if (!selectedCustomer) return;

        const confirmed = window.confirm(
            `Are you sure you want to block ${selectedCustomer.name}?`
        );

        if (!confirmed) return;
        console.log(selectedCustomer)
        try {
            setActionLoading(true);

            const response = await apiRequest(`/admin/api/v1/customers/update/${selectedCustomer._id}`, "PATCH", { status: "block", });

            if (response?.success) {
                // -----------------------------------------
                // Update selected customer immediately
                // -----------------------------------------

                const updatedCustomer = {
                    ...selectedCustomer,
                    status: "block",
                };

                setSelectedCustomer(updatedCustomer);

                // -----------------------------------------
                // Update customer list immediately
                // -----------------------------------------

                setCustomers((prev) =>
                    prev.map((customer) =>
                        customer._id === selectedCustomer._id
                            ? {
                                ...customer,
                                status: "block",
                            }
                            : customer
                    )
                );

                alert(
                    response.message ||
                    "Customer blocked successfully"
                );
            } else {
                alert(
                    response?.message ||
                    "Failed to block customer"
                );
            }
        } catch (error) {
            console.error("Block customer error:", error);
            alert("Something went wrong while blocking customer.");
        } finally {
            setActionLoading(false);
        }
    };

    // ====================================================
    // RESET PASSWORD
    // ====================================================

    const openResetPassword = () => {
        setNewPassword("");
        setConfirmPassword("");
        setShowResetPassword(true);
    };

    const handleResetPassword = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!selectedCustomer) return;

        if (!newPassword) {
            alert("Please enter new password.");
            return;
        }

        if (newPassword.length < 6) {
            alert(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            setActionLoading(true);

            const response = await apiRequest(`/admin/api/v1/customers/update/${selectedCustomer._id}`, "PATCH", { password: newPassword },);

            if (response?.success) {
                alert(
                    response.message ||
                    "Password reset successfully."
                );

                setShowResetPassword(false);
                setNewPassword("");
                setConfirmPassword("");

                // Refresh UI data
                await fetchCustomers();

                // selected customer refresh
                const updatedCustomer = customers.find(
                    (customer) =>
                        customer._id === selectedCustomer._id
                );

                if (updatedCustomer) {
                    setSelectedCustomer(updatedCustomer);
                }
            } else {
                alert(
                    response?.message ||
                    "Failed to reset password."
                );
            }
        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            alert(
                "Something went wrong while resetting password."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ====================================================
    // SEND EMAIL
    // NO API CALL
    // ONLY CONSOLE PAYLOAD
    // ====================================================

    const openSendEmail = () => {
        setEmailSubject("");
        setEmailMessage("");
        setShowSendEmail(true);
    };

    const handleSendEmail = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!selectedCustomer) return;

        const payload = {
            userId: selectedCustomer._id,
            email: selectedCustomer.email,
            name: selectedCustomer.name,
            subject: emailSubject,
            message: emailMessage,
        };

        console.log(
            "SEND EMAIL PAYLOAD:",
            payload
        );

        const respons = await apiRequest('/admin/api/v1/customers/sendmail', "POST", payload)

        alert(
            "Email payload printed in console."
        );

        setShowSendEmail(false);
    };

    // ====================================================
    // CUSTOMER DETAIL
    // ====================================================

    if (selectedCustomer) {
        const address =
            selectedCustomer.defaultAddress;

        return (
            <div className="space-y-6">

                {/* Header */}

                <div className="flex items-center gap-4">

                    <button
                        onClick={() =>
                            setSelectedCustomer(null)
                        }
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <IoChevronBackOutline
                            size={20}
                        />
                    </button>

                    <div className="flex-1">

                        <h1 className="font-heading text-2xl font-bold text-gray-900">
                            {selectedCustomer.name}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Customer since{" "}
                            {formatDate(
                                selectedCustomer.createdAt
                            )}
                        </p>

                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={openSendEmail}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            <IoMailOutline
                                size={18}
                            />
                            Send Email
                        </button>

                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* Stats */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        selectedCustomer.totalOrders
                                    }
                                </p>

                                <p className="text-xs text-gray-500 font-semibold mt-1">
                                    Total Orders
                                </p>

                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(
                                        selectedCustomer.totalPaidAmount
                                    )}
                                </p>

                                <p className="text-xs text-gray-500 font-semibold mt-1">
                                    Total Spent
                                </p>

                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        selectedCustomer.averageSpendPerPaidOrder
                                    )}
                                </p>

                                <p className="text-xs text-gray-500 font-semibold mt-1">
                                    Avg Order Value
                                </p>

                            </div>

                        </div>

                        {/* Order History */}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            <div className="p-6 border-b border-gray-100">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Order History
                                </h2>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm">

                                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                                        <tr>

                                            <th className="px-6 py-3 text-left">
                                                Order ID
                                            </th>

                                            <th className="px-6 py-3 text-left">
                                                Date
                                            </th>

                                            <th className="px-6 py-3 text-left">
                                                Items
                                            </th>

                                            <th className="px-6 py-3 text-left">
                                                Amount
                                            </th>

                                            <th className="px-6 py-3 text-left">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {selectedCustomer.orders.length >
                                            0 ? (
                                            selectedCustomer.orders.map(
                                                (order) => (
                                                    <tr
                                                        key={
                                                            order._id
                                                        }
                                                        className="hover:bg-gray-50 cursor-pointer"
                                                    >

                                                        <td className="px-6 py-4 font-medium text-brand">
                                                            {
                                                                order.orderNumber
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 text-gray-500">
                                                            {formatDate(
                                                                order.updatedAt
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 text-gray-600">
                                                            {
                                                                order.itemsCount
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 font-medium">
                                                            {formatCurrency(
                                                                order.totalAmount
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {formatOrderStatus(
                                                                    order.status
                                                                )}
                                                            </span>

                                                        </td>

                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>

                                                <td
                                                    colSpan={
                                                        5
                                                    }
                                                    className="px-6 py-10 text-center text-gray-500"
                                                >
                                                    No orders
                                                    found
                                                </td>

                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        {/* Customer Notes */}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Customer Notes
                            </h2>

                            <div className="space-y-3 mb-4">

                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">

                                    <p className="text-sm text-gray-700">
                                        No customer notes
                                        available.
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3">

                                <input
                                    type="text"
                                    placeholder="Add a note about this customer..."
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
                                />

                                <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800">
                                    Add
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDEBAR */}

                    <div className="space-y-6">

                        {/* Profile */}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <div className="flex items-center gap-4 mb-6">

                                {selectedCustomer.profile ? (
                                    <img
                                        src={
                                            selectedCustomer.profile
                                        }
                                        alt={
                                            selectedCustomer.name
                                        }
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xl">
                                        {selectedCustomer.name
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase()}
                                    </div>
                                )}

                                <div>

                                    <p className="font-bold text-gray-900">
                                        {
                                            selectedCustomer.name
                                        }
                                    </p>

                                    <span
                                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedCustomer.status?.toLowerCase() ===
                                            "block"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {selectedCustomer.status?.toLowerCase() ===
                                            "block"
                                            ? "Blocked"
                                            : "Active"}
                                    </span>

                                </div>

                            </div>

                            <div className="space-y-3">

                                <div>

                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Email
                                    </p>

                                    <p className="text-sm font-medium text-brand break-all">
                                        {selectedCustomer.email ||
                                            "-"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Phone
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedCustomer.phone ||
                                            "-"}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-xs font-semibold text-gray-400 uppercase">
                                        Joined
                                    </p>

                                    <p className="text-sm font-medium text-gray-900">
                                        {formatDate(
                                            selectedCustomer.createdAt
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Default Address */}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Default Shipping Address
                            </h2>

                            {address ? (
                                <p className="text-sm text-gray-700 leading-relaxed">

                                    {
                                        selectedCustomer.name
                                    }
                                    <br />

                                    {address.addressline}
                                    <br />

                                    {address.landmark}
                                    <br />

                                    {address.city},{" "}
                                    {address.state}{" "}
                                    {address.postalCode}

                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No default address
                                    found.
                                </p>
                            )}

                        </div>

                        {/* Actions */}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Actions
                            </h2>

                            <div className="space-y-2">

                                <button
                                    onClick={
                                        openSendEmail
                                    }
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    <IoMailOutline
                                        size={16}
                                    />
                                    Send Email
                                </button>

                                <button
                                    onClick={
                                        openResetPassword
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Reset Password
                                </button>

                                <button
                                    onClick={
                                        handleBlockCustomer
                                    }
                                    disabled={
                                        actionLoading ||
                                        selectedCustomer.status?.toLowerCase() ===
                                        "block"
                                    }
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <IoBanOutline
                                        size={16}
                                    />

                                    {selectedCustomer.status?.toLowerCase() ===
                                        "block"
                                        ? "Customer Blocked"
                                        : actionLoading
                                            ? "Blocking..."
                                            : "Block Customer"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================================================= */}
                {/* RESET PASSWORD MODAL */}
                {/* ================================================= */}

                {showResetPassword && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-gray-900">
                                        Reset Password
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {
                                            selectedCustomer.email
                                        }
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowResetPassword(
                                            false
                                        )
                                    }
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                >
                                    <IoCloseOutline
                                        size={22}
                                    />
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleResetPassword
                                }
                                className="p-6 space-y-4"
                            >

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            newPassword
                                        }
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                <div className="flex justify-end gap-3 pt-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowResetPassword(
                                                false
                                            )
                                        }
                                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            actionLoading
                                        }
                                        className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-light disabled:opacity-50"
                                    >
                                        {actionLoading
                                            ? "Resetting..."
                                            : "Reset Password"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

                {/* ================================================= */}
                {/* SEND EMAIL MODAL */}
                {/* ================================================= */}

                {showSendEmail && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-gray-900">
                                        Send Email
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        To:{" "}
                                        {
                                            selectedCustomer.email
                                        }
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        setShowSendEmail(
                                            false
                                        )
                                    }
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                                >
                                    <IoCloseOutline
                                        size={22}
                                    />
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleSendEmail
                                }
                                className="p-6 space-y-4"
                            >

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            emailSubject
                                        }
                                        onChange={(e) =>
                                            setEmailSubject(
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="Enter email subject"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message
                                    </label>

                                    <textarea
                                        rows={6}
                                        value={
                                            emailMessage
                                        }
                                        onChange={(e) =>
                                            setEmailMessage(
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="Write your message..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand resize-none"
                                    />

                                </div>

                                <div className="flex justify-end gap-3 pt-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSendEmail(
                                                false
                                            )
                                        }
                                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-light"
                                    >
                                        Print Payload
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

            </div>
        );
    }

    // ====================================================
    // CUSTOMER LIST
    // ====================================================

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>

                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Customers
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage user accounts and customer
                        data.
                    </p>

                </div>

                <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                    Export CSV
                </button>

            </div>

            {/* Main Table */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Search */}

                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />

                    </div>

                    <div className="flex gap-2">

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand"
                        >

                            <option>
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="block">
                                Blocked
                            </option>

                        </select>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 whitespace-nowrap">

                            <IoFilterOutline
                                size={18}
                            />

                            Filters

                        </button>

                    </div>

                </div>

                {/* Loading */}

                {loading ? (
                    <div className="py-16 text-center text-gray-500">
                        Loading customers...
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-left">

                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                                <tr>

                                    <th className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                        />
                                    </th>

                                    <th className="px-6 py-4">
                                        Name
                                    </th>

                                    <th className="px-6 py-4">
                                        Email
                                    </th>

                                    <th className="px-6 py-4">
                                        Phone
                                    </th>

                                    <th className="px-6 py-4">
                                        Orders
                                    </th>

                                    <th className="px-6 py-4">
                                        Total Spent
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

                                {filteredCustomers.length >
                                    0 ? (
                                    filteredCustomers.map(
                                        (customer) => (
                                            <tr
                                                key={
                                                    customer._id
                                                }
                                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() =>
                                                    setSelectedCustomer(
                                                        customer
                                                    )
                                                }
                                            >

                                                <td
                                                    className="px-6 py-4"
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        e.stopPropagation()
                                                    }
                                                >

                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                                    />

                                                </td>

                                                <td className="px-6 py-4 font-medium text-gray-900">

                                                    <div className="flex items-center gap-3">

                                                        {customer.profile ? (
                                                            <img
                                                                src={
                                                                    customer.profile
                                                                }
                                                                alt={
                                                                    customer.name
                                                                }
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                                                                {customer.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()}
                                                            </div>
                                                        )}

                                                        {
                                                            customer.name
                                                        }

                                                    </div>

                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {customer.email ||
                                                        "-"}
                                                </td>

                                                <td className="px-6 py-4 text-gray-500">
                                                    {customer.phone ||
                                                        "-"}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {
                                                        customer.totalOrders
                                                    }
                                                </td>

                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {formatCurrency(
                                                        customer.totalPaidAmount
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${customer.status?.toLowerCase() ===
                                                            "block"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
                                                        {customer.status?.toLowerCase() ===
                                                            "block"
                                                            ? "Blocked"
                                                            : "Active"}
                                                    </span>

                                                </td>

                                                <td
                                                    className="px-6 py-4 text-right"
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        e.stopPropagation()
                                                    }
                                                >

                                                    <button
                                                        className="text-brand text-sm font-semibold hover:underline"
                                                        onClick={() =>
                                                            setSelectedCustomer(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>

                                        <td
                                            colSpan={
                                                8
                                            }
                                            className="px-6 py-16 text-center text-gray-500"
                                        >
                                            No customers
                                            found
                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminCustomers;