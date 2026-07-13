import React, { useState } from "react";
import { IoCloudDownloadOutline, IoCalendarOutline, IoStatsChartOutline, IoTrendingUpOutline, IoTrendingDownOutline } from "react-icons/io5";

const AdminReports = () => {
    const [dateRange, setDateRange] = useState('7d');
    const [activeReport, setActiveReport] = useState('sales');

    const reportTabs = [
        { key: 'sales', label: 'Sales Report' },
        { key: 'products', label: 'Product Performance' },
        { key: 'customers', label: 'Customer Analytics' },
        { key: 'traffic', label: 'Traffic & Conversions' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Track performance, sales, and growth insights.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                        <IoCloudDownloadOutline size={18} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                        <IoCloudDownloadOutline size={18} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Date Range */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-1">
                    {[
                        { key: 'today', label: 'Today' },
                        { key: '7d', label: 'Last 7 Days' },
                        { key: '30d', label: 'Last 30 Days' },
                        { key: '90d', label: 'Last 90 Days' },
                        { key: 'year', label: 'This Year' },
                    ].map(range => (
                        <button 
                            key={range.key} 
                            onClick={() => setDateRange(range.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${dateRange === range.key ? 'bg-brand text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >{range.label}</button>
                    ))}
                </div>
                <div className="flex gap-2 items-center">
                    <input type="date" className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand" />
                    <span className="text-gray-400">to</span>
                    <input type="date" className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand" />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: "₹3,45,280", change: "+12.5%", up: true, icon: IoStatsChartOutline },
                    { label: "Total Orders", value: "456", change: "+8.2%", up: true, icon: IoCalendarOutline },
                    { label: "Average Order Value", value: "₹757", change: "+3.1%", up: true, icon: IoTrendingUpOutline },
                    { label: "Refund Rate", value: "2.3%", change: "-0.5%", up: false, icon: IoTrendingDownOutline },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <kpi.icon size={20} className="text-gray-400" />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {kpi.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className="text-xs text-gray-500 font-semibold mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* Report Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 flex gap-1 overflow-x-auto">
                    {reportTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveReport(tab.key)}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                activeReport === tab.key ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >{tab.label}</button>
                    ))}
                </div>

                {activeReport === 'sales' && (
                    <div className="p-6">
                        {/* Sales Chart Placeholder */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center mb-6">
                            <div className="flex items-end justify-center gap-2 h-40">
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                        <div className="w-full bg-brand/70 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        <span className="text-[10px] text-gray-400">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-4 font-semibold">Monthly Revenue (₹)</p>
                        </div>

                        {/* Sales Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Orders</th>
                                        <th className="px-6 py-3 text-left">Gross Sales</th>
                                        <th className="px-6 py-3 text-left">Discounts</th>
                                        <th className="px-6 py-3 text-left">Shipping</th>
                                        <th className="px-6 py-3 text-left">Tax</th>
                                        <th className="px-6 py-3 text-left">Net Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { date: "13 Jul 2026", orders: 23, gross: "₹48,500", discounts: "₹3,200", shipping: "₹1,150", tax: "₹7,650", net: "₹53,100" },
                                        { date: "12 Jul 2026", orders: 18, gross: "₹35,200", discounts: "₹2,100", shipping: "₹900", tax: "₹5,800", net: "₹39,800" },
                                        { date: "11 Jul 2026", orders: 21, gross: "₹42,800", discounts: "₹4,500", shipping: "₹1,050", tax: "₹6,900", net: "₹46,250" },
                                        { date: "10 Jul 2026", orders: 15, gross: "₹28,900", discounts: "₹1,800", shipping: "₹750", tax: "₹4,600", net: "₹32,450" },
                                        { date: "09 Jul 2026", orders: 27, gross: "₹55,100", discounts: "₹5,200", shipping: "₹1,350", tax: "₹8,800", net: "₹60,050" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium">{row.date}</td>
                                            <td className="px-6 py-3">{row.orders}</td>
                                            <td className="px-6 py-3 font-medium">{row.gross}</td>
                                            <td className="px-6 py-3 text-red-500">-{row.discounts}</td>
                                            <td className="px-6 py-3">{row.shipping}</td>
                                            <td className="px-6 py-3">{row.tax}</td>
                                            <td className="px-6 py-3 font-bold text-green-600">{row.net}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeReport === 'products' && (
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Product</th>
                                        <th className="px-6 py-3 text-left">Units Sold</th>
                                        <th className="px-6 py-3 text-left">Revenue</th>
                                        <th className="px-6 py-3 text-left">Return Rate</th>
                                        <th className="px-6 py-3 text-left">Avg Rating</th>
                                        <th className="px-6 py-3 text-left">Views</th>
                                        <th className="px-6 py-3 text-left">Conversion</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { name: "Yves Saint Laurent Tee", sold: 145, revenue: "₹2,89,000", returns: "1.4%", rating: "4.8", views: 3200, conversion: "4.5%" },
                                        { name: "Gucci Classic Polo", sold: 98, revenue: "₹1,76,400", returns: "2.0%", rating: "4.5", views: 2100, conversion: "4.7%" },
                                        { name: "Prada Elite Jacket", sold: 67, revenue: "₹3,01,500", returns: "3.0%", rating: "4.3", views: 1800, conversion: "3.7%" },
                                        { name: "Dior Summer Dress", sold: 82, revenue: "₹2,05,000", returns: "1.2%", rating: "4.7", views: 2400, conversion: "3.4%" },
                                        { name: "Versace Cotton Tee", sold: 120, revenue: "₹1,44,000", returns: "0.8%", rating: "4.6", views: 2800, conversion: "4.3%" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-900">{row.name}</td>
                                            <td className="px-6 py-3">{row.sold}</td>
                                            <td className="px-6 py-3 font-medium">{row.revenue}</td>
                                            <td className="px-6 py-3 text-gray-500">{row.returns}</td>
                                            <td className="px-6 py-3 text-yellow-600 font-semibold">⭐ {row.rating}</td>
                                            <td className="px-6 py-3 text-gray-500">{row.views.toLocaleString()}</td>
                                            <td className="px-6 py-3 text-green-600 font-semibold">{row.conversion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeReport === 'customers' && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">2,456</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Total Customers</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">342</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">New This Month</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">38%</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Repeat Rate</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-purple-600">₹1,850</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Avg CLV</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Customer Segment</th>
                                        <th className="px-6 py-3 text-left">Count</th>
                                        <th className="px-6 py-3 text-left">Revenue Share</th>
                                        <th className="px-6 py-3 text-left">Avg Orders</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">VIP (10+ orders)</td><td className="px-6 py-3">89</td><td className="px-6 py-3 text-green-600 font-semibold">42%</td><td className="px-6 py-3">14.2</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Regular (3-9 orders)</td><td className="px-6 py-3">456</td><td className="px-6 py-3 text-blue-600 font-semibold">35%</td><td className="px-6 py-3">5.1</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">New (1-2 orders)</td><td className="px-6 py-3">1,234</td><td className="px-6 py-3 text-gray-600 font-semibold">18%</td><td className="px-6 py-3">1.3</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Dormant (no order 90d+)</td><td className="px-6 py-3">677</td><td className="px-6 py-3 text-red-500 font-semibold">5%</td><td className="px-6 py-3">2.1</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeReport === 'traffic' && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">24,500</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Total Visitors</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">3.2%</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Conversion Rate</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">45%</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Cart Abandonment</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-purple-600">3:42</p>
                                <p className="text-xs text-gray-500 font-semibold mt-1">Avg Session Time</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Traffic Source</th>
                                        <th className="px-6 py-3 text-left">Visitors</th>
                                        <th className="px-6 py-3 text-left">Orders</th>
                                        <th className="px-6 py-3 text-left">Revenue</th>
                                        <th className="px-6 py-3 text-left">Conversion</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Direct</td><td className="px-6 py-3">8,200</td><td className="px-6 py-3">180</td><td className="px-6 py-3">₹1,35,400</td><td className="px-6 py-3 text-green-600 font-semibold">2.2%</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Google Organic</td><td className="px-6 py-3">6,500</td><td className="px-6 py-3">120</td><td className="px-6 py-3">₹95,600</td><td className="px-6 py-3 text-green-600 font-semibold">1.8%</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Instagram</td><td className="px-6 py-3">4,800</td><td className="px-6 py-3">95</td><td className="px-6 py-3">₹68,200</td><td className="px-6 py-3 text-green-600 font-semibold">2.0%</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Google Ads</td><td className="px-6 py-3">3,200</td><td className="px-6 py-3">85</td><td className="px-6 py-3">₹64,800</td><td className="px-6 py-3 text-green-600 font-semibold">2.7%</td></tr>
                                    <tr className="hover:bg-gray-50"><td className="px-6 py-3 font-medium">Facebook</td><td className="px-6 py-3">1,800</td><td className="px-6 py-3">28</td><td className="px-6 py-3">₹21,200</td><td className="px-6 py-3 text-green-600 font-semibold">1.6%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
