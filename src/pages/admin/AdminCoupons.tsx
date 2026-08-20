import React, { useEffect, useState } from 'react';
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoCloseOutline, IoRefreshOutline } from "react-icons/io5";
import { apiRequest } from '../../services/apiService';
const AdminCoupons = () => {

    const initialFormData = {
        couponCode: '',
        discountType: 'Percentage',
        discountValue: '',
        minimumPurchase: '',
        maximumDiscount: '',
        maxLimit: '',
        limitUse: '',
        maxusecoupone: 1,
        startDate: '',
        endDate: '',
        apply: 'allProduct',
        productSku: '',
        excludeSku: '',
        couponUser: 'AllUser',
        applayCustomer: '',
        status: 'active'
    };
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [totalRedemptions, setTotalRedemptions] = useState(0);
    const [totalRevenueLost, setTotalRevenueLost] = useState(0);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getCoupons = async () => {
        try {
            setLoading(true);

            const res = await apiRequest('/admin/api/v1/coupon/get', 'GET');

            setCoupons(res?.coupons || []);
            setTotalRevenueLost(res.totalRevenueLost)
            setTotalRedemptions(res.totalRedemptions)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCoupons();
    }, []);


    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,

                discountValue: Number(formData.discountValue || 0),
                minimumPurchase: Number(formData.minimumPurchase || 0),
                maximumDiscount: Number(formData.maximumDiscount || 0),
                maxLimit: Number(formData.maxLimit || 0),
                limitUse: Number(formData.limitUse || 0),
                maxusecoupone: Number(formData.maxusecoupone || 1),

                productSku: formData.productSku
                    ? formData.productSku.split(',').map((i) => i.trim())
                    : [],

                excludeSku: formData.excludeSku
                    ? formData.excludeSku.split(',').map((i) => i.trim())
                    : [],

                applayCustomer: formData.applayCustomer
                    ? formData.applayCustomer.split(',').map((i) => i.trim())
                    : [],
            };

            if (isEditMode) {
                await apiRequest(`/admin/api/v1/coupon/update/${editId}`,
                    "PATCH",
                    payload);

                alert('Coupon updated successfully');
            } else {
                await apiRequest("/admin/api/v1/coupon/add",
                    "POST",
                    payload);

                alert('Coupon created successfully');
            }

            setIsAddModalOpen(false);
            setFormData(initialFormData);
            setIsEditMode(false);
            setEditId(null);

            getCoupons();
        } catch (error) {
            console.error(error);
            alert(error?.message || 'Failed to create coupon');
        }
    };



    const handleEdit = (coupon) => {
        setIsEditMode(true);
        setEditId(coupon._id);

        setFormData({
            couponCode: coupon.couponCode || '',
            discountType: coupon.discountType || 'Percentage',
            discountValue: coupon.discountValue || '',
            minimumPurchase: coupon.minimumPurchase || '',
            maximumDiscount: coupon.maximumDiscount || '',
            maxLimit: coupon.maxLimit || '',
            limitUse: coupon.limitUse || '',
            maxusecoupone: coupon.maxusecoupone || 1,

            startDate: coupon.startDate
                ? new Date(coupon.startDate).toISOString().slice(0, 16)
                : '',

            endDate: coupon.endDate
                ? new Date(coupon.endDate).toISOString().slice(0, 16)
                : '',

            apply: coupon.apply || 'allProduct',

            productSku: coupon.productSku?.join(', ') || '',
            excludeSku: coupon.excludeSku?.join(', ') || '',

            couponUser: coupon.couponUser || 'AllUser',

            applayCustomer: coupon.applayCustomer?.join(', ') || '',

            status: coupon.status || 'active'
        });

        setIsAddModalOpen(true);
    };

    const activeCoupons = coupons.filter((coupon) => coupon.status === "active").length || 0;

