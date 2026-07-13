import React from "react";
import { IoSaveOutline, IoStorefrontOutline, IoGlobeOutline, IoMailOutline, IoNotificationsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

const AdminSettings = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Store Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage global configuration for your NEHDO store.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoSaveOutline size={20} />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <div className="md:col-span-1 space-y-1">
                    {[
                        { id: 'general', label: 'General Info', icon: IoStorefrontOutline, active: true },
                        { id: 'domains', label: 'Domains & URLs', icon: IoGlobeOutline, active: false },
                        { id: 'email', label: 'Email Configuration', icon: IoMailOutline, active: false },
                        { id: 'notifications', label: 'Notifications', icon: IoNotificationsOutline, active: false },
                        { id: 'security', label: 'Security & Legal', icon: IoShieldCheckmarkOutline, active: false },
                    ].map(tab => (
                        <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${tab.active ? 'bg-brand text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="md:col-span-3 space-y-6">
                    {/* Store Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Store Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                                <input type="text" defaultValue="NEHDO" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Store Contact Email</label>
                                <input type="email" defaultValue="contact@nehdo.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Sender Email (Orders)</label>
                                <input type="email" defaultValue="orders@nehdo.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Support Phone</label>
                                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                        </div>
                    </div>

                    {/* Store Address */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Store Physical Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1</label>
                                <input type="text" defaultValue="123 Fashion Street, Level 4" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2 (Optional)</label>
                                <input type="text" defaultValue="Phoenix Mall Complex" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                <input type="text" defaultValue="Mumbai" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                <input type="text" defaultValue="Maharashtra" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">PIN / ZIP Code</label>
                                <input type="text" defaultValue="400013" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                    <option>India</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram Profile</label>
                                <input type="url" defaultValue="https://instagram.com/nehdo" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Page</label>
                                <input type="url" defaultValue="https://facebook.com/nehdo" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter Profile</label>
                                <input type="url" placeholder="https://twitter.com/..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
