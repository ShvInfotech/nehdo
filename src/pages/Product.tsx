import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IoAdd,
  IoBagAddOutline,
  IoCardOutline,
  IoCashOutline,
  IoCheckmark,
  IoChevronDown,
  IoCubeOutline,
  IoFlashOutline,
  IoHeart,
  IoHeartOutline,
  IoRemove,
  IoShieldCheckmarkOutline,
  IoStar,
  IoStarHalf,
} from "react-icons/io5";
import { useProductDetail, type ProductReview } from "../hooks/useProductDetail";
import { Badge, Breadcrumbs, Button, ButtonLink, Container, Price, Section, SectionHeader, Skeleton } from "../components/ui";
import Gallery from "../components/product/Gallery";
import ProductRail from "../components/product/ProductRail";
import { cx, inr } from "../lib/format";
import { FREE_SHIPPING_ABOVE } from "../config";

/** Remount per product id so selection state resets when navigating between products. */
const ProductPage: React.FC = () => {
  const { id = "" } = useParams();
  return <ProductView key={id} id={id} />;
};

const ProductView: React.FC<{ id: string }> = ({ id }) => {
  const d = useProductDetail(id);
  const ctaRef = useRef<HTMLDivElement>(null);
  const showBar = useStickyBar(ctaRef, !!d.product);

  if (!d.product) return <NotFound />;
  const p = d.product;

  return (
    <>
      <Container className="pb-6 pt-5 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Shop", to: "/shop" },
            ...(p.category ? [{ label: p.category, to: `/shop?category=${encodeURIComponent(p.category.toLowerCase())}` }] : []),
            { label: p.name },
          ]}
        />

        {/* grid-cols-1 = minmax(0,1fr): stops the swipe gallery widening the column on mobile */}
        <div className="mt-5 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Gallery
            images={d.gallery}
            alt={p.name}
            badges={
              <>
                {d.discount && !d.isOutOfStock && <Badge tone="coral">−{d.discount}%</Badge>}
                {p.isNew && <Badge tone="white">New</Badge>}
              </>
            }
          />

          {/* buy box */}
          <div className="md:sticky md:top-[calc(var(--v2-header-h)+24px)] md:self-start">
            {p.brand && (
              <Link
                to={`/shop?brand=${encodeURIComponent(p.brand.toLowerCase())}`}
                className="-my-3 inline-block py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted hover:text-v2-plum"
              >
                {p.brand}
              </Link>
            )}
            <h1 className="mt-2 text-[28px] leading-[1.1] md:text-[36px]">{p.name}</h1>

            {d.avgRating > 0 && (
              <a href="#reviews" className="mt-1 inline-flex min-h-11 items-center gap-2 text-[13.5px] text-v2-muted hover:text-v2-ink">
                <Stars value={d.avgRating} />
                <span className="font-semibold text-v2-ink">{d.avgRating.toFixed(1)}</span>
                <span>· {d.reviews.length || p.reviews} reviews</span>
              </a>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Price price={d.price} original={d.original > d.price ? d.original : null} size="lg" />
            </div>

            <StockLine out={d.isOutOfStock} low={d.isLowStock} stock={d.stock} />

            {p.sortdescription && <p className="mt-5 text-[15px] leading-relaxed text-v2-ink/80">{p.sortdescription}</p>}

            {/* options */}
            <div className="mt-6 space-y-5">
              {p.colors?.length > 0 && (
                <OptionGroup label="Colour" value={d.color}>
                  <div className="flex flex-wrap gap-2.5">
                    {p.colors.map((c: { name: string; hex: string }) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => d.setColor(c.name)}
                        aria-pressed={d.color === c.name}
                        aria-label={c.name}
                        title={c.name}
                        className={cx(
                          "h-11 w-11 rounded-full border border-black/10 ring-offset-2 md:h-9 md:w-9 ring-offset-v2-bg transition",
                          d.color === c.name ? "ring-2 ring-v2-plum" : "hover:ring-2 hover:ring-v2-line",
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </OptionGroup>
              )}

              {p.sizes?.length > 0 && (
                <OptionGroup label="Size" value={d.size}>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s: string) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => d.setSize(s)}
                        aria-pressed={d.size === s}
                        className={cx(
                          "h-11 min-w-12 rounded-full border px-4 text-[13.5px] font-semibold transition-colors md:h-10",
                          d.size === s ? "border-v2-ink bg-v2-ink text-white" : "border-v2-line bg-v2-surface hover:border-v2-ink/40",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </OptionGroup>
              )}
            </div>

            {/* actions */}
            <div ref={ctaRef} className="mt-7">
              <div className="flex gap-2.5">
                <Stepper value={d.quantity} onChange={d.setQuantity} disabled={d.isOutOfStock} max={d.stock} />
                <Button
                  size="lg"
                  className="min-w-0 flex-1 px-4 sm:px-8"
                  onClick={d.addToCart}
                  loading={d.adding}
                  disabled={d.isOutOfStock}
                  variant={d.added ? "secondary" : "primary"}
                >
                  {d.added ? <IoCheckmark size={18} /> : <IoBagAddOutline size={18} />}
                  {d.isOutOfStock ? "Out of stock" : d.added ? "Added to cart" : "Add to cart"}
                </Button>
                <button
                  type="button"
                  onClick={d.toggleWishlist}
                  aria-pressed={d.inWishlist}
                  aria-label={d.inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                  className={cx(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors",
                    d.inWishlist ? "border-v2-coral/40 bg-v2-blush text-v2-coral" : "border-v2-line bg-v2-surface hover:border-v2-ink/30",
                  )}
                >
                  {d.inWishlist ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                </button>
              </div>
              {!d.isOutOfStock && (
                <Button size="lg" variant="accent" block className="mt-2.5" onClick={d.buyNow} loading={d.buying}>
                  <IoFlashOutline size={18} /> Buy now
                </Button>
              )}
              {!d.isOutOfStock && (
                <p className="mt-3 text-center text-[13px] text-v2-muted">
                  Free shipping on orders above {inr(FREE_SHIPPING_ABOVE)} · Cash on delivery available
                </p>
              )}
            </div>

            {/* reassurance */}
            <ul className="mt-6 grid grid-cols-2 gap-2.5">
              {[
                { icon: IoCubeOutline, label: "Discreet, plain packaging" },
                { icon: IoCardOutline, label: "Neutral billing name" },
                { icon: IoCashOutline, label: "Cash on delivery" },
                { icon: IoShieldCheckmarkOutline, label: "100% genuine & sealed" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 rounded-v2 bg-v2-sunken/70 px-3 py-2.5 text-[13px] font-medium">
                  <Icon className="shrink-0 text-v2-plum" size={17} />
                  {label}
                </li>
              ))}
            </ul>

            {/* details */}
            <div className="mt-8 divide-y divide-v2-line border-y border-v2-line">
              {p.description && (
                <Accordion title="Description" defaultOpen>
                  <p className="whitespace-pre-line">{p.description}</p>
                </Accordion>
              )}
              <Accordion title="Shipping & discreet delivery">
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Ships in a plain outer box with no product names or branding on the label.</li>
                  <li>Free shipping on orders above {inr(FREE_SHIPPING_ABOVE)}. Cash on delivery available.</li>
                  <li>Delivery time for your pincode is calculated at checkout.</li>
                </ul>
                <p className="mt-3">
                  See our{" "}
                  <Link to="/shipping" className="font-semibold text-v2-plum underline-offset-2 hover:underline">
                    shipping policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/returns" className="font-semibold text-v2-plum underline-offset-2 hover:underline">
                    returns policy
                  </Link>
                  .
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </Container>

      <Reviews reviews={d.reviews} loading={d.reviewsLoading} avg={d.avgRating} />

      {d.related.length > 0 && (
        <Section>
          <Container>
            <SectionHeader title="You might also like" />
            <ProductRail products={d.related} label="Related products" />
          </Container>
        </Section>
      )}

      {/* mobile sticky buy bar */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-[90] border-t border-v2-line bg-v2-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-v2-muted">{p.name}</p>
            <p className="font-v2-display text-[18px] font-semibold">{inr(d.price)}</p>
          </div>
          <Button onClick={d.addToCart} loading={d.adding} disabled={d.isOutOfStock} tabIndex={showBar ? 0 : -1}>
            {d.isOutOfStock ? "Out of stock" : d.added ? "Added" : "Add to cart"}
          </Button>
        </div>
      </div>
    </>
  );
};

/* ── Pieces ──────────────────────────────────────────────────── */

/** True while the main CTA is outside the viewport (the bar itself is phone-only). */
function useStickyBar(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      // show whenever the main buttons are off-screen — above (scrolled past)
      // or below (photo fills the first screen on phones)
      const r = el.getBoundingClientRect();
      setShow(r.bottom < 0 || r.top > window.innerHeight - 72);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, enabled]);

  // lift the global WhatsApp button above the bar while it's visible
  useEffect(() => {
    // the bar itself is md:hidden, so only flag it below 768px
    document.body.classList.toggle("v2-sticky-bar", show && window.matchMedia("(max-width: 767px)").matches);
    return () => document.body.classList.remove("v2-sticky-bar");
  }, [show]);
  return show;
}

const StockLine: React.FC<{ out: boolean; low: boolean; stock: number }> = ({ out, low, stock }) => (
  <p
    className={cx(
      "mt-3 inline-flex items-center gap-2 text-[13.5px] font-semibold",
      out ? "text-v2-muted" : low ? "text-v2-coral" : "text-v2-sage",
    )}
  >
    <span className={cx("h-2 w-2 rounded-full", out ? "bg-v2-muted" : low ? "bg-v2-coral" : "bg-v2-sage")} />
    {out ? "Out of stock for this option" : low ? `Only ${stock} left` : "In stock, ready to ship"}
  </p>
);

const OptionGroup: React.FC<{ label: string; value?: string; children: React.ReactNode }> = ({ label, value, children }) => (
  <div>
    <p className="mb-2.5 text-[13px] font-semibold">
      {label}
      {value && <span className="ml-1.5 font-normal text-v2-muted">{value}</span>}
    </p>
    {children}
  </div>
);

const Stepper: React.FC<{ value: number; onChange: (n: number) => void; disabled?: boolean; max: number }> = ({
  value,
  onChange,
  disabled,
  max,
}) => (
  <div className={cx("flex h-14 items-center rounded-full border border-v2-line bg-v2-surface", disabled && "opacity-50")}>
    <button
      type="button"
      onClick={() => onChange(value - 1)}
      disabled={disabled || value <= 1}
      aria-label="Decrease quantity"
      className="flex h-full w-11 items-center justify-center rounded-l-full disabled:text-v2-muted/50"
    >
      <IoRemove />
    </button>
    <span className="w-6 text-center text-[15px] font-semibold" aria-live="polite" aria-label={`Quantity ${value}`}>
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      disabled={disabled || value >= max}
      aria-label="Increase quantity"
      className="flex h-full w-11 items-center justify-center rounded-r-full disabled:text-v2-muted/50"
    >
      <IoAdd />
    </button>
  </div>
);

const Accordion: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title,
  defaultOpen,
  children,
}) => (
  <details className="group" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
      {title}
      <IoChevronDown className="text-v2-muted transition-transform group-open:rotate-180" />
    </summary>
    <div className="pb-5 text-[14.5px] leading-relaxed text-v2-ink/80">{children}</div>
  </details>
);

/** Rounded to the nearest half star, so 4.5 shows 4½ (not 5). */
const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => {
  const r = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex gap-0.5 text-[#F5A524]" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) =>
        i < Math.floor(r) ? (
          <IoStar key={i} size={size} />
        ) : i < r ? (
          <IoStarHalf key={i} size={size} />
        ) : (
          <IoStar key={i} size={size} className="opacity-25" />
        ),
      )}
    </span>
  );
};

