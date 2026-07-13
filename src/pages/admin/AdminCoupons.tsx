import React, { useState } from "react";
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoCloseOutline, IoRefreshOutline } from "react-icons/io5";

const AdminCoupons = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage promotional codes and active discounts.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Create Coupon
                </button>
            </div>

            {/* Create Coupon Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Create Coupon</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code *</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="e.g. SUMMER50" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase" />
                                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                                                <IoRefreshOutline size={16} />
                                                Auto Generate
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type *</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                            <option>Percentage (%)</option>
                                            <option>Fixed Cart Discount (₹)</option>
                                            <option>Fixed Product Discount (₹)</option>
                                            <option>Free Shipping</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value *</label>
                                        <input type="number" placeholder="50" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Purchase Amount (₹)</label>
                                        <input type="number" placeholder="e.g. 500" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">Leave empty for no minimum</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Discount Cap (₹)</label>
                                        <input type="number" placeholder="e.g. 1000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">Max discount amount (for percentage type)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Usage Limits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Total Usage Limit</label>
                                        <input type="number" placeholder="Leave empty for unlimited" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit Per Customer</label>
                                        <input type="number" placeholder="e.g. 1" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                        <input type="datetime-local" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                        <input type="datetime-local" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                            </div>

                            {/* Applicable Products */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Applicable Products & Categories</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Apply To</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                            <option>All Products</option>
                                            <option>Specific Products</option>
                                            <option>Specific Categories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Include Products (comma-separated SKUs)</label>
                                        <input type="text" placeholder="e.g. PRD-0001, PRD-0002" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exclude Products (comma-separated SKUs)</label>
                                        <input type="text" placeholder="e.g. PRD-0005" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                            </div>

                            {/* Customer Eligibility */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Customer Eligibility</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Who can use this coupon?</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                            <option>All Customers</option>
                                            <option>First-Time Buyers Only</option>
                                            <option>Specific Customers (by email)</option>
                                            <option>Returning Customers Only</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Combinable with other coupons</p>
                                            <p className="text-xs text-gray-500">Allow customers to stack this with other discount codes</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Save Coupon</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Coupons", value: "5", color: "text-green-600" },
                    { label: "Total Redemptions", value: "327", color: "text-blue-600" },
                    { label: "Revenue Lost to Discounts", value: "₹48,350", color: "text-red-600" },
                    { label: "Expired Coupons", value: "3", color: "text-gray-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search coupons..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Min Purchase</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { code: "SUMMER50", type: "Percentage", discount: "50% Off", minPurchase: "₹500", usage: "142 / 500", validity: "01 Jun — 30 Aug 2026", active: true },
                                { code: "WELCOME10", type: "Percentage", discount: "10% Off", minPurchase: "None", usage: "85 / ∞", validity: "No Expiry", active: true },
                                { code: "FLAT200", type: "Fixed Cart", discount: "₹200 Off", minPurchase: "₹1,000", usage: "67 / 200", validity: "01 Jul — 31 Jul 2026", active: true },
                                { code: "FREESHIP", type: "Free Shipping", discount: "Free Shipping", minPurchase: "₹299", usage: "210 / ∞", validity: "No Expiry", active: true },
                                { code: "FLASH20", type: "Percentage", discount: "20% Off (Max ₹500)", minPurchase: "₹800", usage: "100 / 100", validity: "01 Jul 2026", active: false },
                            ].map((coupon, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand font-mono">{coupon.code}</td>
                                    <td className="px-6 py-4 text-gray-600">{coupon.type}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{coupon.discount}</td>
                                    <td className="px-6 py-4 text-gray-500">{coupon.minPurchase}</td>
                                    <td className="px-6 py-4 text-gray-600">{coupon.usage}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{coupon.validity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${coupon.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {coupon.active ? "Active" : "Expired"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-brand text-sm font-semibold hover:underline mr-3">Edit</button>
                                        <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
                                            <IoEllipsisVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCoupons;
