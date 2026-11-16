import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoBagHandleOutline,
  IoChevronDown,
  IoHeartOutline,
  IoMenuOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { IconButton } from "../primitives";
import { cx } from "../lib/format";
import { NAV, type NavItem } from "../config";
import SearchSheet from "./SearchSheet";
import MobileMenu from "./MobileMenu";
import { OPEN_SEARCH_EVENT } from "./MobileTabBar";

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <Link to="/" aria-label="Nehdo home" className={cx("inline-flex h-11 shrink-0 items-center", className)}>
    <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="Nehdo Wellness" className="h-7 w-auto md:h-8" />
  </Link>
);

const DesktopNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  if (!item.children) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cx(
            "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
            isActive ? "text-v2-plum" : "text-v2-ink hover:bg-v2-sunken",
          )
        }
      >
        {item.label}
      </NavLink>
    );
  }

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cx(
          "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
          open ? "bg-v2-sunken" : "hover:bg-v2-sunken",
        )}
      >
        {item.label}
        <IoChevronDown size={12} className={cx("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 pt-2"
          >
            <div className="w-[280px] rounded-v2-lg border border-v2-line bg-v2-surface p-2 shadow-v2-lg">
              {item.children.map((c) => (
                <Link
                  key={c.label}
                  to={c.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-v2 px-3.5 py-2.5 transition-colors hover:bg-v2-sunken"
                >
                  <span className="block text-[14px] font-semibold text-v2-ink">{c.label}</span>
                  {c.note && <span className="block text-[12.5px] text-v2-muted">{c.note}</span>}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/" opens search from anywhere (except while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    // the mobile tab bar's Search button opens the same panel
    const onOpen = () => setSearchOpen(true);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, []);

  return (
    <>
      <header
        className={cx(
          "sticky top-0 z-[100] border-b transition-[background-color,border-color] duration-200",
          scrolled ? "border-v2-line bg-v2-bg/90 backdrop-blur-md" : "border-transparent bg-v2-bg",
        )}
      >
        <div className="mx-auto flex h-[var(--v2-header-h)] max-w-[1320px] items-center gap-2 px-3 sm:px-6 lg:px-10">
          <IconButton label="Open menu" className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <IoMenuOutline size={24} />
          </IconButton>

          <Logo className="mr-4 max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2" />

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => (
              <DesktopNavItem key={item.label} item={item} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="mr-2 hidden h-10 w-[260px] items-center gap-2 rounded-full border border-v2-line bg-v2-surface px-4 text-left text-[14px] text-v2-muted transition-colors hover:border-v2-ink/25 xl:flex"
            >
              <IoSearchOutline size={18} />
              <span className="flex-1">Search products</span>
              <kbd className="rounded-md border border-v2-line px-1.5 text-[11px] font-medium">/</kbd>
            </button>
            <IconButton label="Search" className="xl:hidden" onClick={() => setSearchOpen(true)}>
              <IoSearchOutline size={21} />
            </IconButton>

            {isLoggedIn ? (
              <Link to="/account" aria-label="Your account" className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-v2-sunken sm:inline-flex md:h-10 md:w-10">
                <IoPersonOutline size={21} />
              </Link>
            ) : (
              <IconButton label="Sign in" className="hidden sm:inline-flex" onClick={() => openAuthModal("login")}>
                <IoPersonOutline size={21} />
              </IconButton>
            )}

            <Link
              to="/wishlist"
              aria-label={`Wishlist${wishlistCount ? ` (${wishlistCount})` : ""}`}
              className="relative hidden h-11 w-11 items-center justify-center rounded-full hover:bg-v2-sunken sm:inline-flex md:h-10 md:w-10"
            >
              <IoHeartOutline size={21} />
              {wishlistCount > 0 && <CountDot n={wishlistCount} />}
            </Link>

            <Link
              to="/cart"
              aria-label={`Cart${itemCount ? ` (${itemCount} items)` : ""}`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-v2-sunken md:h-10 md:w-10"
            >
              <IoBagHandleOutline size={22} />
              {itemCount > 0 && <CountDot n={itemCount} />}
            </Link>
          </div>
        </div>
      </header>

      <SearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

const CountDot: React.FC<{ n: number }> = ({ n }) => (
  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-v2-coral px-1 text-[10px] font-bold leading-none text-white ring-2 ring-v2-bg">
    {n > 99 ? "99+" : n}
  </span>
);

export default Header;
