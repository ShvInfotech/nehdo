import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoAdd, IoArrowForward, IoBagHandleOutline, IoCubeOutline, IoRemove, IoTrashOutline } from "react-icons/io5";
import { useCart, type CartItem } from "../context/CartContext";
import { useCartCheckout, useCartLines } from "../hooks/useCheckout";
import { useTrendingProducts } from "../hooks/useProducts";
import { Breadcrumbs, Button, ButtonLink, Container, Img, Section, SectionHeader, Spinner } from "../components/ui";
import ProductRail from "../components/product/ProductRail";
import { FreeShippingBar, PaymentMarks, SummaryRow, variantLabel } from "../components/checkout/Parts";
import { FREE_SHIPPING_ABOVE } from "../config";
import { cx, inr } from "../lib/format";

const CartPage: React.FC = () => {
  const { items, subtotal, itemCount } = useCart();
  const { checkout, checkingOut } = useCartCheckout();
  const lines = useCartLines();

  if (items.length === 0) return <EmptyCart />;

  const savings = items.reduce(
    (s, i) => s + (i.originalPrice && i.originalPrice > i.price ? (i.originalPrice - i.price) * i.quantity : 0),
    0,
  );
  const freeShipping = subtotal >= FREE_SHIPPING_ABOVE;

  return (
    <>
      <Container className="pb-28 pt-5 md:pb-16 md:pt-8">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <h1 className="mt-5 text-[32px] md:text-[44px]">
          Your cart <span className="text-v2-muted">({itemCount})</span>
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div>
            <FreeShippingBar subtotal={subtotal} />
            <ul className="mt-4 divide-y divide-v2-line rounded-v2-lg border border-v2-line bg-v2-surface">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <Line
                    key={item._id}
                    item={item}
                    pending={!!lines.pending[item._id]}
                    onQty={(q) => lines.setQty(item._id, q)}
                    onRemove={() => lines.remove(item._id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
            <Link to="/shop" className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-v2-plum hover:underline">
              Continue shopping <IoArrowForward />
            </Link>
          </div>

          {/* summary */}
          <aside aria-label="Order summary" className="lg:sticky lg:top-[calc(var(--v2-header-h)+24px)] lg:self-start">
            <div className="rounded-v2-xl bg-v2-surface p-6 shadow-v2">
              <h2 className="text-[20px]">Order summary</h2>
              <dl className="mt-5 space-y-3">
                <SummaryRow label={`Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`} value={inr(subtotal)} />
                {savings > 0 && <SummaryRow label="You save" value={<span className="text-v2-sage">−{inr(savings)}</span>} />}
                <SummaryRow
                  label="Shipping"
                  value={freeShipping ? <span className="font-semibold text-v2-sage">Free*</span> : "At checkout"}
                  muted={!freeShipping}
                />
                <SummaryRow label="Coupons" value="Apply at checkout" muted />
                <div className="border-t border-v2-line pt-3">
                  <SummaryRow label="Estimated total" value={inr(subtotal)} strong />
                </div>
              </dl>
              <Button size="lg" block className="mt-6" onClick={checkout} loading={checkingOut}>
                {checkingOut ? "Opening secure checkout…" : "Checkout securely"}
              </Button>
              <p className="mt-3 text-center text-[12.5px] text-v2-muted">
                Pay by UPI, card or net banking. Cash on delivery where available.
                {freeShipping && " *Free shipping applies to serviceable pincodes."}
              </p>
              <PaymentMarks className="mt-5" />
            </div>
            <p className="mt-4 flex items-start gap-2.5 rounded-v2-lg bg-v2-lilac/60 p-4 text-[13.5px]">
              <IoCubeOutline className="mt-0.5 shrink-0 text-v2-plum" size={18} />
              Arrives in a plain box with no product names on the label, billed under a neutral name.
            </p>
          </aside>
        </div>
      </Container>

      {/* mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-v2-line bg-v2-bg/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[12px] text-v2-muted">Estimated total</p>
            <p className="font-v2-display text-[19px] font-semibold">{inr(subtotal)}</p>
          </div>
          <Button onClick={checkout} loading={checkingOut}>
            Checkout
          </Button>
        </div>
      </div>
      <StickyBarClass />
    </>
  );
};

const Line: React.FC<{
  item: CartItem;
  pending: boolean;
  onQty: (q: number) => void;
  onRemove: () => void;
}> = ({ item, pending, onQty, onRemove }) => {
  const variant = variantLabel(item.size, item.color);
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      className={cx("flex gap-4 p-4 sm:p-5", pending && "opacity-60")}
    >
      <Link to={`/product/${item.productId}`} className="shrink-0">
        <Img src={item.image} alt={item.name} frameClassName="h-[104px] w-[84px] rounded-v2 sm:h-[120px] sm:w-[96px]" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.brand && (
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-v2-muted">{item.brand}</p>
            )}
            <Link to={`/product/${item.productId}`} className="line-clamp-2 text-[15px] font-medium leading-snug hover:text-v2-plum">
              {item.name}
            </Link>
            {variant && <p className="mt-0.5 text-[13px] text-v2-muted">{variant}</p>}
          </div>
          <p className="shrink-0 text-right font-v2-display text-[16px] font-semibold">{inr(item.price * item.quantity)}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-3">
          <div className="flex h-11 items-center rounded-full border border-v2-line md:h-10">
            <button
              type="button"
              onClick={() => onQty(item.quantity - 1)}
              disabled={pending}
              aria-label={item.quantity === 1 ? `Remove ${item.name}` : "Decrease quantity"}
              className="flex h-full w-11 items-center justify-center rounded-l-full hover:bg-v2-sunken md:w-10"
            >
              {item.quantity === 1 ? <IoTrashOutline size={15} /> : <IoRemove />}
            </button>
            <span className="flex w-7 justify-center text-[14px] font-semibold" aria-live="polite">
              {pending ? <Spinner className="h-3.5 w-3.5" /> : item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQty(item.quantity + 1)}
              disabled={pending}
              aria-label="Increase quantity"
              className="flex h-full w-11 items-center justify-center rounded-r-full hover:bg-v2-sunken md:w-10"
            >
              <IoAdd />
            </button>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            {item.quantity > 1 && <span className="hidden text-[12.5px] text-v2-muted sm:inline">{inr(item.price)} each</span>}
            <button
              type="button"
              onClick={onRemove}
              disabled={pending}
              className="-my-2 px-1 py-3 text-[13px] font-semibold text-v2-muted underline-offset-2 hover:text-v2-coral hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

/** Lift the global WhatsApp button above the mobile checkout bar. */
const StickyBarClass: React.FC = () => {
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => document.body.classList.toggle("v2-sticky-bar", mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      document.body.classList.remove("v2-sticky-bar");
    };
  }, []);
  return null;
};

const EmptyCart: React.FC = () => {
  const { products, loading } = useTrendingProducts(10);
  return (
    <>
      <Container className="py-16 text-center md:py-24">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-v2-lilac text-v2-plum">
          <IoBagHandleOutline size={34} />
        </span>
        <h1 className="mt-6 text-[30px] md:text-[38px]">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-sm text-[15px] text-v2-muted">
          Nothing here yet. Browse bestsellers or start with a collection made for you.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <ButtonLink to="/shop" size="lg">
            Start shopping <IoArrowForward />
          </ButtonLink>
          <ButtonLink to="/shop?filter=trending" size="lg" variant="secondary">
            Bestsellers
          </ButtonLink>
        </div>
      </Container>
      {(loading || products.length > 0) && (
        <Section className="border-t border-v2-line">
          <Container>
            <SectionHeader title="Popular right now" />
            <ProductRail products={products} loading={loading} label="Popular products" />
          </Container>
        </Section>
      )}
    </>
  );
};

export default CartPage;
