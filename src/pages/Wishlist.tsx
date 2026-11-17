import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoBagAddOutline, IoHeartOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useWishlistPage } from "../hooks/useAccount";
import type { Product } from "../data/products";
import AccountShell, { SignInGate } from "../components/layout/AccountShell";
import { Button, ButtonLink, Img, Price, Rating } from "../components/ui";

const WishlistPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const w = useWishlistPage();

  // old wishlist is server-side only, so guests have nothing to show
  if (!isLoggedIn) {
    return <SignInGate title="Your private wishlist" body="Sign in to save products for later. Only you can see your wishlist." />;
  }

  return (
    <AccountShell title="Wishlist" crumb="Wishlist">
      {w.products.length === 0 ? (
        <div className="rounded-v2-xl border border-dashed border-v2-line px-6 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-v2-blush text-v2-coral">
            <IoHeartOutline size={28} />
          </span>
          <p className="mt-5 font-v2-display text-[22px] font-semibold">Nothing saved yet</p>
          <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-v2-muted">
            Tap the heart on any product to keep it here for later.
          </p>
          <ButtonLink to="/shop" className="mt-6">
            Browse products
          </ButtonLink>
        </div>
      ) : (
        <>
          <p className="mb-5 text-[14px] text-v2-muted">
            {w.products.length} saved {w.products.length === 1 ? "item" : "items"}
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 xl:grid-cols-4">
            {w.products.map((p) => (
              <li key={p.id}>
                <WishCard product={p} onMove={() => w.moveToCart(p)} onRemove={() => w.remove(p)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </AccountShell>
  );
};

const WishCard: React.FC<{ product: Product; onMove: () => Promise<void>; onRemove: () => Promise<void> }> = ({
  product: p,
  onMove,
  onRemove,
}) => {
  const [busy, setBusy] = useState<null | "move" | "remove">(null);
  const run = (kind: "move" | "remove", fn: () => Promise<void>) => async () => {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };
  return (
    <article className="flex h-full flex-col">
      <Link to={`/product/${p.id}`} className="group block overflow-hidden rounded-v2-lg">
        <Img src={p.image} alt={p.name} frameClassName="aspect-[4/5]" className="transition-transform duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11.5px] font-semibold uppercase tracking-[0.1em] text-v2-muted">{p.brand}</span>
          <Rating value={p.rating} count={p.reviews} />
        </div>
        <Link to={`/product/${p.id}`} className="mt-1 line-clamp-2 text-[14.5px] font-medium leading-snug hover:text-v2-plum">
          {p.name}
        </Link>
        <Price price={p.price} original={p.originalPrice} size="sm" showPct={false} className="mt-2" />
        <div className="mt-auto flex flex-col gap-1.5 pt-3">
          <Button size="sm" block onClick={run("move", onMove)} loading={busy === "move"} disabled={!!busy}>
            <IoBagAddOutline /> Move to cart
          </Button>
          <button
            type="button"
            onClick={run("remove", onRemove)}
            disabled={!!busy}
            className="py-1.5 text-[13px] font-semibold text-v2-muted hover:text-v2-coral"
          >
            {busy === "remove" ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default WishlistPage;
