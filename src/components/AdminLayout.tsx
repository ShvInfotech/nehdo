import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
    IoGridOutline, IoCubeOutline, IoLayersOutline, IoCartOutline, 
    IoPeopleOutline, IoStatsChartOutline, IoSettingsOutline, 
    IoMenuOutline, IoLogOutOutline, IoPricetagOutline, IoDocumentTextOutline,
    IoImagesOutline, IoStarOutline, IoAirplaneOutline, IoCardOutline,
    IoCalculatorOutline, IoChevronDownOutline
} from "react-icons/io5";
import { useAdminAuth } from "../context/AdminAuthContext";

const sidebarLinks = [
    { title: "Overview", items: [
        { name: "Dashboard", path: "/admin", icon: IoGridOutline },
    ]},
    { title: "E-Commerce", items: [
        { name: "Products", path: "/admin/products", icon: IoCubeOutline },
        { name: "Categories", path: "/admin/categories", icon: IoLayersOutline },
        { name: "Orders", path: "/admin/orders", icon: IoCartOutline },
        { name: "Customers", path: "/admin/customers", icon: IoPeopleOutline },
        { name: "Inventory", path: "/admin/inventory", icon: IoStatsChartOutline },
    ]},
    { title: "Marketing & Content", items: [
        { name: "Coupons", path: "/admin/coupons", icon: IoPricetagOutline },
        { name: "CMS Pages", path: "/admin/cms", icon: IoDocumentTextOutline },
        { name: "Banners", path: "/admin/banners", icon: IoImagesOutline },
        { name: "Reviews", path: "/admin/reviews", icon: IoStarOutline },
    ]},
    { title: "Configuration", items: [
        { name: "Shipping", path: "/admin/shipping", icon: IoAirplaneOutline },
        { name: "Payment", path: "/admin/payment", icon: IoCardOutline },
        { name: "Tax / GST", path: "/admin/tax", icon: IoCalculatorOutline },
        { name: "Reports", path: "/admin/reports", icon: IoStatsChartOutline },
        { name: "Settings", path: "/admin/settings", icon: IoSettingsOutline },
    ]}
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { adminUser, adminLogout } = useAdminAuth();

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/images/nehdo-logo.png" alt="NEHDO" className="h-6" />
                        <span className="font-heading font-bold text-xs uppercase tracking-widest text-brand mt-1 border-l pl-2 border-gray-300">Admin</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                    {sidebarLinks.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isActive 
                                                    ? "bg-brand/10 text-brand" 
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                        >
                                            <Icon size={18} className={isActive ? "text-brand" : "text-gray-400"} />
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                        <IoLogOutOutline size={18} className="text-gray-400" />
                        Back to Store
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <IoLogOutOutline size={18} className="text-red-400" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                        <IoMenuOutline size={24} />
                    </button>

                    <div className="flex-1" />

                    <div className="relative">
                        <button 
                            onClick={() => setProfileDropdown(!profileDropdown)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                                {adminUser?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <span className="text-sm font-semibold text-gray-700 block">{adminUser?.name || 'Admin User'}</span>
                                <span className="text-xs text-gray-400 block">{adminUser?.role || 'Super Admin'}</span>
                            </div>
                            <IoChevronDownOutline size={14} className="text-gray-400 hidden sm:block" />
                        </button>

                        {profileDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{adminUser?.name}</p>
                                        <p className="text-xs text-gray-500">{adminUser?.email}</p>
                                    </div>
                                    <Link 
                                        to="/admin/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setProfileDropdown(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
