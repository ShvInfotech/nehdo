import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { onMessage } from "firebase/messaging";
import { messagingReady, getDeviceToken } from "../services/firebase";
import { apiRequest } from "../services/apiService";
import { Link, NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
    IoGridOutline, IoCubeOutline, IoLayersOutline, IoCartOutline,
    IoPeopleOutline, IoStatsChartOutline, IoSettingsOutline,
    IoMenuOutline, IoLogOutOutline, IoPricetagOutline,
    IoImagesOutline, IoStarOutline, IoChevronDownOutline, IoCloseOutline,
    IoCloseCircleOutline, IoBarChartOutline, IoTicketOutline, IoStorefrontOutline,
    IoOpenOutline,
} from "react-icons/io5";
import { useAdminAuth } from "../context/AdminAuthContext";
import { cx } from "./admin/AdminUI";

type NavItem = { name: string; path: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const sidebarLinks: { title: string; items: NavItem[] }[] = [
    {
        title: "Overview", items: [
            { name: "Dashboard", path: "/admin", icon: IoGridOutline },
        ]
    },
    {
        title: "Sales", items: [
            { name: "Orders", path: "/admin/orders", icon: IoCartOutline },
            { name: "Cancelled Orders", path: "/admin/canceledorders", icon: IoCloseCircleOutline },
            { name: "Customers", path: "/admin/customers", icon: IoPeopleOutline },
        ]
    },
    {
        title: "Catalogue", items: [
            { name: "Products", path: "/admin/products", icon: IoCubeOutline },
            { name: "Categories", path: "/admin/categories", icon: IoLayersOutline },
            { name: "Brands", path: "/admin/brands", icon: IoPricetagOutline },
            { name: "Inventory", path: "/admin/inventory", icon: IoStatsChartOutline },
        ]
    },
    {
        title: "Marketing", items: [
            { name: "Coupons", path: "/admin/coupons", icon: IoTicketOutline },
            { name: "Banners", path: "/admin/banners", icon: IoImagesOutline },
            { name: "Reviews", path: "/admin/reviews", icon: IoStarOutline },
        ]
    },
    {
        title: "Insights & setup", items: [
            { name: "Reports", path: "/admin/reports", icon: IoBarChartOutline },
            { name: "Settings", path: "/admin/settings", icon: IoSettingsOutline },
        ]
    }
];

const allItems = sidebarLinks.flatMap((s) => s.items);

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { adminUser, adminLogout } = useAdminAuth();
    const profileRef = useRef<HTMLDivElement>(null);

    // Register / sync admin device token with backend and listen for new order notifications
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const syncAdminDeviceToken = async () => {
            try {
                const token = await getDeviceToken();
                if (token) {
                    await apiRequest('/user/api/v1/auth/device-token', 'POST', { deviceToken: token }).catch(() => {});
                }
            } catch (err) {
                console.warn("Could not sync admin device token:", err);
            }
        };

        syncAdminDeviceToken();

        // messaging is created asynchronously (and not at all on unsupported browsers)
        let cancelled = false;
        messagingReady.then((m) => {
            if (!m || cancelled) return;
            try {
                unsubscribe = onMessage(m, (payload) => {
                    const title = payload.notification?.title || "🛒 New Order Received!";
                    const body = payload.notification?.body || "A new order has been placed.";
                    toast.info(`${title}: ${body}`, {
                        autoClose: 8000,
                        onClick: () => navigate("/admin/orders")
                    });
                });
            } catch (e) {
                console.warn("FCM foreground listener error:", e);
            }
        });

        return () => {
            cancelled = true;
            if (unsubscribe) unsubscribe();
        };
    }, [navigate]);

    // close drawers on navigation
    useEffect(() => {
        setSidebarOpen(false);
        setProfileDropdown(false);
    }, [location.pathname]);

    // mobile drawer: lock page scroll, Escape closes
    useEffect(() => {
        if (!sidebarOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [sidebarOpen]);

    // profile menu: click outside / Escape closes
    useEffect(() => {
        if (!profileDropdown) return;
        const onDown = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileDropdown(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileDropdown(false);
        document.addEventListener("mousedown", onDown);
        window.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [profileDropdown]);

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login', { replace: true });
    };

    const path = location.pathname.toLowerCase().replace(/\/$/, "") || "/admin";
    const current = allItems.find((i) => i.path === path) || allItems.find((i) => i.path !== "/admin" && path.startsWith(i.path));
    const initial = adminUser?.name?.charAt(0)?.toUpperCase() || "A";

    const sidebar = (
        <div className="flex h-full flex-col bg-brand-dark text-white">
            <div className="flex h-16 shrink-0 items-center justify-between px-5">
                <Link to="/admin" className="flex items-center gap-2.5">
                    <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="Nehdo" className="h-7 w-auto" />
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">Admin</span>
                </Link>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
                    aria-label="Close menu"
                >
                    <IoCloseOutline size={22} />
                </button>
            </div>

            <nav aria-label="Admin" className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4 pt-2">
                {sidebarLinks.map((section) => (
                    <div key={section.title} className="mb-5">
                        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{section.title}</p>
                        <ul className="space-y-0.5">
                            {section.items.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <li key={link.path}>
                                        <NavLink
                                            to={link.path}
                                            end={link.path === "/admin"}
                                            className={({ isActive }) =>
                                                cx(
                                                    "group relative flex min-h-[42px] items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors",
                                                    isActive ? "bg-white/[0.12] text-white" : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent" />}
                                                    <Icon size={18} className={isActive ? "text-accent-light" : "text-white/50 group-hover:text-white/80"} />
                                                    {link.name}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="space-y-0.5 border-t border-white/10 p-3">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[42px] items-center gap-3 rounded-xl px-3 text-[14px] font-medium text-white/65 hover:bg-white/[0.06] hover:text-white"
                >
                    <IoStorefrontOutline size={18} className="text-white/50" />
                    View store
                    <IoOpenOutline size={14} className="ml-auto text-white/40" />
                </a>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-[42px] w-full items-center gap-3 rounded-xl px-3 text-[14px] font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                >
                    <IoLogOutOutline size={18} />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f4f8] font-sans">
            {/* Desktop sidebar */}
            <aside className="hidden w-[260px] shrink-0 lg:block">{sidebar}</aside>

            {/* Mobile drawer */}
            <div className={cx("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!sidebarOpen}>
                <div
                    className={cx("absolute inset-0 bg-brand-dark/50 backdrop-blur-[2px] transition-opacity", sidebarOpen ? "opacity-100" : "opacity-0")}
                    onClick={() => setSidebarOpen(false)}
                />
                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-label="Admin menu"
                    className={cx(
                        "absolute inset-y-0 left-0 w-[86vw] max-w-[300px] shadow-2xl transition-transform duration-300",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    )}
                >
                    {sidebar}
                </aside>
            </div>

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200/70 bg-white/85 px-3 backdrop-blur-md sm:px-6">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <IoMenuOutline size={24} />
                    </button>

                    <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-[17px] font-semibold text-gray-900">{current?.name || "Admin"}</p>
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            type="button"
                            onClick={() => setProfileDropdown((o) => !o)}
                            aria-expanded={profileDropdown}
                            aria-haspopup="menu"
                            className="flex min-h-[44px] items-center gap-2.5 rounded-xl px-2 hover:bg-gray-100"
                        >
                            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-white">
                                {adminUser?.profile ? (
                                    <img src={adminUser.profile} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </span>
                            <span className="hidden text-left sm:block">
                                <span className="block text-[13px] font-semibold text-gray-800">{adminUser?.name || "Admin"}</span>
                                <span className="block text-[11px] text-gray-500">{adminUser?.role || "Administrator"}</span>
                            </span>
                            <IoChevronDownOutline size={14} className={cx("hidden text-gray-400 transition-transform sm:block", profileDropdown && "rotate-180")} />
                        </button>

                        {profileDropdown && (
                            <div role="menu" className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-200/70 bg-white py-1.5 shadow-card-hover">
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <p className="truncate text-sm font-semibold text-gray-900">{adminUser?.name || "Admin"}</p>
                                    <p className="truncate text-xs text-gray-500">{adminUser?.email}</p>
                                </div>
                                <Link to="/admin/settings" role="menuitem" className="flex min-h-[42px] items-center gap-2.5 px-4 text-sm text-gray-700 hover:bg-gray-50">
                                    <IoSettingsOutline size={16} className="text-gray-400" /> Settings
                                </Link>
                                <a href="/" target="_blank" rel="noopener noreferrer" role="menuitem" className="flex min-h-[42px] items-center gap-2.5 px-4 text-sm text-gray-700 hover:bg-gray-50">
                                    <IoStorefrontOutline size={16} className="text-gray-400" /> View store
                                </a>
                                <button type="button" role="menuitem" onClick={handleLogout} className="flex min-h-[42px] w-full items-center gap-2.5 px-4 text-left text-sm text-rose-600 hover:bg-rose-50">
                                    <IoLogOutOutline size={16} /> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
