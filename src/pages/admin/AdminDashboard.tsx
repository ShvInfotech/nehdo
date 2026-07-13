import React from "react";
import { Link } from "react-router-dom";
import { IoTrendingUpOutline, IoBagCheckOutline, IoPeopleOutline, IoWalletOutline, IoArrowForwardOutline } from "react-icons/io5";

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here's what's happening with your store today.</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-brand">
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Revenue", value: "₹45,231", trend: "+12.5%", isUp: true, icon: IoWalletOutline, color: "text-green-600", bg: "bg-green-100" },
                    { title: "Total Orders", value: "128", trend: "+5.2%", isUp: true, icon: IoBagCheckOutline, color: "text-blue-600", bg: "bg-blue-100" },
                    { title: "Active Visitors", value: "32", trend: "-2.1%", isUp: false, icon: IoTrendingUpOutline, color: "text-purple-600", bg: "bg-purple-100" },
                    { title: "New Customers", value: "24", trend: "+8.4%", isUp: true, icon: IoPeopleOutline, color: "text-orange-600", bg: "bg-orange-100" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.isUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Placeholder (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
                        <button className="text-sm font-semibold text-brand hover:underline">View Report</button>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-100 pb-2">
                        {/* Mock Chart Bars */}
                        {[35, 45, 30, 65, 40, 85, 55, 90, 60, 75, 50, 80].map((h, i) => (
                            <div key={i} className="w-full bg-brand/10 hover:bg-brand/30 rounded-t-md relative group cursor-pointer transition-colors" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ₹{(h * 1000).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-gray-400 mt-3 px-1">
                        <span>12am</span><span>4am</span><span>8am</span><span>12pm</span><span>4pm</span><span>8pm</span><span>11pm</span>
                    </div>
                </div>

                {/* Top Products (Right 1 col) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                        <Link to="/admin/products" className="text-sm font-semibold text-brand hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Yves Saint Laurent Tee", sales: "24", rev: "₹48k" },
                            { name: "Prada Elite Jacket", sales: "12", rev: "₹54k" },
                            { name: "Gucci Classic Polo", sales: "18", rev: "₹32k" },
                            { name: "Dior Summer Dress", sales: "9", rev: "₹22k" },
                            { name: "Versace Cotton Tee", sales: "15", rev: "₹18k" },
                        ].map((prod, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg object-cover"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                                        <p className="text-xs font-medium text-gray-500">{prod.sales} sales today</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-green-600">{prod.rev}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                        View All <IoArrowForwardOutline />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: "#ORD-8901", customer: "Rahul Patel", date: "10 mins ago", status: "Processing", total: "₹4,500" },
                                { id: "#ORD-8900", customer: "Priya Singh", date: "45 mins ago", status: "Completed", total: "₹12,400" },
                                { id: "#ORD-8899", customer: "Amit Kumar", date: "2 hours ago", status: "Completed", total: "₹2,100" },
                                { id: "#ORD-8898", customer: "Sneha Reddy", date: "3 hours ago", status: "Cancelled", total: "₹8,900" },
                            ].map((order, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-brand cursor-pointer hover:underline">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            order.status === "Completed" ? "bg-green-100 text-green-700" :
                                            order.status === "Processing" ? "bg-orange-100 text-orange-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
