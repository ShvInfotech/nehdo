import React, { useState } from "react";
import { IoSaveOutline, IoAddOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";

const AdminShipping = () => {
    const [showAddZone, setShowAddZone] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Shipping Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure delivery zones, rates, and shipping providers.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoSaveOutline size={20} />
                    Save All Changes
                </button>
            </div>

            {/* Shipping Zones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Delivery Zones & Rates</h2>
                    <button onClick={() => setShowAddZone(true)} className="flex items-center gap-2 px-3 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-light">
                        <IoAddOutline size={16} /> Add Zone
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Zone Name</th>
                                <th className="px-6 py-3 text-left">Regions</th>
                                <th className="px-6 py-3 text-left">Method</th>
                                <th className="px-6 py-3 text-left">Flat Rate (₹)</th>
                                <th className="px-6 py-3 text-left">Free Above (₹)</th>
                                <th className="px-6 py-3 text-left">Est. Delivery</th>
                                <th className="px-6 py-3 text-left">COD</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { zone: "Metro Cities", regions: "Mumbai, Delhi, Bangalore, Chennai", method: "Flat Rate", rate: "₹40", free: "₹799", est: "2-3 days", cod: true },
                                { zone: "Tier-2 Cities", regions: "Pune, Jaipur, Lucknow, +15 more", method: "Flat Rate", rate: "₹60", free: "₹999", est: "3-5 days", cod: true },
                                { zone: "Rest of India", regions: "All other pincodes", method: "Weight Based", rate: "₹80", free: "₹1,499", est: "5-7 days", cod: false },
                            ].map((z, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{z.zone}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px] truncate">{z.regions}</td>
                                    <td className="px-6 py-4 text-gray-600">{z.method}</td>
                                    <td className="px-6 py-4 font-medium">{z.rate}</td>
                                    <td className="px-6 py-4 text-gray-600">{z.free}</td>
                                    <td className="px-6 py-4 text-gray-500">{z.est}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${z.cod ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {z.cod ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-brand text-sm font-semibold hover:underline mr-3">Edit</button>
                                        <button className="text-red-500 text-sm hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Zone Form */}
            {showAddZone && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-blue-700">Add Shipping Zone</h3>
                        <button onClick={() => setShowAddZone(false)} className="p-2 text-blue-400 hover:text-blue-700"><IoCloseOutline size={20} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Zone Name *</label>
                            <input type="text" placeholder="e.g. North India" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">States / Regions</label>
                            <input type="text" placeholder="e.g. Delhi, Punjab, Haryana" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Method</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand">
                                <option>Flat Rate</option>
                                <option>Free Shipping</option>
                                <option>Weight Based</option>
                                <option>Price Based</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Flat Rate (₹)</label>
                            <input type="number" placeholder="50" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Above (₹)</label>
                            <input type="number" placeholder="999" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Delivery Days</label>
                            <input type="text" placeholder="e.g. 3-5 days" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-brand rounded" defaultChecked />
                            <span className="text-sm font-semibold text-gray-700">Enable COD for this zone</span>
                        </label>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700">Save Zone</button>
                        <button onClick={() => setShowAddZone(false)} className="px-6 py-2.5 border border-blue-200 text-sm font-bold text-blue-600 rounded-xl hover:bg-blue-100">Cancel</button>
                    </div>
                </div>
            )}

            {/* Shipping Providers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Shipping Providers</h2>
                    <p className="text-sm text-gray-500 mt-1">Enable and configure shipping provider integrations.</p>
                </div>
                <div className="p-6 space-y-6">
                    {[
                        { name: "Delhivery", desc: "Pan-India delivery with tracking", enabled: true },
                        { name: "Shiprocket", desc: "Multi-carrier aggregator with rate comparison", enabled: true },
                        { name: "BlueDart", desc: "Premium express delivery service", enabled: false },
                        { name: "DTDC", desc: "Economy domestic and international shipping", enabled: false },
                        { name: "India Post", desc: "Government postal service for rural areas", enabled: false },
                    ].map((provider, i) => (
                        <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">{provider.name}</p>
                                <p className="text-sm text-gray-500">{provider.desc}</p>
                                {provider.enabled && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">API Key</label>
                                            <input type="password" defaultValue="sk_live_xxxxx" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Secret Key</label>
                                            <input type="password" defaultValue="sk_secret_xxxxx" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                                <input type="checkbox" className="sr-only peer" defaultChecked={provider.enabled} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Default Package */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Default Package Dimensions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                        <input type="number" step="0.1" defaultValue={0.5} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Length (cm)</label>
                        <input type="number" defaultValue={30} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Width (cm)</label>
                        <input type="number" defaultValue={20} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                        <input type="number" defaultValue={10} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                    </div>
                </div>
            </div>

            {/* International Shipping */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-gray-900">Enable International Shipping</p>
                        <p className="text-sm text-gray-500">Allow customers from outside India to place orders.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AdminShipping;
