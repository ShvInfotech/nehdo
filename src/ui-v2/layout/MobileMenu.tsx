import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoChevronDown,
  IoCubeOutline,
  IoHeartOutline,
  IoLockClosedOutline,
  IoLogoWhatsapp,
  IoPersonOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { Button, Sheet } from "../primitives";
import { cx } from "../lib/format";
import { NAV, SUPPORT_WHATSAPP } from "../config";

const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [expanded, setExpanded] = useState<string | null>("Shop");
  const { pathname, search } = useLocation();

  // close on navigation
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  return (
    <Sheet open={open} onClose={onClose} side="left" title="Menu">
      <div className="flex min-h-full flex-col">
        <div className="border-b border-v2-line p-5">
          {isLoggedIn ? (
            <Link to="/account" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-v2-lilac font-v2-display text-lg font-semibold text-v2-plum">
                {(user?.name || "?").charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="block text-[15px] font-semibold">Hi, {user?.name?.split(" ")[0] || "there"}</span>
                <span className="block text-[12.5px] text-v2-muted">View your account</span>
              </span>
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  onClose();
                  openAuthModal("login");
                }}
              >
                Sign in
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  openAuthModal("signup");
                }}
              >
                Create account
              </Button>
            </div>
          )}
        </div>

        <nav aria-label="Mobile" className="flex-1 px-3 py-3">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={expanded === item.label}
                  onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  className="flex w-full items-center justify-between rounded-v2 px-3 py-3.5 text-[16px] font-semibold"
                >
                  {item.label}
                  <IoChevronDown className={cx("transition-transform", expanded === item.label && "rotate-180")} />
                </button>
                {expanded === item.label && (
                  <div className="mb-2 ml-3 border-l border-v2-line pl-3">
                    {item.children.map((c) => (
                      <Link key={c.label} to={c.href} className="block rounded-v2 px-3 py-2.5 text-[15px] text-v2-muted hover:text-v2-ink">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} to={item.href} className="block rounded-v2 px-3 py-3.5 text-[16px] font-semibold">
                {item.label}
              </Link>
            ),
          )}

          <div className="mt-3 border-t border-v2-line pt-3">
            {[
              { to: "/orders", label: "Track an order", icon: <IoCubeOutline /> },
              { to: "/wishlist", label: `Wishlist${wishlistCount ? ` (${wishlistCount})` : ""}`, icon: <IoHeartOutline /> },
              { to: "/account", label: "Account", icon: <IoPersonOutline /> },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-v2 px-3 py-3 text-[15px] text-v2-ink hover:bg-v2-sunken">
                <span className="text-lg text-v2-muted">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="space-y-3 border-t border-v2-line bg-v2-sunken/60 p-5">
          <p className="flex items-center gap-2 text-[13px] text-v2-muted">
            <IoLockClosedOutline className="text-v2-sage" /> Discreet packaging & private billing on every order
          </p>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-semibold text-v2-ink"
          >
            <IoLogoWhatsapp className="text-lg text-[#25D366]" /> Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </Sheet>
  );
};

export default MobileMenu;
