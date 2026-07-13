import React, { useState } from "react";
import { IoSearchOutline, IoFilterOutline, IoEllipsisVertical, IoStarOutline, IoStar, IoCheckmarkOutline, IoCloseOutline, IoTrashOutline } from "react-icons/io5";

const mockReviews = [
    { name: "Rahul Patel", product: "Yves Saint Laurent Tee", rating: 5, review: "Excellent quality and perfect fit! The fabric is very soft and comfortable. Will definitely buy more from NEHDO.", date: "12 Jul 2026", status: "Approved", verified: true },
    { name: "Priya Singh", product: "Gucci Classic Polo", rating: 4, review: "Very good quality, but shipping was a bit late. Product itself is amazing.", date: "11 Jul 2026", status: "Approved", verified: true },
    { name: "Amit Kumar", product: "Prada Elite Jacket", rating: 5, review: "Absolutely love this jacket. Premium quality and looks exactly like the picture.", date: "10 Jul 2026", status: "Pending", verified: true },
    { name: "Unknown User", product: "Dior Summer Dress", rating: 1, review: "Terrible fake product spam!!!", date: "09 Jul 2026", status: "Rejected", verified: false },
    { name: "Sneha Reddy", product: "Versace Cotton Tee", rating: 3, review: "Decent product but not worth the price. Stitching could be better.", date: "08 Jul 2026", status: "Pending", verified: true },
];

const AdminReviews = () => {
    const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product reviews submitted by customers.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-50 text-green-600 text-sm font-semibold rounded-lg hover:bg-green-100 border border-green-200">Approve All Pending</button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">4.3</p>
                    <div className="flex justify-center text-yellow-400 mt-1">
                        {[1,2,3,4].map(i => <IoStar key={i} size={14} />)}
                        <IoStarOutline size={14} className="text-gray-300" />
                    </div>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Average Rating</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Total Reviews</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Pending</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">148</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Approved</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Rejected</p>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Rating Distribution</h2>
                <div className="space-y-2">
                    {[
                        { stars: 5, count: 87, pct: 56 },
                        { stars: 4, count: 42, pct: 27 },
                        { stars: 3, count: 15, pct: 10 },
                        { stars: 2, count: 8, pct: 5 },
                        { stars: 1, count: 4, pct: 2 },
                    ].map(row => (
                        <div key={row.stars} className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700 w-6">{row.stars}★</span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-500 w-16 text-right">{row.count} ({row.pct}%)</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Detail Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
                            <button onClick={() => setSelectedReview(null)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"><IoCloseOutline size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{selectedReview.name}</p>
                                    <p className="text-xs text-gray-500">{selectedReview.date}</p>
                                </div>
                                {selectedReview.verified && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">✓ Verified Purchase</span>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Product</p>
                                <p className="font-medium text-gray-900">{selectedReview.product}</p>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, j) => (
                                    j < selectedReview.rating ? <IoStar key={j} size={20} /> : <IoStarOutline key={j} size={20} className="text-gray-300" />
                                ))}
                                <span className="ml-2 text-sm font-semibold text-gray-700">{selectedReview.rating}/5</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-700 leading-relaxed">{selectedReview.review}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Reply</label>
                                <textarea rows={3} placeholder="Write a reply to this review..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                    <option>Pending</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                    <option>Spam</option>
                                </select>
                            </div>
                            {selectedReview.status === 'Rejected' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason</label>
                                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                        <option>Spam</option>
                                        <option>Inappropriate Language</option>
                                        <option>Fake Review</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white z-10">
                            <button className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded-xl">
                                <IoTrashOutline size={16} /> Delete Review
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedReview(null)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search reviews..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Ratings</option>
                            <option>5 Stars</option>
                            <option>4 Stars</option>
                            <option>3 Stars</option>
                            <option>2 Stars</option>
                            <option>1 Star</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" /></th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Review</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockReviews.map((review, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedReview(review)}>
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{review.name}</span>
                                            {review.verified && <span className="text-green-500 text-xs">✓</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{review.product}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, j) => (
                                                j < review.rating ? <IoStar key={j} size={14} /> : <IoStarOutline key={j} size={14} className="text-gray-300" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{review.review}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{review.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            review.status === "Approved" ? "bg-green-100 text-green-700" : 
                                            review.status === "Pending" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                                        }`}>{review.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Approve"><IoCheckmarkOutline size={16} /></button>
                                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Reject"><IoCloseOutline size={16} /></button>
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

export default AdminReviews;
