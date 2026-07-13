import React from "react";
import { IoSaveOutline } from "react-icons/io5";

const AdminPayment = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Payment Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure payment gateways and methods.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoSaveOutline size={20} />
                    Save All Changes
                </button>
            </div>

            {/* Razorpay */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Razorpay</h2>
                        <p className="text-sm text-gray-500">Accept Credit/Debit cards, UPI, Netbanking, Wallets</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">API Key (Key ID)</label>
                            <input type="text" placeholder="rzp_live_xxxxxxxxx" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Secret Key</label>
                            <input type="password" placeholder="••••••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook URL</label>
                            <div className="flex gap-2">
                                <input type="text" value="https://nehdo.com/api/webhooks/razorpay" readOnly className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600" />
                                <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-300">Copy</button>
                            </div>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                        <div>
                            <span className="text-sm font-semibold text-orange-700">Test Mode</span>
                            <p className="text-xs text-orange-600">Use test credentials for sandbox environment</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Stripe */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Stripe</h2>
                        <p className="text-sm text-gray-500">International card payments and Apple Pay / Google Pay</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Publishable Key</label>
                            <input type="text" placeholder="pk_live_xxxxxxxxx" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand font-mono text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Secret Key</label>
                            <input type="password" placeholder="sk_live_xxxxxxxxx" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Webhook Secret</label>
                            <input type="password" placeholder="whsec_xxxxxxxxx" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                    </div>
                </div>
            </div>

            {/* UPI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">UPI Direct</h2>
                        <p className="text-sm text-gray-500">Direct UPI ID / QR code for manual payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                            <input type="text" placeholder="e.g. nehdo@upi" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">QR Code Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                                <p className="text-sm font-semibold text-gray-600">Upload QR Code</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Cash on Delivery (COD)</h2>
                        <p className="text-sm text-gray-500">Allow customers to pay upon delivery</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">COD Fee (₹)</label>
                            <input type="number" placeholder="0" defaultValue={0} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            <p className="text-xs text-gray-400 mt-1">Extra charge for COD orders (0 = free)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Max COD Order Amount (₹)</label>
                            <input type="number" placeholder="e.g. 5000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            <p className="text-xs text-gray-400 mt-1">Maximum order value for COD (leave empty for no limit)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Transfer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Bank Transfer / NEFT / RTGS</h2>
                        <p className="text-sm text-gray-500">Manual bank transfer payment option</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                            <input type="text" placeholder="e.g. State Bank of India" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                            <input type="text" placeholder="e.g. NEHDO Pvt Ltd" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                            <input type="text" placeholder="e.g. 1234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                            <input type="text" placeholder="e.g. SBIN0001234" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency & Refunds */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Currency & Refund Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Store Currency</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                            <option>INR (₹) — Indian Rupee</option>
                            <option>USD ($) — US Dollar</option>
                            <option>EUR (€) — Euro</option>
                            <option>GBP (£) — British Pound</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Refund Processing Time</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                            <option>Instant</option>
                            <option>1-3 Business Days</option>
                            <option>5-7 Business Days</option>
                            <option>10-14 Business Days</option>
                        </select>
                    </div>
                </div>
                <label className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
                    <input type="checkbox" className="w-4 h-4 text-brand rounded" />
                    <span className="text-sm font-semibold text-gray-700">Show transaction fees to customers at checkout</span>
                </label>
            </div>
        </div>
    );
};

export default AdminPayment;