const expiredCoupons = coupons.filter((coupon) => coupon.status === "expired").length || 0;
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage promotional codes and active discounts.</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditId(null);
                        setFormData(initialFormData);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Create Coupon
                </button>
            </div>

            {/* Create Coupon Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code *</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="e.g. SUMMER50" name='couponCode'
                                                value={formData.couponCode}
                                                onChange={handleChange} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand uppercase" />
                                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                                                <IoRefreshOutline size={16} />
                                                Auto Generate
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type *</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            name='discountType'
                                            value={formData.discountType}
                                            onChange={handleChange}>
                                            <option value="Percentage">Percentage (%)</option>
                                            <option value="CartDiscount">Fixed Cart Discount (₹)</option>
                                            <option value="ProductDiscount">Fixed Product Discount (₹)</option>
                                            <option value="Shipping">Free Shipping</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value *</label>
                                        <input type="number" placeholder="50" name='discountValue'
                                            value={formData.discountValue}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Purchase Amount (₹)</label>
                                        <input type="number" placeholder="e.g. 500"
                                            name='minimumPurchase'
                                            value={formData.minimumPurchase}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">Leave empty for no minimum</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Discount Cap (₹)</label>
                                        <input type="number" placeholder="e.g. 1000"
                                            name='maximumDiscount'
                                            value={formData.maximumDiscount}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        <p className="text-xs text-gray-400 mt-1">Max discount amount (for percentage type)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Usage Limits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Total Usage Limit</label>
                                        <input type="number" placeholder="Leave empty for unlimited"
                                            name='maxLimit'
                                            value={formData.maxLimit}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit Per Customer</label>
                                        <input type="number" placeholder="e.g. 1"
                                            name='maxusecoupone'
                                            value={formData.maxusecoupone}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                        <input type="datetime-local"
                                            name='startDate'
                                            value={formData.startDate}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                        <input type="datetime-local"
                                            name='endDate'
                                            value={formData.endDate}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                            </div>

                            {/* Applicable Products */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Applicable Products & Categories</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Apply To</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            name='apply'
                                            value={formData.apply}
                                            onChange={handleChange}>
                                            <option value="allProduct">All Products</option>
                                            <option value="specificProduct">Specific Products</option>
                                            <option value="specificCategory">Specific Categories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Include Products (comma-separated SKUs)</label>
                                        <input type="text"
                                            name='productSku'
                                            value={formData.productSku}
                                            onChange={handleChange} placeholder="e.g. PRD-0001, PRD-0002" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exclude Products (comma-separated SKUs)</label>
                                        <input type="text" placeholder="e.g. PRD-0005"
                                            name='excludeSku'
                                            value={formData.excludeSku}
                                            onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                    </div>
                                </div>
                            </div>

                            {/* Customer Eligibility */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Customer Eligibility</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Who can use this coupon?</label>
                                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            name='couponUser'
                                            value={formData.couponUser}
                                            onChange={handleChange}>
                                            <option value="AllUser">All Customers</option>
                                            <option value="FirstOrder">First-Time Buyers Only</option>
                                            <option value="specificCustomer">Specific Customers (by email)</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="applayCustomer"
                                            value={formData.applayCustomer}
                                            onChange={handleChange}
                                            placeholder="e.g. test@gmail.com, demo@gmail.com"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand mt-3"
                                        />
                                    </div>
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Combinable with other coupons</p>
                                            <p className="text-xs text-gray-500">Allow customers to stack this with other discount codes</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">{isEditMode ? 'Update Coupon' : 'Save Coupon'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Coupons", value: activeCoupons, color: "text-green-600" },
                    { label: "Total Redemptions", value: totalRedemptions, color: "text-blue-600" },
                    { label: "Revenue Lost to Discounts", value:totalRevenueLost, color: "text-red-600" },
                    { label: "Expired Coupons", value: expiredCoupons, color: "text-gray-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Min Purchase</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand font-mono">
                                        {coupon.couponCode}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {coupon.discountType}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {coupon.discountType === 'Percentage'
                                            ? `${coupon.discountValue}%`
                                            : `₹${coupon.discountValue}`}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        ₹{coupon.minimumPurchase || 0}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {coupon.usedCount || 0} / {coupon.maxLimit || '∞'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {coupon.startDate
                                            ? new Date(coupon.startDate).toLocaleDateString()
                                            : 'No Start'}{' '}
                                        —{' '}
                                        {coupon.endDate
                                            ? new Date(coupon.endDate).toLocaleDateString()
                                            : 'No Expiry'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${coupon.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {coupon.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(coupon)}
                                            className="text-brand text-sm font-semibold hover:underline mr-3"
                                        >
                                            Edit
                                        </button>
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

export default AdminCoupons;
