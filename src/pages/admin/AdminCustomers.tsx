import React, { useState } from "react";
import { IoSearchOutline, IoFilterOutline, IoEllipsisVertical, IoCloseOutline, IoChevronBackOutline, IoMailOutline, IoBanOutline } from "react-icons/io5";

const mockCustomers = [
    { name: "Rahul Patel", email: "rahul.p@example.com", phone: "+91 98765 43210", joined: "12 Jan 2026", orders: 12, spent: "₹45,299", avgOrder: "₹3,775", status: "Active", newsletter: true },
    { name: "Priya Singh", email: "priya.s@example.com", phone: "+91 87654 32109", joined: "28 Feb 2026", orders: 5, spent: "₹12,499", avgOrder: "₹2,500", status: "Active", newsletter: true },
    { name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 76543 21098", joined: "15 Mar 2026", orders: 3, spent: "₹8,999", avgOrder: "₹3,000", status: "Active", newsletter: false },
    { name: "Neha Sharma", email: "neha.sharma@example.com", phone: "+91 65432 10987", joined: "01 May 2026", orders: 1, spent: "₹2,150", avgOrder: "₹2,150", status: "Blocked", newsletter: true },
    { name: "Vikram Desai", email: "vikram.d@example.com", phone: "+91 54321 09876", joined: "20 Jun 2026", orders: 8, spent: "₹28,400", avgOrder: "₹3,550", status: "Active", newsletter: false },
];

const AdminCustomers = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

    if (selectedCustomer) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <IoChevronBackOutline size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-heading text-2xl font-bold text-gray-900">{selectedCustomer.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">Customer since {selectedCustomer.joined}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                            <IoMailOutline size={18} />
                            Send Email
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orders}</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Total Orders</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">{selectedCustomer.spent}</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Total Spent</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">{selectedCustomer.avgOrder}</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Avg Order Value</p>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Order ID</th>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Items</th>
                                            <th className="px-6 py-3 text-left">Amount</th>
                                            <th className="px-6 py-3 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { id: "#ORD-001", date: "12 Jul 2026", items: 2, amount: "₹4,299", status: "Delivered", color: "bg-green-100 text-green-700" },
                                            { id: "#ORD-012", date: "01 Jul 2026", items: 1, amount: "₹1,899", status: "Delivered", color: "bg-green-100 text-green-700" },
                                            { id: "#ORD-035", date: "15 Jun 2026", items: 3, amount: "₹8,500", status: "Delivered", color: "bg-green-100 text-green-700" },
                                            { id: "#ORD-078", date: "01 Jun 2026", items: 1, amount: "₹2,599", status: "Returned", color: "bg-red-100 text-red-700" },
                                        ].map((order, i) => (
                                            <tr key={i} className="hover:bg-gray-50 cursor-pointer">
                                                <td className="px-6 py-4 font-medium text-brand">{order.id}</td>
                                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                                <td className="px-6 py-4 text-gray-600">{order.items}</td>
                                                <td className="px-6 py-4 font-medium">{order.amount}</td>
                                                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.color}`}>{order.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Customer Notes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Notes</h2>
                            <div className="space-y-3 mb-4">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-gray-700">Prefers COD payment. Address confirmed via phone call.</p>
                                    <p className="text-xs text-gray-400 mt-1">Added by Admin — 05 Jul 2026</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <input type="text" placeholder="Add a note about this customer..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm" />
                                <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800">Add</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xl">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{selectedCustomer.name}</p>
                                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {selectedCustomer.status}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Email</p><p className="text-sm font-medium text-brand">{selectedCustomer.email}</p></div>
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Phone</p><p className="text-sm font-medium text-gray-900">{selectedCustomer.phone}</p></div>
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Joined</p><p className="text-sm font-medium text-gray-900">{selectedCustomer.joined}</p></div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Newsletter</p>
                                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedCustomer.newsletter ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {selectedCustomer.newsletter ? 'Subscribed' : 'Not Subscribed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Default Address */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Default Shipping Address</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedCustomer.name}<br />
                                123 Fashion Street, Apt 4B<br />
                                Andheri West<br />
                                Mumbai, Maharashtra 400058<br />
                                India
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-100 transition-colors">
                                    <IoMailOutline size={16} />
                                    Send Email
                                </button>
                                <button className="w-full px-4 py-2.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                                    Reset Password
                                </button>
                                <button className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                                    selectedCustomer.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}>
                                    <IoBanOutline size={16} />
                                    {selectedCustomer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage user accounts and customer data.</p>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">Export CSV</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Blocked</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 whitespace-nowrap">
                            <IoFilterOutline size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                </th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockCustomers.map((customer, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                                                {customer.name.charAt(0)}
                                            </div>
                                            {customer.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{customer.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{customer.orders}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.spent}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <button className="text-brand text-sm font-semibold hover:underline" onClick={() => setSelectedCustomer(customer)}>View</button>
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

export default AdminCustomers;
