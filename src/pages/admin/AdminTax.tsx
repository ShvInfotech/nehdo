import React from "react";
import { IoSaveOutline, IoAddOutline } from "react-icons/io5";

const AdminTax = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Tax / GST Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure tax rules, GST slabs, and HSN code mappings.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors">
                    <IoSaveOutline size={20} />
                    Save All Changes
                </button>
            </div>

            {/* Tax Registration */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tax Registration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">GSTIN</label>
                        <input type="text" placeholder="e.g. 27AABCU9603R1ZM" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Legal Name</label>
                        <input type="text" placeholder="e.g. NEHDO Fashion Pvt Ltd" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                            <option>Private Limited Company</option>
                            <option>LLP</option>
                            <option>Proprietorship</option>
                            <option>Partnership</option>
                            <option>OPC</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State of Registration</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                            <option>Maharashtra</option>
                            <option>Delhi</option>
                            <option>Karnataka</option>
                            <option>Gujarat</option>
                            <option>Tamil Nadu</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                        <input type="text" placeholder="e.g. AABCU9603R" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase" />
                    </div>
                </div>
            </div>

            {/* Tax Behavior */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tax Behavior</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Prices</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer flex-1">
                                <input type="radio" name="taxInclusion" className="w-4 h-4 text-brand" defaultChecked />
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Tax Inclusive</span>
                                    <p className="text-xs text-gray-400">Prices include tax</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer flex-1">
                                <input type="radio" name="taxInclusion" className="w-4 h-4 text-brand" />
                                <div>
                                    <span className="text-sm font-semibold text-gray-700">Tax Exclusive</span>
                                    <p className="text-xs text-gray-400">Tax added at checkout</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">GST Tax Type (for same state)</label>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-700">• <strong>Intra-State</strong> (Same state): CGST + SGST (split equally)</p>
                            <p className="text-sm text-blue-700 mt-1">• <strong>Inter-State</strong> (Different state): IGST (full rate)</p>
                            <p className="text-xs text-blue-500 mt-2">This is automatically determined based on customer's shipping address.</p>
                        </div>
                    </div>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Show Tax Breakup on Invoice</p>
                            <p className="text-xs text-gray-500">Display CGST/SGST/IGST separately on invoice</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                    </label>
                </div>
            </div>

            {/* GST Slabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">GST Slabs & HSN Code Mapping</h2>
                    <button className="flex items-center gap-2 px-3 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-light">
                        <IoAddOutline size={16} /> Add Slab
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">HSN Code</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">GST Rate</th>
                                <th className="px-6 py-3 text-left">CGST</th>
                                <th className="px-6 py-3 text-left">SGST</th>
                                <th className="px-6 py-3 text-left">IGST</th>
                                <th className="px-6 py-3 text-left">Applied To</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { hsn: "6109", desc: "T-Shirts (Cotton)", gst: "5%", cgst: "2.5%", sgst: "2.5%", igst: "5%", applied: "T-Shirts, Polo Tees" },
                                { hsn: "6105", desc: "Shirts (Knitted)", gst: "5%", cgst: "2.5%", sgst: "2.5%", igst: "5%", applied: "Shirts, Formal" },
                                { hsn: "6204", desc: "Women's Dresses", gst: "12%", cgst: "6%", sgst: "6%", igst: "12%", applied: "Dresses, Skirts" },
                                { hsn: "6203", desc: "Men's Suits & Jackets", gst: "12%", cgst: "6%", sgst: "6%", igst: "12%", applied: "Jackets, Blazers" },
                                { hsn: "6404", desc: "Footwear (above ₹1000)", gst: "18%", cgst: "9%", sgst: "9%", igst: "18%", applied: "Shoes, Sneakers" },
                                { hsn: "7117", desc: "Imitation Jewellery", gst: "3%", cgst: "1.5%", sgst: "1.5%", igst: "3%", applied: "Accessories" },
                            ].map((slab, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono text-brand font-bold">{slab.hsn}</td>
                                    <td className="px-6 py-3 text-gray-700">{slab.desc}</td>
                                    <td className="px-6 py-3 font-bold text-gray-900">{slab.gst}</td>
                                    <td className="px-6 py-3 text-gray-500">{slab.cgst}</td>
                                    <td className="px-6 py-3 text-gray-500">{slab.sgst}</td>
                                    <td className="px-6 py-3 text-gray-500">{slab.igst}</td>
                                    <td className="px-6 py-3 text-gray-500 text-xs max-w-[150px] truncate">{slab.applied}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-brand text-sm font-semibold hover:underline mr-3">Edit</button>
                                        <button className="text-red-500 text-sm hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tax Exemptions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tax Exemptions</h2>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-3">
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Tax-Free on Shipping</p>
                        <p className="text-xs text-gray-500">Don't charge GST on shipping fees</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Exempt Exports (SEZ / Export Orders)</p>
                        <p className="text-xs text-gray-500">Zero-rate tax on international orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                    </label>
                </label>
            </div>
        </div>
    );
};

export default AdminTax;
