import React, { useState } from "react";
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoCloseOutline, IoCloudUploadOutline, IoImageOutline } from "react-icons/io5";
import { categories } from "../../data/products";

const AdminCategories = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product categories and collections.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Add Category
                </button>
            </div>

            {/* Add Category Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                                    <input type="text" placeholder="e.g. Summer Collection" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">/collection/</span>
                                        <input type="text" placeholder="summer-collection" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Category</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option value="">None (Top Level)</option>
                                        {categories.map((cat, i) => (
                                            <option key={i} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1">Select parent for sub-category, or leave empty for top-level</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea rows={3} placeholder="Category description (shown on category page)..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <IoCloudUploadOutline size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm font-semibold text-gray-600">Click to upload category image</p>
                                        <p className="text-xs text-gray-400 mt-1">Recommended: 800×400px, PNG or JPG</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order / Sort Priority</label>
                                    <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    <p className="text-xs text-gray-400 mt-1">Lower number = higher priority</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Active</option>
                                        <option>Hidden</option>
                                    </select>
                                </div>
                            </div>

                            {/* Display Settings */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Display Settings</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Show on Homepage</p>
                                            <p className="text-xs text-gray-500">Display this category in the homepage categories section</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Show in Navigation</p>
                                            <p className="text-xs text-gray-500">Display this category in the main navigation menu</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">SEO Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                                        <input type="text" placeholder="e.g. Summer Collection — NEHDO" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">0/60 characters recommended</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                                        <textarea rows={2} placeholder="Description for search results..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"></textarea>
                                        <p className="text-xs text-gray-400 mt-1">0/160 characters recommended</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Save Category</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search categories..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                </th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Parent</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <IoImageOutline size={16} className="text-gray-400" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{category}</td>
                                    <td className="px-6 py-4 text-gray-500">{i % 3 === 0 ? '—' : categories[Math.max(0, i - 1)]}</td>
                                    <td className="px-6 py-4 text-gray-600">{Math.floor(Math.random() * 50) + 5}</td>
                                    <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-brand text-sm font-semibold hover:underline">Edit</button>
                                            <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
                                                <IoEllipsisVertical size={18} />
                                            </button>
                                        </div>
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

export default AdminCategories;
