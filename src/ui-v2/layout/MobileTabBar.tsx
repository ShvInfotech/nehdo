import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IoBagHandle,
  IoBagHandleOutline,
  IoGrid,
  IoGridOutline,
  IoHome,
  IoHomeOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSearchOutline,
} from "react-icons/io5";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { cx } from "../lib/format";

export const OPEN_SEARCH_EVENT = "v2:open-search";

/** Pages that already have their own sticky bottom bar (buy / checkout). */
const HIDDEN_ON = [/^\/product\//, /^\/cart$/, /^\/checkout$/];

/**
 * Phone-only bottom navigation. Hidden ≥1024px and on pages with their own
 * sticky bar. Sets body.v2-tabbar so content and the WhatsApp button clear it.
 */
const MobileTabBar: React.FC = () => {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();
  const hidden = HIDDEN_ON.some((r) => r.test(pathname));

  useEffect(() => {
    document.body.classList.toggle("v2-tabbar", !hidden);
    return () => document.body.classList.remove("v2-tabbar");
  }, [hidden]);

  if (hidden) return null;

  const item = (active: boolean) =>
    cx(
      "relative flex h-full flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors",
      active ? "text-v2-plum" : "text-v2-muted",
    );

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-[95] border-t border-v2-line bg-v2-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        <NavLink to="/" end className={({ isActive }) => item(isActive)}>
          {({ isActive }) => (
            <>
              {isActive ? <IoHome size={22} /> : <IoHomeOutline size={22} />}
              Home
            </>
          )}
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => item(isActive || pathname.startsWith("/collection"))}>
          {({ isActive }) => (
            <>
              {isActive || pathname.startsWith("/collection") ? <IoGrid size={21} /> : <IoGridOutline size={21} />}
              Shop
            </>
          )}
        </NavLink>
        <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))} className={item(pathname === "/search")}>
          {pathname === "/search" ? <IoSearch size={22} /> : <IoSearchOutline size={22} />}
          Search
        </button>
        {isLoggedIn ? (
          <NavLink
            to="/account"
            className={({ isActive }) => item(isActive || pathname === "/orders" || pathname === "/wishlist")}
          >
            {({ isActive }) => (
              <>
                {isActive || pathname === "/orders" || pathname === "/wishlist" ? <IoPerson size={21} /> : <IoPersonOutline size={21} />}
                Account
              </>
            )}
          </NavLink>
        ) : (
          <button type="button" onClick={() => openAuthModal("login")} className={item(false)}>
            <IoPersonOutline size={21} />
            Sign in
          </button>
        )}
        <NavLink to="/cart" className={({ isActive }) => item(isActive)} aria-label={`Cart${itemCount ? ` (${itemCount} items)` : ""}`}>
          {({ isActive }) => (
            <>
              <span className="relative">
                {isActive ? <IoBagHandle size={22} /> : <IoBagHandleOutline size={22} />}
                {itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-v2-coral px-1 text-[10px] font-bold leading-none text-white ring-2 ring-v2-bg">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>
              Cart
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileTabBar;
