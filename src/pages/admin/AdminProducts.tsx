import React, { useState } from "react";
import { IoAddOutline, IoSearchOutline, IoFilterOutline, IoEllipsisVertical, IoCloseOutline, IoCloudUploadOutline, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import { products, brands, categories, subCategories } from "../../data/products";

const AdminProducts = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productList, setProductList] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [activeTab, setActiveTab] = useState<'general' | 'variants' | 'inventory' | 'shipping' | 'seo'>('general');

    const tabs = [
        { key: 'general', label: 'General Info' },
        { key: 'variants', label: 'Variants' },
        { key: 'inventory', label: 'Inventory' },
        { key: 'shipping', label: 'Shipping' },
        { key: 'seo', label: 'SEO' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product inventory and listings.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Add Product
                </button>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-100 px-6 flex gap-1 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.key 
                                            ? 'border-brand text-brand' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-6">
                            {activeTab === 'general' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                                            <input type="text" placeholder="e.g. Classic White Tee" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
                                            <input type="text" placeholder="e.g. TEE-WH-001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Barcode (ISBN, UPC, EAN)</label>
                                            <input type="text" placeholder="e.g. 8901234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price (₹) *</label>
                                            <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price (₹)</label>
                                            <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost per Item (₹)</label>
                                            <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                            <p className="text-xs text-gray-400 mt-1">Used for profit margin calculation</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Main Category *</label>
                                            <select 
                                                value={selectedCategory}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                    setSelectedSubCategory("");
                                                }}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            >
                                                <option value="">Select Main Category</option>
                                                {categories.filter(c => c !== "All").map((cat, i) => (
                                                    <option key={i} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category</label>
                                            <select 
                                                value={selectedSubCategory}
                                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                                disabled={!selectedCategory}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">{selectedCategory ? "Select Sub-Category" : "Select Main Category First"}</option>
                                                {selectedCategory && subCategories[selectedCategory]?.map((sub, i) => (
                                                    <option key={i} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                                <option value="">Select Brand</option>
                                                {brands.map((brand, i) => (
                                                    <option key={i} value={brand}>{brand}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                                            <input type="text" placeholder="e.g. summer, casual, cotton (comma separated)" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                            <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images *</label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                                <IoCloudUploadOutline size={40} className="mx-auto text-gray-400 mb-3" />
                                                <p className="text-sm font-semibold text-gray-600">Drag & Drop or Click to upload images</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each • First image will be the featured image</p>
                                            </div>
                                            {/* Mock uploaded images */}
                                            <div className="flex gap-3 mt-4">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="relative w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center group">
                                                        <IoImageOutline size={24} className="text-gray-400" />
                                                        <button className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <IoTrashOutline size={12} />
                                                        </button>
                                                        {i === 1 && <span className="absolute bottom-0 left-0 right-0 text-[10px] font-bold text-center bg-brand text-white rounded-b-lg py-0.5">Featured</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                                            <textarea rows={2} placeholder="Brief product summary (shown on product cards)..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"></textarea>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Long Description *</label>
                                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold hover:bg-gray-100">B</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm italic hover:bg-gray-100">I</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm underline hover:bg-gray-100">U</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">H1</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">H2</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">• List</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">1. List</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">Link</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">Image</button>
                                                </div>
                                                <textarea rows={6} placeholder="Write detailed product description... (HTML supported)" className="w-full p-4 focus:outline-none"></textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Status *</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                                <option>Active</option>
                                                <option>Draft</option>
                                                <option>Archived</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                                <option>Visible (Listed on store)</option>
                                                <option>Hidden (Only via direct link)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <h3 className="text-sm font-bold text-gray-700">Product Flags</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                                                    <p className="text-xs text-gray-400">Show on homepage</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                                                    <p className="text-xs text-gray-400">Show "New" badge</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">Trending</span>
                                                    <p className="text-xs text-gray-400">Show in trending section</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'variants' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Size Options</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                                                <label key={size} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                                    <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" />
                                                    <span className="text-sm font-semibold text-gray-700">{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Color Options</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { name: 'White', color: '#FFFFFF' }, { name: 'Black', color: '#000000' },
                                                { name: 'Navy', color: '#1B2A4A' }, { name: 'Red', color: '#DC2626' },
                                                { name: 'Blue', color: '#3B82F6' }, { name: 'Green', color: '#22C55E' },
                                                { name: 'Beige', color: '#D2B48C' }, { name: 'Grey', color: '#9CA3AF' },
                                            ].map(c => (
                                                <label key={c.name} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                                    <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" />
                                                    <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: c.color }}></span>
                                                    <span className="text-sm font-semibold text-gray-700">{c.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-3">
                                            <input type="text" placeholder="Add custom color (e.g. Olive Green)" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm w-64" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Material</h3>
                                        <select className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                            <option value="">Select Material</option>
                                            <option>100% Cotton</option>
                                            <option>Cotton Blend</option>
                                            <option>Polyester</option>
                                            <option>Silk</option>
                                            <option>Linen</option>
                                            <option>Denim</option>
                                            <option>Wool</option>
                                            <option>Leather</option>
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-blue-700 mb-2">Variant Price Table</h3>
                                        <p className="text-xs text-blue-600 mb-4">Set individual prices and stock for each variant combination. Leave blank to use default price.</p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="text-xs text-gray-500 uppercase">
                                                    <tr>
                                                        <th className="text-left py-2 pr-4">Variant</th>
                                                        <th className="text-left py-2 pr-4">Price (₹)</th>
                                                        <th className="text-left py-2 pr-4">Stock</th>
                                                        <th className="text-left py-2">SKU</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-blue-100">
                                                    {['White / M', 'White / L', 'Black / M', 'Black / L'].map((variant, i) => (
                                                        <tr key={i}>
                                                            <td className="py-2 pr-4 font-medium text-gray-700">{variant}</td>
                                                            <td className="py-2 pr-4"><input type="number" placeholder="—" className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-sm" /></td>
                                                            <td className="py-2 pr-4"><input type="number" placeholder="0" className="w-20 px-2 py-1 bg-white border border-gray-200 rounded text-sm" /></td>
                                                            <td className="py-2"><input type="text" placeholder="Auto" className="w-28 px-2 py-1 bg-white border border-gray-200 rounded text-sm" /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                                            <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Low Stock Threshold</label>
                                            <input type="number" placeholder="10" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                            <p className="text-xs text-gray-400 mt-1">Alert when stock falls below this number</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Warehouse Location</label>
                                            <input type="text" placeholder="e.g. Warehouse A, Shelf B3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Track Inventory</p>
                                                <p className="text-xs text-gray-500">Automatically track stock levels and prevent overselling</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                            </label>
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Allow Backorders</p>
                                                <p className="text-xs text-gray-500">Allow customers to order even when out of stock</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                            </label>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div className="space-y-6">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">This product requires shipping</p>
                                            <p className="text-xs text-gray-500">Uncheck for digital products or services</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                                            <input type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Dimensions (cm)</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <input type="number" step="0.1" placeholder="Length" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm" />
                                                <p className="text-xs text-gray-400 mt-1 text-center">Length</p>
                                            </div>
                                            <div>
                                                <input type="number" step="0.1" placeholder="Width" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm" />
                                                <p className="text-xs text-gray-400 mt-1 text-center">Width</p>
                                            </div>
                                            <div>
                                                <input type="number" step="0.1" placeholder="Height" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm" />
                                                <p className="text-xs text-gray-400 mt-1 text-center">Height</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">HS Code (for international shipping)</label>
                                        <input type="text" placeholder="e.g. 6109.10" className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                        <h3 className="text-sm font-bold text-green-700 mb-1">Search Engine Preview</h3>
                                        <div className="mt-2">
                                            <p className="text-blue-700 text-lg font-medium">Classic White Tee — NEHDO</p>
                                            <p className="text-green-700 text-sm">https://nehdo.com/product/classic-white-tee</p>
                                            <p className="text-gray-600 text-sm mt-1">Premium quality cotton t-shirt perfect for everyday wear. Available in multiple sizes and colors.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">nehdo.com/product/</span>
                                            <input type="text" placeholder="classic-white-tee" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                                        <input type="text" placeholder="e.g. Classic White Tee — NEHDO" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">0/60 characters recommended</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                                        <textarea rows={3} placeholder="Brief description for search engine results..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"></textarea>
                                        <p className="text-xs text-gray-400 mt-1">0/160 characters recommended</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Save as Draft</button>
                                <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Publish Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Categories</option>
                            <option>T-Shirts</option>
                            <option>Shirts</option>
                            <option>Jeans</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 whitespace-nowrap">
                            <IoFilterOutline size={18} />
                            More Filters
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
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {productList.slice(0, 10).map((product, idx) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">PRD-{product.id.toString().padStart(4, '0')}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
                                            {product.originalPrice && <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${idx === 4 ? 'text-red-600' : idx === 1 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {idx === 4 ? '0' : idx === 1 ? '3' : Math.floor(45 + idx * 12)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isTrending ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {product.isTrending ? "Active" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setIsAddModalOpen(true)} className="text-brand text-sm font-semibold hover:underline">Edit</button>
                                            <button onClick={() => setProductList(prev => prev.filter(p => p.id !== product.id))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <IoTrashOutline size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to 10 of {products.length} entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 rounded border border-gray-200 bg-brand text-white">1</button>
                        <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
