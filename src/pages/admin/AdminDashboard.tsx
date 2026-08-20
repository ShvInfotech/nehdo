import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    IoTrendingUpOutline,
    IoBagCheckOutline,
    IoPeopleOutline,
    IoWalletOutline,
    IoArrowForwardOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

interface RevenueAnalytics {
    label: string;
    revenue: number;
}

interface TopProduct {
    productId: string;
    name: string;
    image: string;
    sales: number;
    revenue: number;
}

interface RecentOrder {
    id: string;
    orderId: string;
    customer: string;
    email: string;
    date: string;
    status: string;
    total: number;
}

interface DashboardData {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    activeVisitors: null;
    revenueAnalytics: RevenueAnalytics[];
    topProducts: TopProduct[];
    recentOrders: RecentOrder[];
}

const AdminDashboard = () => {
    const [range, setRange] = useState("today");

    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(false);

    // =====================================================
    // FETCH DASHBOARD
    // =====================================================

    const fetchDashboard = async (selectedRange: string) => {
        try {
            setLoading(true);

            const response = await apiRequest(`/admin/api/v1/dashboard/get?range=${selectedRange}`,"GET");

            if (response?.success) {
                setDashboard(response.dashboard);
            }
        } catch (error) {
            console.error(
                "Dashboard fetch error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchDashboard(range);
    }, []);

    // =====================================================
    // RANGE CHANGE
    // =====================================================

    const handleRangeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedRange = e.target.value;

        setRange(selectedRange);

        fetchDashboard(selectedRange);
    };

    // =====================================================
    // STATS
    // =====================================================

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${Number(
                dashboard?.totalRevenue || 0
            ).toLocaleString("en-IN")}`,
            icon: IoWalletOutline,
            color: "text-green-600",
            bg: "bg-green-100",
        },

        {
            title: "Total Orders",
            value: Number(
                dashboard?.totalOrders || 0
            ).toLocaleString("en-IN"),
            icon: IoBagCheckOutline,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },

        {
            title: "New Customers",
            value: Number(
                dashboard?.newCustomers || 0
            ).toLocaleString("en-IN"),
            icon: IoPeopleOutline,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
    ];

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const formatStatus = (status: string) => {
        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date: string) => {
        const orderDate = new Date(date);

        return orderDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, Admin. Here's what's
                        happening with your store today.
                    </p>
                </div>

                <div className="flex gap-2">

                    <select
                        value={range}
                        onChange={handleRangeChange}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-brand"
                    >
                        <option value="today">
                            Today
                        </option>

                        <option value="yesterday">
                            Yesterday
                        </option>

                        <option value="last7days">
                            Last 7 Days
                        </option>

                        <option value="last30days">
                            Last 30 Days
                        </option>
                    </select>

                </div>
            </div>

            {/* =================================================
                QUICK STATS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >

                        <div className="flex items-center justify-between mb-4">

                            <div
                                className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}
                            >
                                <stat.icon size={22} />
                            </div>

                        </div>

                        <div>

                            <h3 className="text-2xl font-bold text-gray-900">
                                {loading
                                    ? "..."
                                    : stat.value}
                            </h3>

                            <p className="text-sm font-medium text-gray-500 mt-1">
                                {stat.title}
                            </p>

                        </div>

                    </div>
                ))}

            </div>

            {/* =================================================
                CHART + TOP PRODUCTS
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Analytics */}

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-lg font-bold text-gray-900">
                            Revenue Analytics
                        </h2>

                        <button className="text-sm font-semibold text-brand hover:underline">
                            View Report
                        </button>

                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-2">

                        {dashboard?.revenueAnalytics?.length ? (

                            dashboard.revenueAnalytics.map(
                                (item, i) => {

                                    const maxRevenue =
                                        Math.max(
                                            ...dashboard.revenueAnalytics.map(
                                                (item) =>
                                                    item.revenue
                                            ),
                                            1
                                        );

                                    const height =
                                        (item.revenue /
                                            maxRevenue) *
                                        100;

                                    return (
                                        <div
                                            key={i}
                                            className="w-full bg-brand/10 hover:bg-brand/30 rounded-t-md relative group cursor-pointer transition-colors"
                                            style={{
                                                height: `${Math.max(
                                                    height,
                                                    5
                                                )}%`,
                                            }}
                                        >

                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                ₹
                                                {Number(
                                                    item.revenue
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </div>

                                        </div>
                                    );
                                }
                            )

                        ) : (

                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                                No revenue data
                            </div>

                        )}

                    </div>

                    <div className="flex justify-between text-xs font-semibold text-gray-400 mt-3 px-1">

                        {dashboard?.revenueAnalytics?.length
                            ? dashboard.revenueAnalytics.map(
                                (item, i) => (
                                    <span key={i}>
                                        {item.label}
                                    </span>
                                )
                            )
                            : null}

                    </div>

                </div>

                {/* =================================================
                    TOP PRODUCTS
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-lg font-bold text-gray-900">
                            Top Products
                        </h2>

                        <Link
                            to="/admin/products"
                            className="text-sm font-semibold text-brand hover:underline"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="space-y-4">

                        {dashboard?.topProducts?.length ? (

                            dashboard.topProducts.map(
                                (prod) => (

                                    <div
                                        key={prod.productId}
                                        className="flex items-center justify-between"
                                    >

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">

                                                {prod.image && (
                                                    <img
                                                        src={prod.image}
                                                        alt={prod.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                            </div>

                                            <div>

                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                                    {prod.name}
                                                </p>

                                                <p className="text-xs font-medium text-gray-500">
                                                    {prod.sales} sales
                                                </p>

                                            </div>

                                        </div>

                                        <span className="text-sm font-bold text-green-600">
                                            ₹
                                            {Number(
                                                prod.revenue
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                )

                            )

                        ) : (

                            <p className="text-sm text-gray-400 text-center py-5">
                                No products found
                            </p>

                        )}

                    </div>

                </div>

            </div>

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                    <h2 className="text-lg font-bold text-gray-900">
                        Recent Orders
                    </h2>

                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                    >
                        View All
                        <IoArrowForwardOutline />
                    </Link>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-left">

                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                            <tr>

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
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {dashboard?.recentOrders?.length ? (

                                dashboard.recentOrders.map(
                                    (order) => (

                                        <tr
                                            key={order.orderId}
                                            className="hover:bg-gray-50 transition-colors"
                                        >

                                            <td className="px-6 py-4 font-semibold text-brand cursor-pointer hover:underline">
                                                #{order.id}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {order.customer}
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                {formatDate(
                                                    order.date
                                                )}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        order.status ===
                                                        "delivered"
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status ===
                                                                "cancelled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {formatStatus(
                                                        order.status
                                                    )}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ₹
                                                {Number(
                                                    order.total
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-gray-400"
                                    >
                                        No recent orders found
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

export default AdminDashboard;