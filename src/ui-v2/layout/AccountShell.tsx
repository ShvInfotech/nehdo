import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { IoBagHandleOutline, IoHeartOutline, IoLockClosedOutline, IoLogOutOutline, IoPersonOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../hooks/useAccount";
import { Breadcrumbs, Button, Container } from "../primitives";
import { cx } from "../lib/format";

const NAV = [
  { to: "/account", label: "Profile", icon: IoPersonOutline },
  { to: "/orders", label: "Orders", icon: IoBagHandleOutline },
  { to: "/wishlist", label: "Wishlist", icon: IoHeartOutline },
];

/** Signed-out state for account pages. Opens the sign-in sheet once (v1 behaviour). */
export const SignInGate: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  const { openAuthModal } = useAuth();
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      openAuthModal("login");
    }
  }, [openAuthModal]);
  return (
    <Container className="py-20 text-center md:py-28">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-v2-lilac text-v2-plum">
        <IoLockClosedOutline size={32} />
      </span>
      <h1 className="mt-6 text-[30px]">{title}</h1>
      <p className="mx-auto mt-2 max-w-sm text-[15px] text-v2-muted">{body}</p>
      <div className="mt-7 flex justify-center gap-2.5">
        <Button size="lg" onClick={() => openAuthModal("login")}>
          Sign in
        </Button>
        <Button size="lg" variant="secondary" onClick={() => openAuthModal("signup")}>
          Create account
        </Button>
      </div>
    </Container>
  );
};

/** Account area layout: tabs on mobile, side nav on desktop. */
const AccountShell: React.FC<{ title: string; crumb: string; children: React.ReactNode; actions?: React.ReactNode }> = ({
  title,
  crumb,
  children,
  actions,
}) => {
  const { user } = useAuth();
  const { signOut } = useProfile();

  return (
    <Container className="pb-16 pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Account", to: "/account" }, { label: crumb }]} />
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[14px] text-v2-muted">Hi, {user?.name?.split(" ")[0] || "there"}</p>
          <h1 className="text-[32px] md:text-[42px]">{title}</h1>
        </div>
        {actions}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav aria-label="Account" className="lg:sticky lg:top-[calc(var(--v2-header-h)+24px)] lg:self-start">
          <ul className="v2-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {NAV.map(({ to, label, icon: Icon }) => (
              <li key={to} className="shrink-0">
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    cx(
                      "flex min-h-11 items-center gap-2.5 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-colors lg:rounded-v2",
                      isActive ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface hover:border-v2-ink/30 lg:border-transparent lg:bg-transparent lg:hover:bg-v2-sunken",
                    )
                  }
                >
                  <Icon size={17} /> {label}
                </NavLink>
              </li>
            ))}
            <li className="shrink-0 lg:mt-4 lg:border-t lg:border-v2-line lg:pt-4">
              <button
                type="button"
                onClick={signOut}
                className="flex min-h-11 items-center gap-2.5 rounded-full border border-v2-line bg-v2-surface px-4 py-2.5 text-[14px] font-semibold text-v2-muted hover:text-v2-coral lg:w-full lg:rounded-v2 lg:border-transparent lg:bg-transparent lg:hover:bg-v2-sunken"
              >
                <IoLogOutOutline size={17} /> Sign out
              </button>
            </li>
          </ul>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
};

export default AccountShell;
