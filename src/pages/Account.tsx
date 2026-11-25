import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoBagHandleOutline,
  IoCallOutline,
  IoCameraOutline,
  IoHeartOutline,
  IoMailOutline,
  IoPencil,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useProfile } from "../hooks/useAccount";
import AccountShell, { SignInGate } from "../components/layout/AccountShell";
import { Button, Field } from "../components/ui";

const AccountPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <SignInGate title="Sign in to your account" body="Track orders, manage your details and see your saved items." />;
  }
  return <Profile />;
};

const Profile: React.FC = () => {
  const p = useProfile();
  const { count: wishCount } = useWishlist();
  const fileRef = useRef<HTMLInputElement>(null);
  const avatar = p.preview || p.user?.profile;

  return (
    <AccountShell title="Your profile" crumb="Profile">
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            p.save();
          }}
          className="rounded-v2-xl bg-v2-surface p-6 shadow-v2-sm md:p-8"
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="relative">
              <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-v2-lilac font-v2-display text-[30px] font-semibold text-v2-plum">
                {avatar ? (
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  (p.user?.name || "?").charAt(0).toUpperCase()
                )}
              </span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-v2-ink text-white ring-4 ring-v2-surface hover:bg-v2-plum"
              >
                <IoCameraOutline size={15} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => p.pickImage(e.target.files?.[0])}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-v2-display text-[22px] font-semibold">{p.user?.name || "Your name"}</p>
              <p className="truncate text-[14px] text-v2-muted">{p.user?.email}</p>
            </div>
            {!p.editing && (
              <Button variant="secondary" size="sm" onClick={() => p.setEditing(true)}>
                <IoPencil /> Edit
              </Button>
            )}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              icon={<IoPersonOutline />}
              value={p.form.name}
              onChange={(e) => p.setField("name", e.target.value)}
              disabled={!p.editing}
              autoComplete="name"
              required
            />
            <Field
              label="Email"
              type="email"
              icon={<IoMailOutline />}
              value={p.form.email}
              onChange={(e) => p.setField("email", e.target.value)}
              disabled={!p.editing}
              autoComplete="email"
              required
            />
            <Field
              label="Mobile number"
              type="tel"
              icon={<IoCallOutline />}
              value={p.form.phone}
              onChange={(e) => p.setField("phone", e.target.value)}
              disabled={!p.editing}
              autoComplete="tel"
              placeholder="10-digit mobile"
            />
          </div>

          {p.editing && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button type="submit" loading={p.saving}>
                Save changes
              </Button>
              <Button variant="ghost" onClick={p.cancel} disabled={p.saving}>
                Cancel
              </Button>
            </div>
          )}
        </form>

        <div className="space-y-3">
          {[
            { to: "/orders", label: "Your orders", note: "Track, cancel or return", icon: IoBagHandleOutline },
            { to: "/wishlist", label: "Wishlist", note: wishCount ? `${wishCount} saved` : "Nothing saved yet", icon: IoHeartOutline },
          ].map(({ to, label, note, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-v2-lg border border-v2-line bg-v2-surface p-4 transition-shadow hover:shadow-v2"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-v2 bg-v2-lilac text-v2-plum">
                <Icon size={20} />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold">{label}</span>
                <span className="block text-[13px] text-v2-muted">{note}</span>
              </span>
              <IoArrowForward className="text-v2-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
          <p className="flex items-start gap-2.5 rounded-v2-lg bg-v2-sunken p-4 text-[13px] text-v2-muted">
            <IoShieldCheckmarkOutline className="mt-0.5 shrink-0 text-v2-sage" size={17} />
            On a shared device? Signing out also clears your cart and saved items from this browser.
          </p>
        </div>
      </div>
    </AccountShell>
  );
};

export default AccountPage;
