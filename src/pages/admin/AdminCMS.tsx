import React, { useState } from "react";
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";

const AdminCMS = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">CMS Pages</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage content for static pages like About Us, Terms, etc.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoAddOutline size={20} />
                    Create Page
                </button>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Create New Page</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title *</label>
                                    <input type="text" placeholder="e.g. About Us" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">nehdo.com/</span>
                                        <input type="text" placeholder="about-us" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Template</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Full Width</option>
                                        <option>With Sidebar</option>
                                        <option>Landing Page</option>
                                        <option>Contact Page</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <IoCloudUploadOutline size={28} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm font-semibold text-gray-600">Click to upload featured image</p>
                                        <p className="text-xs text-gray-400 mt-1">Recommended: 1200×630px (used for social sharing)</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Page Content *</label>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
                                            {['B', 'I', 'U', '|', 'H1', 'H2', 'H3', '|', '• List', '1. List', '|', 'Link', 'Image', 'Video', '|', 'Quote', 'Code', 'Table'].map((btn, i) => (
                                                btn === '|' ? <div key={i} className="w-px h-6 bg-gray-300 mx-1 self-center"></div> :
                                                <button key={i} className={`px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100 ${btn === 'B' ? 'font-bold' : btn === 'I' ? 'italic' : btn === 'U' ? 'underline' : ''}`}>{btn}</button>
                                            ))}
                                        </div>
                                        <textarea rows={12} placeholder="Write your content here... (HTML supported)" className="w-full p-4 focus:outline-none"></textarea>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                                    <input type="text" placeholder="e.g. Admin" defaultValue="Admin" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Published</option>
                                        <option>Draft</option>
                                        <option>Scheduled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
                                    <input type="datetime-local" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Navigation Order</label>
                                    <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                </div>
                            </div>

                            {/* Display Settings */}
                            <div className="border-t border-gray-100 pt-6 space-y-3">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Display</h3>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Show in Navigation Menu</p>
                                        <p className="text-xs text-gray-500">Add a link in the main site navigation</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                    </label>
                                </label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Show in Footer</p>
                                        <p className="text-xs text-gray-500">Add a link in the footer navigation</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                    </label>
                                </label>
                            </div>

                            {/* SEO */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">SEO Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                                        <input type="text" placeholder="e.g. About NEHDO — Premium Fashion Store" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                                        <textarea rows={2} placeholder="Description for search results..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">OG Image (Social Share Image)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                            <p className="text-sm font-semibold text-gray-600">Click to upload OG image</p>
                                            <p className="text-xs text-gray-400 mt-1">1200×630px recommended</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Save as Draft</button>
                                <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Publish Page</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search pages..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Page Title</th>
                                <th className="px-6 py-4">URL Slug</th>
                                <th className="px-6 py-4">Template</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Last Updated</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { title: "About Us", slug: "/about", template: "Full Width", author: "Admin", updated: "10 Jul 2026", status: "Published" },
                                { title: "Terms and Conditions", slug: "/terms", template: "Full Width", author: "Admin", updated: "01 Jan 2026", status: "Published" },
                                { title: "Privacy Policy", slug: "/privacy", template: "Full Width", author: "Admin", updated: "01 Jan 2026", status: "Published" },
                                { title: "Return & Refund Policy", slug: "/returns", template: "Full Width", author: "Admin", updated: "01 Jan 2026", status: "Published" },
                                { title: "Summer Campaign 2026", slug: "/campaign/summer", template: "Landing Page", author: "Admin", updated: "11 Jul 2026", status: "Draft" },
                            ].map((page, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{page.slug}</td>
                                    <td className="px-6 py-4 text-gray-600">{page.template}</td>
                                    <td className="px-6 py-4 text-gray-500">{page.author}</td>
                                    <td className="px-6 py-4 text-gray-500">{page.updated}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${page.status === "Published" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{page.status}</span>
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

export default AdminCMS;
