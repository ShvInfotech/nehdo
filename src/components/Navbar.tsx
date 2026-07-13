import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoHeartOutline, IoBagHandleOutline, IoPersonOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
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
    const { itemCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { isLoggedIn, openAuthModal } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-nav py-3" : "bg-surface py-4"}`}>
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between gap-4">
                    <Link to="/" className="flex-shrink-0 group">
                        <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="NEHDO" className="h-6 md:h-8 object-contain transition-transform group-hover:scale-105" />
                    </Link>
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link key={link.label} to={link.href} className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand transition-colors group">
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand rounded-full transition-all duration-300 group-hover:w-3/4" />
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.form onSubmit={handleSearch} initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="hidden md:block overflow-hidden">
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus className="w-full px-4 py-2 text-sm bg-white border border-muted-border rounded-full focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
                                </motion.form>
                            )}
                        </AnimatePresence>
                        <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-full hover:bg-brand/5 transition-colors" aria-label="Toggle search"><IoSearchOutline size={20} className="text-gray-700" /></button>
                        {isLoggedIn ? (
                            <Link to="/account" className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors" aria-label="Account"><IoPersonOutline size={20} className="text-gray-700" /></Link>
                        ) : (
                            <button onClick={() => openAuthModal('login')} className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors" aria-label="Login"><IoPersonOutline size={20} className="text-gray-700" /></button>
                        )}
                        <Link to="/wishlist" className="hidden md:flex p-2.5 rounded-full hover:bg-brand/5 transition-colors relative" aria-label="Wishlist">
                            <IoHeartOutline size={20} className="text-gray-700" />
                            {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
                        </Link>
                        <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-brand/5 transition-colors" aria-label="Cart">
                            <IoBagHandleOutline size={20} className="text-gray-700" />
                            {itemCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">{itemCount}</motion.span>}
                        </Link>
                        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-full hover:bg-brand/5 transition-colors" aria-label="Open menu"><IoMenuOutline size={22} className="text-gray-700" /></button>
                    </div>
                </div>
                <AnimatePresence>
                    {searchOpen && (
                        <motion.form onSubmit={handleSearch} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden px-4 pb-3">
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus className="w-full px-4 py-2.5 text-sm bg-white border border-muted-border rounded-full focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
                        </motion.form>
                    )}
                </AnimatePresence>
            </nav>
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl lg:hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="NEHDO" className="h-6 object-contain" />
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close menu"><IoCloseOutline size={24} /></button>
                            </div>
                            <div className="flex flex-col py-4">
                                {navLinks.map((link, i) => (
                                    <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                        <Link to={link.href} className="block px-6 py-4 text-base font-medium text-gray-700 hover:text-brand hover:bg-brand/5 transition-colors border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 flex items-center gap-4">
                                {isLoggedIn ? (
                                    <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors"><IoPersonOutline size={18} /> Account</Link>
                                ) : (
                                    <button onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors"><IoPersonOutline size={18} /> Login</button>
                                )}
                                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand transition-colors"><IoHeartOutline size={18} /> Wishlist</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
