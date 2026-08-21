import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoSearchOutline,
    IoHeartOutline,
    IoBagHandleOutline,
    IoPersonOutline,
    IoMenuOutline,
    IoCloseOutline,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/shop" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/faq" },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { itemCount, cartCount } = useCart();
    const { count: wishlistCount } = useWishlist();

    const {
        isLoggedIn,
        user,
        openAuthModal,
    } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow =
            mobileMenuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    // ================================
    // PROFILE COMPLETION CHECK
    // ================================

    const isProfileComplete = () => {
        if (!user) return false;

        const phone = String(user.phone || "").trim();

        const hasMobileNumber = phone.length > 0;

        const addresses = Array.isArray(user.address)
            ? user.address
            : [];

        const hasDefaultAddress = addresses.some(
            (address: any) =>
                address?.defaultaddress === true ||
                address?.defaultaddress === "true"
        );

        return hasMobileNumber && hasDefaultAddress;
    };

    // ================================
    // PROTECTED NAVIGATION
    // ================================

  const handleProtectedNavigation = (path: string) => {
    setMobileMenuOpen(false);

    // 🔓 User NOT logged in
    // Normal navigation allow karo
    if (!isLoggedIn || !user) {
        navigate(path);
        return;
    }

    // 🔒 User logged in
    // Mobile + default address check
    const phone = String(user.phone || "").trim();

    const hasMobileNumber = phone.length > 0;

    const addresses = Array.isArray(user.address)
        ? user.address
        : [];

    const hasDefaultAddress = addresses.some(
        (address: any) =>
            address?.defaultaddress === true ||
            address?.defaultaddress === "true"
    );

    // Profile incomplete
    if (!hasMobileNumber || !hasDefaultAddress) {
        // Account page itself allow
        if (path === "/account") {
            navigate(path);
            return;
        }

        navigate("/account");
        return;
    }

    // Profile complete
    navigate(path);
};

    // ================================
    // SEARCH
    // ================================

    const handleSearch = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            navigate(
                `/search?q=${encodeURIComponent(
                    searchQuery.trim()
                )}`
            );

            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "glass shadow-nav py-3"
                        : "bg-surface py-4"
                }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between gap-4">

                    {/* LOGO */}

                    <button
                        onClick={() =>
                            handleProtectedNavigation("/")
                        }
                        className="flex-shrink-0 group"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`}
                            alt="NEHDO"
                            className="h-6 md:h-8 object-contain transition-transform group-hover:scale-105"
                        />
                    </button>

                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                type="button"
                                onClick={() =>
                                    handleProtectedNavigation(
                                        link.href
                                    )
                                }
                                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand transition-colors group"
                            >
                                {link.label}

                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand rounded-full transition-all duration-300 group-hover:w-3/4" />
                            </button>
                        ))}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 md:gap-3">

                        {/* SEARCH */}

                        <AnimatePresence>
                            {searchOpen && (
                                <motion.form
                                    onSubmit={handleSearch}
                                    initial={{
                                        width: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        width: 220,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        width: 0,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.3,
                                    }}
                                    className="hidden md:block overflow-hidden"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search products..."
                                        autoFocus
                                        className="w-full px-4 py-2 text-sm bg-white border border-muted-border rounded-full focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <button
                            type="button"
                            onClick={() =>
                                setSearchOpen(!searchOpen)
                            }
                            className="p-2.5 rounded-full hover:bg-brand/5 transition-colors"
                            aria-label="Toggle search"
                        >
                            <IoSearchOutline
                                size={20}
                                className="text-gray-700"
                            />
                        </button>

                        {/* ACCOUNT */}

                        {isLoggedIn ? (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/account")
                                }
                                className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors"
                                aria-label="Account"
                            >
                                <IoPersonOutline
                                    size={20}
                                    className="text-gray-700"
                                />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    openAuthModal("login")
                                }
                                className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors"
                                aria-label="Login"
                            >
                                <IoPersonOutline
                                    size={20}
                                    className="text-gray-700"
                                />
                            </button>
                        )}

                        {/* WISHLIST */}

                        <button
                            type="button"
                            onClick={() =>
                                handleProtectedNavigation(
                                    "/wishlist"
                                )
                            }
                            className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors relative"
                            aria-label="Wishlist"
                        >
                            <IoHeartOutline
                                size={20}
                                className="text-gray-700"
                            />

                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* CART */}

                        <button
                            type="button"
                            onClick={() =>
                                handleProtectedNavigation("/cart")
                            }
                            className="relative p-2.5 rounded-full hover:bg-brand/5 transition-colors"
                            aria-label="Cart"
                        >
                            <IoBagHandleOutline
                                size={20}
                                className="text-gray-700"
                            />

                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </button>

                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(true)
                            }
                            className="lg:hidden p-2.5 rounded-full hover:bg-brand/5 transition-colors"
                            aria-label="Open menu"
                        >
                            <IoMenuOutline
                                size={22}
                                className="text-gray-700"
                            />
                        </button>
                    </div>
                </div>

                {/* MOBILE SEARCH */}

                <AnimatePresence>
                    {searchOpen && (
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{
                                height: 0,
                                opacity: 0,
                            }}
                            animate={{
                                height: "auto",
                                opacity: 1,
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                            }}
                            className="md:hidden overflow-hidden px-4 pb-3"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                placeholder="Search products..."
                                autoFocus
                                className="w-full px-4 py-2.5 text-sm bg-white border border-muted-border rounded-full focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                            />
                        </motion.form>
                    )}
                </AnimatePresence>
            </nav>

            {/* MOBILE MENU */}

            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl lg:hidden"
                        >
                            {/* MOBILE HEADER */}

                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <img
                                    src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`}
                                    alt="NEHDO"
                                    className="h-6 object-contain"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <IoCloseOutline size={24} />
                                </button>
                            </div>

                            {/* MOBILE LINKS */}

                            <div className="flex flex-col py-4">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{
                                            opacity: 0,
                                            x: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            delay: i * 0.05,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleProtectedNavigation(
                                                    link.href
                                                )
                                            }
                                            className="block w-full text-left px-6 py-4 text-base font-medium text-gray-700 hover:text-brand hover:bg-brand/5 transition-colors border-b border-gray-50"
                                        >
                                            {link.label}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* MOBILE BOTTOM */}

                            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 flex items-center gap-4">

                                {/* ACCOUNT */}

                                {isLoggedIn ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate("/account");
                                        }}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand"
                                    >
                                        <IoPersonOutline size={18} />
                                        Account
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            openAuthModal("login");
                                        }}
                                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand"
                                    >
                                        <IoPersonOutline size={18} />
                                        Login
                                    </button>
                                )}

                                {/* WISHLIST */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleProtectedNavigation(
                                            "/wishlist"
                                        )
                                    }
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand"
                                >
                                    <IoHeartOutline size={18} />
                                    Wishlist
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;