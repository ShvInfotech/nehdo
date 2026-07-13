import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoPersonOutline, IoBagHandleOutline, IoHeartOutline, IoLogOutOutline, IoChevronDown } from "react-icons/io5";
import { orders } from "../data/orders";
import Breadcrumb from "../components/Breadcrumb";

const SidebarNav = ({ active }: { active: string }) => {
    const navs = [
        { id: "profile", label: "My Profile", icon: IoPersonOutline, href: "/account" },
        { id: "orders", label: "My Orders", icon: IoBagHandleOutline, href: "/orders" },
        { id: "wishlist", label: "Wishlist", icon: IoHeartOutline, href: "/wishlist" },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100">
            <nav className="flex flex-col gap-2">
                {navs.map(n => (
                    <Link key={n.id} to={n.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active === n.id ? "bg-brand text-white shadow-button" : "text-gray-600 hover:bg-gray-100"}`}>
                        <n.icon size={20} /> {n.label}
                    </Link>
                ))}
                <div className="h-px bg-gray-100 my-2 mx-4" />
                <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left">
                    <IoLogOutOutline size={20} /> Logout
                </button>
            </nav>
        </div>
    );
};

const OrderCard = ({ order }: { order: typeof orders[0] }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Processing": return "bg-blue-100 text-blue-700";
            case "Shipped": return "bg-amber-100 text-amber-700";
            case "Delivered": return "bg-green-100 text-green-700";
            case "Cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-card transition-shadow overflow-hidden mb-6">
            {/* Header */}
            <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/50">
                <div className="flex flex-wrap gap-8">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order Placed</p>
                        <p className="font-semibold text-gray-900">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                        <p className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                        <p className="font-semibold text-brand">{order.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>{order.status}</span>
                    <button onClick={() => setExpanded(!expanded)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <IoChevronDown size={20} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Content preview (collapsed) */}
            <div className="p-6 md:p-8 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <h3 className="font-heading font-bold text-lg mb-4">{order.status === "Delivered" ? "Delivered on " + new Date(order.date).toLocaleDateString() : "Estimated delivery in 3-5 days"}</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {order.items.map((item, i) => (
                        <div key={i} className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-gray-100">
                        <div className="p-6 md:p-8 bg-gray-50/30">
                            <h4 className="font-heading font-bold mb-4">Items</h4>
                            <div className="space-y-4 mb-8">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <Link to={`/product/${item.productId}`} className="font-semibold hover:text-brand transition-colors">{item.name}</Link>
                                            <p className="text-xs text-muted mt-1">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                                            <p className="font-bold text-accent mt-1">₹{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex-shrink-0 hidden md:block">
                                            <Link to={`/product/${item.productId}`} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:border-brand transition-colors">Buy Again</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                                <div>
                                    <h4 className="font-heading font-bold mb-2">Shipping Address</h4>
                                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                                </div>
                                <div>
                                    <h4 className="font-heading font-bold mb-2">Tracking</h4>
                                    <p className="text-sm text-gray-600">{order.trackingNumber ? `Track via FedEx: ${order.trackingNumber}` : "Tracking not available yet"}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Orders = () => {
    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Orders" }]} /></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <SidebarNav active="orders" />
                </div>
                
                <div className="lg:col-span-3">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Order History</h1>
                    
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                        {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab, i) => (
                            <button key={tab} className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${i === 0 ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"}`}>{tab}</button>
                        ))}
                    </div>

                    <div className="mt-6">
                        {orders.map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
