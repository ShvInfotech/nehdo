import React, { useState } from "react";
import { IoWarningOutline, IoSearchOutline, IoFilterOutline, IoCloudDownloadOutline, IoCloudUploadOutline } from "react-icons/io5";
import { products } from "../../data/products";

const AdminInventory = () => {
    const [showBulkUpdate, setShowBulkUpdate] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage stock levels and receive alerts.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                        <IoCloudDownloadOutline size={18} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                        <IoCloudUploadOutline size={18} />
                        Import CSV
                    </button>
                    <button 
                        onClick={() => setShowBulkUpdate(!showBulkUpdate)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                    >
                        Bulk Update
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-500">In Stock</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{products.length - 3}</p>
                </div>
                <div className="bg-white rounded-xl border border-orange-200 p-4 bg-orange-50">
                    <p className="text-sm font-semibold text-orange-600">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">2</p>
                </div>
                <div className="bg-white rounded-xl border border-red-200 p-4 bg-red-50">
                    <p className="text-sm font-semibold text-red-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">1</p>
                </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                <IoWarningOutline size={24} className="text-orange-500 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-orange-700">Low Stock Alert</p>
                    <p className="text-xs text-orange-600">3 products need restocking. Check the inventory below for details.</p>
                </div>
            </div>

            {/* Bulk Update Form */}
            {showBulkUpdate && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-blue-700 mb-4">Bulk Stock Update</h3>
                    <p className="text-xs text-blue-600 mb-4">Upload a CSV file to update stock quantities for multiple products at once.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV File</label>
                            <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center bg-white cursor-pointer hover:bg-blue-50 transition-colors">
                                <IoCloudUploadOutline size={24} className="mx-auto text-blue-400 mb-1" />
                                <p className="text-sm font-semibold text-blue-600">Click to upload</p>
                                <p className="text-xs text-blue-400 mt-1">Format: SKU, Quantity</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Update Type</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand mb-3">
                                <option>Set absolute quantity</option>
                                <option>Add to existing stock</option>
                                <option>Subtract from stock</option>
                            </select>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Reason</label>
                            <input type="text" placeholder="e.g. Restock from supplier" className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-brand" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm">Apply Update</button>
                        <button onClick={() => setShowBulkUpdate(false)} className="px-6 py-2.5 border border-blue-200 text-sm font-bold text-blue-600 rounded-xl hover:bg-blue-100">Cancel</button>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by product or SKU..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Stock Levels</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                            <option>Out of Stock</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Warehouses</option>
                            <option>Warehouse A</option>
                            <option>Warehouse B</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                </th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Variant</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Reserved</th>
                                <th className="px-6 py-4">Available</th>
                                <th className="px-6 py-4">Warehouse</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Quick Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.slice(0, 8).map((product, i) => {
                                const stock = i === 1 ? 2 : i === 4 ? 0 : 45 + (i * 12);
                                const reserved = Math.min(stock, Math.floor(Math.random() * 5));
                                const available = stock - reserved;
                                let statusColor = "bg-green-100 text-green-700";
                                let statusText = "In Stock";
                                
                                if (stock === 0) {
                                    statusColor = "bg-red-100 text-red-700";
                                    statusText = "Out of Stock";
                                } else if (stock < 10) {
                                    statusColor = "bg-orange-100 text-orange-700";
                                    statusText = "Low Stock";
                                }

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">PRD-{product.id.toString().padStart(4, '0')}</td>
                                        <td className="px-6 py-4 text-gray-600">{['M / White', 'L / Black', 'S / Navy', 'XL / Grey', 'M / Red', 'L / Blue', 'M / Beige', 'L / Green'][i]}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{stock}</td>
                                        <td className="px-6 py-4 text-gray-500">{reserved}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{available}</td>
                                        <td className="px-6 py-4 text-gray-500">{i % 2 === 0 ? 'Warehouse A' : 'Warehouse B'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                                {statusText}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <input type="number" className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm text-center" placeholder={String(stock)} />
                                                <button className="text-brand text-sm font-semibold hover:underline">Save</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stock Movement History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Recent Stock Movements</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Product</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Qty Change</th>
                                <th className="px-6 py-3 text-left">New Stock</th>
                                <th className="px-6 py-3 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { date: "13 Jul, 10:00", product: "Yves Saint Laurent Tee", type: "Sold", qty: "-1", newStock: "44", reason: "Order #ORD-001", typeColor: "text-red-600" },
                                { date: "13 Jul, 09:30", product: "Gucci Classic Polo", type: "Added", qty: "+50", newStock: "52", reason: "Restock from supplier", typeColor: "text-green-600" },
                                { date: "12 Jul, 16:00", product: "Prada Elite Jacket", type: "Returned", qty: "+1", newStock: "70", reason: "Return #RET-005", typeColor: "text-blue-600" },
                                { date: "12 Jul, 14:00", product: "Dior Summer Dress", type: "Adjusted", qty: "-3", newStock: "67", reason: "Damaged inventory", typeColor: "text-orange-600" },
                            ].map((movement, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-gray-500">{movement.date}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{movement.product}</td>
                                    <td className="px-6 py-3"><span className={`font-semibold ${movement.typeColor}`}>{movement.type}</span></td>
                                    <td className="px-6 py-3 font-semibold">{movement.qty}</td>
                                    <td className="px-6 py-3 text-gray-700">{movement.newStock}</td>
                                    <td className="px-6 py-3 text-gray-500">{movement.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInventory;