const Reviews: React.FC<{ reviews: ProductReview[]; loading: boolean; avg: number }> = ({ reviews, loading, avg }) => {
  const [showAll, setShowAll] = useState(false);
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => Math.round(r.rating) === n).length }));
  const shown = showAll ? reviews : reviews.slice(0, 6);

  return (
    <Section id="reviews" className="scroll-mt-24 border-t border-v2-line bg-v2-surface">
      <Container>
        <SectionHeader title="Customer reviews" />
        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="rounded-v2-lg bg-v2-sunken px-5 py-8 text-center text-[15px] text-v2-muted">
            No reviews yet. Bought this? Your review helps others shop with confidence.
          </p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <div>
              <p className="font-v2-display text-[48px] font-semibold leading-none">{avg.toFixed(1)}</p>
              <div className="mt-2">
                <Stars value={avg} size={18} />
              </div>
              <p className="mt-1 text-[13.5px] text-v2-muted">Based on {reviews.length} reviews</p>
              <ul className="mt-5 space-y-1.5">
                {dist.map(({ n, count }) => (
                  <li key={n} className="flex items-center gap-2 text-[12.5px] text-v2-muted">
                    <span className="w-3">{n}</span>
                    <IoStar className="text-[#F5A524]" size={12} />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-v2-sunken">
                      <span className="block h-full rounded-full bg-v2-plum" style={{ width: `${(count / reviews.length) * 100}%` }} />
                    </span>
                    <span className="w-6 text-right">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="grid gap-4 md:grid-cols-2">
                {shown.map((r) => (
                  <li key={r._id} className="rounded-v2-lg border border-v2-line bg-v2-bg p-5">
                    <Stars value={r.rating} />
                    <p className="mt-3 text-[14.5px] leading-relaxed">{r.review}</p>
                    <p className="mt-3 text-[13px] font-semibold">{r.userName || "Customer"}</p>
                  </li>
                ))}
              </ul>
              {reviews.length > 6 && (
                <Button variant="secondary" className="mt-5" onClick={() => setShowAll((s) => !s)}>
                  {showAll ? "Show fewer" : `Show all ${reviews.length} reviews`}
                </Button>
              )}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
};

const NotFound: React.FC = () => (
  <Container className="py-24 text-center">
    <p className="font-v2-display text-[28px] font-semibold">We couldn’t find that product</p>
    <p className="mx-auto mt-2 max-w-sm text-[15px] text-v2-muted">It may have sold out or been removed. Have a look at what’s in stock.</p>
    <ButtonLink to="/shop" className="mt-6">
      Browse all products
    </ButtonLink>
  </Container>
);

export default ProductPage;
