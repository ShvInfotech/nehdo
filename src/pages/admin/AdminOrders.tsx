import React, { useState } from "react";
import { IoSearchOutline, IoChevronBackOutline, IoPrintOutline, IoMailOutline, IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

const initialOrders = [
    { id: "#ORD-001", name: "Rahul Patel", email: "rahul.p@example.com", phone: "+91 98765 43210", date: "Today, 10:23 AM", amount: "₹4,299", items: 2, status: "Pending", payment: "UPI", paymentStatus: "Paid", txnId: "TXN_9876543210" },
    { id: "#ORD-002", name: "Priya Singh", email: "priya.s@example.com", phone: "+91 87654 32109", date: "Today, 09:14 AM", amount: "₹1,499", items: 1, status: "Pending", payment: "Card", paymentStatus: "Paid", txnId: "TXN_8765432109" },
    { id: "#ORD-003", name: "Amit Kumar", email: "amit.k@example.com", phone: "+91 76543 21098", date: "Yesterday, 4:30 PM", amount: "₹8,999", items: 3, status: "Delivered", payment: "COD", paymentStatus: "Collected", txnId: "—" },
    { id: "#ORD-004", name: "Neha Sharma", email: "neha.sharma@example.com", phone: "+91 65432 10987", date: "Yesterday, 2:15 PM", amount: "₹2,150", items: 1, status: "Cancelled", payment: "UPI", paymentStatus: "Refunded", txnId: "TXN_6543210987" },
    { id: "#ORD-005", name: "Vikram Desai", email: "vikram.d@example.com", phone: "+91 54321 09876", date: "12 Jul, 11:00 AM", amount: "₹3,850", items: 2, status: "Pending", payment: "Netbanking", paymentStatus: "Pending", txnId: "—" },
];

const statusFlow = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Completed"];

const getStatusColor = (status: string) => {
    switch(status) {
        case "Completed": case "Delivered": return "bg-green-100 text-green-700";
        case "Processing": case "Confirmed": case "Shipped": return "bg-blue-100 text-blue-700";
        case "Pending": return "bg-orange-100 text-orange-700";
        case "Cancelled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

const AdminOrders = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const [printModalData, setPrintModalData] = useState<typeof orders | null>(null);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedIds(orders.map(o => o.id));
        else setSelectedIds([]);
    };

    const handleBulkAccept = () => {
        setOrders(prev => prev.map(o => selectedIds.includes(o.id) && o.status === "Pending" ? { ...o, status: "Processing" } : o));
        setSelectedIds([]);
        alert(`${selectedIds.length} orders accepted and moved to Processing!`);
    };

    if (printModalData) {
        return (
            <div className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto print:bg-white print:p-0">
                <div className="p-4 flex justify-between items-center bg-white shadow-sm sticky top-0 print:hidden">
                    <div>
                        <h2 className="text-xl font-bold">Print Shipping Labels</h2>
                        <p className="text-sm text-gray-500">{printModalData.length} labels generated.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="px-6 py-2 bg-brand text-white font-bold rounded-lg shadow hover:bg-brand-light flex items-center gap-2">
                            <IoPrintOutline size={20} /> Print Labels
                        </button>
                        <button onClick={() => setPrintModalData(null)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">
                            Close
                        </button>
                    </div>
                </div>

                <div className="p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:max-w-none print:space-y-0">
                    {printModalData.map((order, index) => {
                        const orderIdRaw = order.id.replace('#', '');
                        const awb = `FMPC${Math.floor(Math.random() * 10000000000)}`;
                        return (
                            <div key={order.id} className="bg-white mx-auto w-[4in] h-[6in] p-2 print:w-[4in] print:h-[6in] print:page-break-after-always print:p-2 box-border">
                                <div className="w-full h-full border-[2px] border-black flex flex-col font-sans text-black overflow-hidden relative box-border">
                                    {/* Header */}
                                    <div className="flex border-b-[2px] border-black h-12">
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex border-b-[2px] border-black px-1 py-0.5 items-end">
                                                <span className="font-bold text-lg leading-none mr-2">STD</span>
                                                <span className="text-xs leading-none">E-Kart Logistics</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="flex-1 px-1 text-sm font-medium">OD{Math.floor(Math.random() * 1000000000000000000)}</span>
                                                <span className="font-bold text-sm px-2 border-l-[2px] border-black text-indigo-900 leading-none py-1 h-full flex items-center">{order.payment === 'COD' ? 'COD' : 'PREPAID'}</span>
                                            </div>
                                        </div>
                                        <div className="w-8 border-l-[2px] border-black flex items-center justify-center font-bold text-2xl">
                                            E
                                        </div>
                                    </div>

                                    {/* Main Body */}
                                    <div className="flex flex-1 overflow-hidden">
                                        {/* Left Vertical Column */}
                                        <div className="w-10 border-r-[2px] border-black flex flex-col items-center pt-1 pb-1 relative">
                                            <span className="text-[9px] leading-tight text-center">Ordered through</span>
                                            <span className="font-bold text-[14px] leading-tight italic tracking-tighter">Flipkart</span>
                                            <div className="w-5 h-5 bg-black text-white text-xs font-serif italic flex items-center justify-center rounded-sm mt-0.5">f</div>
                                            
                                            <div className="flex-1 relative w-full">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 flex flex-col items-center">
                                                    <Barcode value={awb} height={25} width={1} displayValue={false} margin={0} />
                                                    <span className="text-[10px] font-bold mt-1 tracking-wider whitespace-nowrap">AWB No. {awb}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto flex flex-col items-start w-full px-1 space-y-1">
                                                <span className="text-[8px] transform -rotate-90 origin-left translate-x-4 mb-16 whitespace-nowrap text-gray-700">(N) NAG/WDI</span>
                                                <div className="text-[10px] leading-tight">
                                                    <span className="text-indigo-900 border-b border-indigo-900">HBD:</span> 25 - 10<br/>
                                                    <span className="text-indigo-900 border-b border-indigo-900">CPD:</span> 04 - 11
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Content Area */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            {/* QR Code Area */}
                                            <div className="flex-1 flex items-center justify-center p-4">
                                                <QRCode value={`https://nehdo.com/track/${awb}`} size={160} level="M" />
                                            </div>
                                            
                                            {/* Address Area */}
                                            <div className="border-t-[2px] border-black p-1 text-[11px] leading-tight h-[85px] overflow-hidden">
                                                <span className="font-medium">Shipping/Customer address:</span><br/>
                                                Name: <span className="text-[13px]">{order.name},</span><br/>
                                                123 Fashion Street, Apt 4B, Andheri West, Near Metro Station,<br/>
                                                Mumbai - <span className="font-bold text-[13px]">400058</span>, IN-MH<br/>
                                                Phone: {order.phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sold By */}
                                    <div className="border-t-[2px] border-black p-1 text-[9px] leading-[1.1] h-[45px] overflow-hidden">
                                        Sold By:<span className="font-bold">M/s NEHDO Retail Ventures,</span> PHOENIX MILLS COMPOUND, SENAPATI BAPAT MARG, LOWER PAREL, MUMBAI, MAHARASHTRA - 400013<br/>
                                        <span className="text-indigo-900 border-b border-indigo-900 inline-block mt-0.5">GSTIN:</span> 27AAIFU3374R1ZO
                                    </div>

                                    {/* Items Table */}
                                    <div className="border-t-[2px] border-black flex flex-col min-h-[50px]">
                                        <div className="flex border-b-[2px] border-black font-bold text-[10px] bg-gray-100">
                                            <div className="flex-1 px-1 border-r-[2px] border-black text-center">SKU ID | Description</div>
                                            <div className="w-8 px-1 text-center">QTY</div>
                                        </div>
                                        <div className="flex text-[9px] flex-1">
                                            <div className="flex-1 px-1 border-r-[2px] border-black leading-tight py-0.5">
                                                1 | PRD-{orderIdRaw} | Premium Quality Apparel Size M | Color: Black
                                            </div>
                                            <div className="w-8 px-1 text-center py-0.5">{order.items}</div>
                                        </div>
                                    </div>

                                    {/* Bottom Barcode Area */}
                                    <div className="border-t-[2px] border-black p-1 relative h-20">
                                        <p className="text-[11px] mb-1 leading-none font-medium">{awb}</p>
                                        <Barcode value={awb} height={40} width={1.5} displayValue={false} margin={0} />
                                        
                                        {/* B4 Box */}
                                        <div className="absolute right-1 bottom-1 w-16 h-12 border-[2px] border-black flex items-center justify-center">
                                            <span className="font-black text-2xl">B4</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t-[2px] border-black flex justify-between px-1 items-end h-5 text-[10px] font-bold pb-0.5 bg-gray-50">
                                        <span>Not for resale.</span>
                                        <span>Printed at {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '')} hrs, {new Date().toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (selectedOrder) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <IoChevronBackOutline size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-heading text-2xl font-bold text-gray-900">Order {selectedOrder.id}</h1>
                        <p className="text-sm text-gray-500 mt-1">Placed on {selectedOrder.date}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setPrintModalData([selectedOrder])} className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-light shadow-sm">
                            <IoPrintOutline size={18} />
                            Print Label
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50">
                            <IoMailOutline size={18} />
                            Send Email
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Update */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                {statusFlow.map((s, i) => {
                                    const currentIdx = statusFlow.indexOf(selectedOrder.status);
                                    const isPast = i <= currentIdx;
                                    const isCurrent = s === selectedOrder.status;
                                    return (
                                        <React.Fragment key={s}>
                                            {i > 0 && <div className={`h-0.5 w-8 flex-shrink-0 ${isPast ? 'bg-brand' : 'bg-gray-200'}`}></div>}
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                                                isCurrent ? 'bg-brand text-white' : isPast ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {isPast && <IoCheckmarkCircleOutline size={14} />}
                                                {s}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Product</th>
                                            <th className="px-6 py-3 text-left">Variant</th>
                                            <th className="px-6 py-3 text-center">Qty</th>
                                            <th className="px-6 py-3 text-right">Unit Price</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100"></div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Yves Saint Laurent Tee</p>
                                                        <p className="text-xs text-gray-500">SKU: PRD-0001</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">White / L</td>
                                            <td className="px-6 py-4 text-center">1</td>
                                            <td className="px-6 py-4 text-right">₹2,499.00</td>
                                            <td className="px-6 py-4 text-right font-semibold">₹2,499.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Price Breakdown */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="max-w-xs ml-auto space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">{selectedOrder.amount}</span></div>
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-between text-base font-bold"><span>Grand Total</span><span>{selectedOrder.amount}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h2>
                            <div className="space-y-3">
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Name</p><p className="text-sm font-medium text-gray-900">{selectedOrder.name}</p></div>
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Email</p><p className="text-sm font-medium text-brand">{selectedOrder.email}</p></div>
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Phone</p><p className="text-sm font-medium text-gray-900">{selectedOrder.phone}</p></div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Info</h2>
                            <div className="space-y-3">
                                <div><p className="text-xs font-semibold text-gray-400 uppercase">Method</p><p className="text-sm font-medium text-gray-900">{selectedOrder.payment}</p></div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Payment Status</p>
                                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'Collected' ? 'bg-green-100 text-green-700' :
                                        selectedOrder.paymentStatus === 'Refunded' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                    }`}>{selectedOrder.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track customer orders.</p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                        <>
                            <button 
                                onClick={handleBulkAccept}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-green-700"
                            >
                                Bulk Accept ({selectedIds.length})
                            </button>
                            <button 
                                onClick={() => setPrintModalData(orders.filter(o => selectedIds.includes(o.id)))}
                                className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-light flex items-center gap-2"
                            >
                                <IoPrintOutline size={16} /> Print Labels
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by order ID, customer..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.length === orders.length && orders.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" 
                                    />
                                </th>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleSelection(order.id)}>
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(order.id)}
                                            onChange={() => toggleSelection(order.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" 
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-brand">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{order.name}</p>
                                        <p className="text-xs text-gray-500">{order.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.items}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <button className="text-brand text-sm font-semibold hover:underline" onClick={() => setSelectedOrder(order)}>View</button>
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

export default AdminOrders;
