import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    IoSearchOutline,
    IoHeartOutline,
    IoBagHandleOutline,
    IoPersonOutline,
    IoMenuOutline,
    IoCloseOutline,
    IoChevronDownOutline,
    IoHomeOutline,
    IoGridOutline,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

// ─── NAV STRUCTURE ───────────────────────────────────────────
interface NavChild { label: string; href: string; }
interface NavLink  { label: string; href: string; children?: NavChild[]; }

const NAV_LINKS: NavLink[] = [
    {
        label: "Shop",
        href: "/shop",
        children: [
            { label: "All products",  href: "/shop" },
            { label: "New arrivals",  href: "/shop?filter=new" },
            { label: "Bestsellers",   href: "/shop?filter=trending" },
            { label: "On sale",       href: "/shop?filter=sale" },
        ],
    },
    {
        label: "By need",
        href: "/shop",
        children: [
            { label: "For her",       href: "/collection/women" },
            { label: "For him",       href: "/collection/men" },
            { label: "For couples",   href: "/collection/couples" },
            { label: "Wellness",      href: "/collection/wellness" },
        ],
    },
    { label: "About", href: "/about" },
    { label: "Help",  href: "/faq" },
];

// ─── DESKTOP DROPDOWN ────────────────────────────────────────
const NavDropdown: React.FC<{
    link: NavLink;
    onNav: (href: string) => void;
}> = ({ link, onNav }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--ink)",
                    background: "transparent",
                    border: "none",
                    padding: "6px 0",
                    cursor: "pointer",
                    transition: "color 150ms ease",
                    letterSpacing: "0",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
            >
                {link.label}
                <IoChevronDownOutline
                    size={12}
                    style={{
                        transition: "transform 200ms ease",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: "absolute",
                            top: "calc(100% + 12px)",
                            left: "0",
                            width: "200px",
                            backgroundColor: "var(--paper)",
                            border: "1px solid var(--hairline)",
                            borderRadius: "2px",
                            overflow: "hidden",
                            zIndex: 100,
                        }}
                    >
                        {link.children!.map((child, i) => (
                            <button
                                key={child.label}
                                type="button"
                                onClick={() => { onNav(child.href); setOpen(false); }}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "12px 20px",
                                    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    color: "var(--ink)",
                                    background: "transparent",
                                    border: "none",
                                    borderTop: i > 0 ? "1px solid var(--hairline)" : "none",
                                    cursor: "pointer",
                                    transition: "background-color 150ms ease",
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--sand)")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
                            >
                                {child.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── MAIN NAVBAR ─────────────────────────────────────────────
const Navbar: React.FC = () => {
    const [scrolled, setScrolled]         = useState(false);
    const [mobileOpen, setMobileOpen]     = useState(false);
    const [searchOpen, setSearchOpen]     = useState(false);
    const [searchQuery, setSearchQuery]   = useState("");
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

    const { itemCount, cartCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { isLoggedIn, openAuthModal }   = useAuth();
    const navigate = useNavigate();

    // Scroll shadow — just a hairline, no drop shadow
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    // Lock body scroll on mobile menu
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleNav = (path: string) => {
        setMobileOpen(false);
        setSearchOpen(false);
        navigate(path);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    // ── Shared icon button style ───────────────────────────
    const iconBtn: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        background: "transparent",
        border: "none",
        color: "var(--ink)",
        cursor: "pointer",
        transition: "color 150ms ease",
        position: "relative",
        borderRadius: "2px",
        flexShrink: 0,
    };

    return (
        <>
            {/* ── NAVBAR ─────────────────────────────────────────── */}
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    backgroundColor: "var(--paper)",
                    borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
                    transition: "border-color 200ms ease",
                }}
            >
                {/* Inner: 3-col layout — wordmark / nav / actions */}
                <div
                    style={{
                        maxWidth: "1440px",
                        margin: "0 auto",
                        padding: "0 40px",
                        height: "64px",
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        gap: "24px",
                    }}
                >
                    {/* LEFT — Wordmark */}
                    <button
                        type="button"
                        onClick={() => handleNav("/")}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            padding: 0,
                            justifySelf: "start",
                        }}
                        aria-label="Go to homepage"
                    >
                        <span
                            style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: "22px",
                                fontWeight: 400,
                                color: "var(--oxblood)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                            }}
                        >
                            Nehdo
                        </span>
                    </button>

                    {/* CENTER — Desktop nav */}
                    <nav
                        className="hidden lg:flex"
                        style={{ alignItems: "center", gap: "32px" }}
                        aria-label="Main navigation"
                    >
                        {NAV_LINKS.map((link) =>
                            link.children ? (
                                <NavDropdown key={link.label} link={link} onNav={handleNav} />
                            ) : (
                                <button
                                    key={link.label}
                                    type="button"
                                    onClick={() => handleNav(link.href)}
                                    style={{
                                        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "var(--ink)",
                                        background: "transparent",
                                        border: "none",
                                        padding: "6px 0",
                                        cursor: "pointer",
                                        transition: "color 150ms ease",
                                    }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                                >
                                    {link.label}
                                </button>
                            )
                        )}
                    </nav>

                    {/* RIGHT — Actions */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            justifySelf: "end",
                        }}
                    >
                        {/* Search — expands inline on desktop */}
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.form
                                    onSubmit={handleSearch}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="hidden md:block overflow-hidden"
                                    style={{ flexShrink: 0 }}
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search…"
                                        autoFocus
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                            fontSize: "13px",
                                            backgroundColor: "var(--sand)",
                                            border: "1px solid var(--hairline)",
                                            borderRadius: "2px",
                                            outline: "none",
                                            color: "var(--ink)",
                                        }}
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <button
                            type="button"
                            onClick={() => setSearchOpen(!searchOpen)}
                            style={iconBtn}
                            aria-label="Search"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                        >
                            <IoSearchOutline size={18} />
                        </button>

                        {/* Account — hidden on mobile */}
                        <button
                            type="button"
                            onClick={() => isLoggedIn ? handleNav("/account") : openAuthModal("login")}
                            style={{ ...iconBtn }}
                            className="hidden md:flex"
                            aria-label="Account"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                        >
                            <IoPersonOutline size={18} />
                        </button>

                        {/* Wishlist — hidden on mobile */}
                        <button
                            type="button"
                            onClick={() => handleNav("/wishlist")}
                            style={{ ...iconBtn }}
                            className="hidden md:flex"
                            aria-label="Wishlist"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                        >
                            <IoHeartOutline size={18} />
                            {wishlistCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "2px",
                                        right: "2px",
                                        width: "14px",
                                        height: "14px",
                                        backgroundColor: "var(--clay)",
                                        color: "var(--paper)",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "9px",
                                        fontWeight: 500,
                                        borderRadius: "2px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Cart */}
                        <button
                            type="button"
                            onClick={() => handleNav("/cart")}
                            style={{ ...iconBtn }}
                            aria-label="Cart"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                        >
                            <IoBagHandleOutline size={18} />
                            {itemCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "2px",
                                        right: "2px",
                                        width: "14px",
                                        height: "14px",
                                        backgroundColor: "var(--oxblood)",
                                        color: "var(--paper)",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "9px",
                                        fontWeight: 500,
                                        borderRadius: "2px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            style={iconBtn}
                            className="lg:hidden"
                            aria-label="Open menu"
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--oxblood)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--ink)")}
                        >
                            <IoMenuOutline size={22} />
                        </button>
                    </div>
                </div>

                {/* Mobile search bar */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden"
                            style={{ borderTop: "1px solid var(--hairline)" }}
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products…"
                                autoFocus
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "14px 20px",
                                    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                    fontSize: "15px",
                                    backgroundColor: "var(--sand)",
                                    border: "none",
                                    outline: "none",
                                    color: "var(--ink)",
                                }}
                            />
                        </motion.form>
                    )}
                </AnimatePresence>
            </header>

            {/* ── MOBILE SIDE DRAWER ───────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                backgroundColor: "rgba(27,20,18,0.5)",
                                zIndex: 200,
                            }}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: "min(320px, 85vw)",
                                backgroundColor: "var(--paper)",
                                borderLeft: "1px solid var(--hairline)",
                                zIndex: 201,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden auto",
                            }}
                        >
                            {/* Drawer header */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "20px 24px",
                                    borderBottom: "1px solid var(--hairline)",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontSize: "20px",
                                        color: "var(--oxblood)",
                                    }}
                                >
                                    Nehdo
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--ink)",
                                        cursor: "pointer",
                                        padding: "4px",
                                    }}
                                    aria-label="Close menu"
                                >
                                    <IoCloseOutline size={22} />
                                </button>
                            </div>

                            {/* Links */}
                            <div style={{ flex: 1 }}>
                                {NAV_LINKS.map((link, i) => (
                                    <div key={link.label} style={{ borderBottom: "1px solid var(--hairline)" }}>
                                        {link.children ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                        padding: "16px 24px",
                                                        background: "transparent",
                                                        border: "none",
                                                        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                                        fontSize: "15px",
                                                        fontWeight: 500,
                                                        color: "var(--ink)",
                                                        cursor: "pointer",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {link.label}
                                                    <IoChevronDownOutline
                                                        size={14}
                                                        style={{
                                                            transition: "transform 200ms ease",
                                                            transform: mobileExpanded === link.label ? "rotate(180deg)" : "rotate(0deg)",
                                                        }}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {mobileExpanded === link.label && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: "auto" }}
                                                            exit={{ height: 0 }}
                                                            style={{ overflow: "hidden", backgroundColor: "var(--sand)" }}
                                                        >
                                                            {link.children.map((child) => (
                                                                <button
                                                                    key={child.label}
                                                                    type="button"
                                                                    onClick={() => handleNav(child.href)}
                                                                    style={{
                                                                        display: "block",
                                                                        width: "100%",
                                                                        padding: "12px 32px",
                                                                        background: "transparent",
                                                                        border: "none",
                                                                        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                                                        fontSize: "14px",
                                                                        color: "var(--ink)",
                                                                        cursor: "pointer",
                                                                        textAlign: "left",
                                                                        borderBottom: "1px solid var(--hairline)",
                                                                    }}
                                                                >
                                                                    {child.label}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleNav(link.href)}
                                                style={{
                                                    display: "block",
                                                    width: "100%",
                                                    padding: "16px 24px",
                                                    background: "transparent",
                                                    border: "none",
                                                    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                                    fontSize: "15px",
                                                    fontWeight: 500,
                                                    color: "var(--ink)",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                }}
                                            >
                                                {link.label}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Drawer footer — account + wishlist */}
                            <div
                                style={{
                                    padding: "20px 24px",
                                    borderTop: "1px solid var(--hairline)",
                                    display: "flex",
                                    gap: "16px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => isLoggedIn ? handleNav("/account") : (setMobileOpen(false), openAuthModal("login"))}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "transparent",
                                        border: "none",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "11px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "var(--ink)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <IoPersonOutline size={16} />
                                    {isLoggedIn ? "Account" : "Login"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNav("/wishlist")}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "transparent",
                                        border: "none",
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "11px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "var(--ink)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <IoHeartOutline size={16} />
                                    Wishlist
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── MOBILE STICKY BOTTOM BAR ─────────────────────────── */}
            <nav
                className="lg:hidden"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 90,
                    backgroundColor: "var(--paper)",
                    borderTop: "1px solid var(--hairline)",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
                }}
                aria-label="Mobile navigation"
            >
                {[
                    { icon: IoHomeOutline,       label: "Home",    action: () => handleNav("/") },
                    { icon: IoGridOutline,        label: "Shop",    action: () => handleNav("/shop") },
                    { icon: IoBagHandleOutline,   label: "Cart",    action: () => handleNav("/cart"), count: itemCount > 0 ? cartCount : undefined },
                    { icon: IoPersonOutline,      label: "Account", action: () => isLoggedIn ? handleNav("/account") : openAuthModal("login") },
                ].map(({ icon: Icon, label, action, count }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={action}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "3px",
                            background: "transparent",
                            border: "none",
                            color: "var(--ink)",
                            cursor: "pointer",
                            position: "relative",
                            padding: "4px",
                        }}
                        aria-label={label}
                    >
                        <Icon size={20} />
                        <span
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "9px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                            }}
                        >
                            {label}
                        </span>
                        {count !== undefined && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    right: "calc(50% - 14px)",
                                    width: "14px",
                                    height: "14px",
                                    backgroundColor: "var(--oxblood)",
                                    color: "var(--paper)",
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: "9px",
                                    borderRadius: "2px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </>
    );
};

export default Navbar;
