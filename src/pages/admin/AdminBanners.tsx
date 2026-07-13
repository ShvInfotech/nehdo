import React, { useState } from "react";
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoImageOutline, IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";

const AdminBanners = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Banners & Sliders</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage homepage hero banners and promotional sliders.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoAddOutline size={20} />
                    Add Banner
                </button>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Add New Banner</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"><IoCloseOutline size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Desktop Image *</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <IoCloudUploadOutline size={28} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-xs font-semibold text-gray-600">1920×800px recommended</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <IoCloudUploadOutline size={28} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-xs font-semibold text-gray-600">750×1000px recommended</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title Text</label>
                                    <input type="text" placeholder="e.g. Summer Sale 2026" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle Text</label>
                                    <input type="text" placeholder="e.g. Up to 50% off on selected items" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Text</label>
                                    <input type="text" placeholder="e.g. Shop Now" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Link URL *</label>
                                    <input type="text" placeholder="e.g. /collection/summer" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Placement *</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Hero Slider</option>
                                        <option>Category Banner</option>
                                        <option>Promotional Strip</option>
                                        <option>Popup</option>
                                        <option>Sidebar Banner</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order / Priority</label>
                                    <input type="number" placeholder="1" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>All Visitors</option>
                                        <option>New Visitors Only</option>
                                        <option>Returning Customers</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Scheduled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Schedule (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Save Banner</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search banners..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Preview</th>
                                <th className="px-6 py-4">Title / Placement</th>
                                <th className="px-6 py-4">CTA</th>
                                <th className="px-6 py-4">Schedule</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { title: "Summer Sale 2026", placement: "Hero Slider", cta: "Shop Now → /collection/summer", schedule: "01 Jun — 31 Aug", priority: 1, active: true },
                                { title: "New Arrivals", placement: "Hero Slider", cta: "Explore → /shop", schedule: "Always", priority: 2, active: true },
                                { title: "Free Shipping Strip", placement: "Promotional Strip", cta: "No CTA", schedule: "Always", priority: 1, active: true },
                                { title: "Clearance Promo", placement: "Category Banner", cta: "View Deals → /collection/clearance", schedule: "Ended", priority: 3, active: false },
                            ].map((banner, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                            <IoImageOutline size={20} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-gray-900">{banner.title}</p>
                                        <p className="text-xs text-gray-500">{banner.placement}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{banner.cta}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{banner.schedule}</td>
                                    <td className="px-6 py-4 text-gray-600">{banner.priority}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${banner.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {banner.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-brand text-sm font-semibold hover:underline mr-3">Edit</button>
                                        <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"><IoEllipsisVertical size={18} /></button>
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

export default AdminBanners;
