import React from "react";
import { Link } from "react-router-dom";
import { IoAlertCircle, IoArrowBack, IoBagHandleOutline, IoClose, IoFlashOutline } from "react-icons/io5";
import { useCheckoutPage } from "../hooks/useCheckout";
import { Breadcrumbs, Button, ButtonLink, Container, Img } from "../components/ui";
import { PaymentMarks, SummaryRow, variantLabel } from "../components/checkout/Parts";
import { inr } from "../lib/format";

/**
 * /checkout — reached by URL only (the cart opens Razorpay directly).
 * Behaviour is the old UI's: it auto-opens Magic Checkout once when the cart has items.
 */
const CheckoutPage: React.FC = () => {
  const c = useCheckoutPage();

  if (c.items.length === 0 && !c.isProcessing) {
    return (
      <Container className="py-20 text-center md:py-28">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-v2-lilac text-v2-plum">
          <IoBagHandleOutline size={34} />
        </span>
        <h1 className="mt-6 text-[30px]">Nothing to check out</h1>
        <p className="mx-auto mt-2 max-w-sm text-[15px] text-v2-muted">Your cart is empty. Add something you like and come back.</p>
        <ButtonLink to="/shop" size="lg" className="mt-7">
          Start shopping
        </ButtonLink>
      </Container>
    );
  }

  const count = c.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Container className="pb-16 pt-5 md:pt-8">
      <div className="mx-auto max-w-[1080px]">
      <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-5 text-[32px] md:text-[40px]">Checkout</h1>

      {c.errorMessage && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-v2-lg border border-v2-coral/30 bg-v2-blush p-4 text-[14px]">
          <IoAlertCircle className="mt-0.5 shrink-0 text-v2-coral" size={18} />
          <p className="flex-1">{c.errorMessage}</p>
          <button onClick={c.dismissError} aria-label="Dismiss" className="text-v2-muted hover:text-v2-ink">
            <IoClose size={18} />
          </button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px]">
        {/* what happens next */}
        <section className="rounded-v2-xl bg-v2-surface p-6 shadow-v2 md:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-v2 bg-v2-lilac text-v2-plum">
            <IoFlashOutline size={22} />
          </span>
          <h2 className="mt-5 text-[22px]">One-step secure checkout</h2>
          <p className="mt-2 text-[15px] text-v2-muted">
            A secure Razorpay window opens to confirm your phone number, address and payment. Eligible coupons and the
            delivery charge for your pincode are shown there before you pay.
          </p>
          <ol className="mt-6 space-y-3 text-[14.5px]">
            {["Confirm your mobile number", "Pick or add a delivery address", "Pay online, or choose cash on delivery where available"].map(
              (s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-v2-sunken text-[13px] font-semibold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ),
            )}
          </ol>
          <Button size="lg" block className="mt-8" onClick={c.pay} loading={c.isProcessing}>
            {c.isProcessing ? "Opening secure checkout…" : `Continue to payment · ${inr(c.finalTotal)}`}
          </Button>
          <PaymentMarks className="mt-5" />
          <Link to="/cart" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-v2-muted hover:text-v2-ink">
            <IoArrowBack /> Back to cart
          </Link>
        </section>

        {/* summary */}
        <aside aria-label="Order summary" className="md:sticky md:top-[calc(var(--v2-header-h)+24px)] md:self-start">
          <div className="rounded-v2-xl border border-v2-line bg-v2-surface p-6">
            <h2 className="text-[18px]">
              Order summary <span className="text-v2-muted">({count})</span>
            </h2>
            <ul className="mt-4 max-h-[320px] space-y-4 overflow-y-auto pr-1">
              {c.items.map((item) => (
                <li key={item._id} className="flex gap-3">
                  <div className="relative shrink-0">
                    <Img src={item.image} alt="" frameClassName="h-16 w-14 rounded-v2-sm" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-v2-ink px-1 text-[11px] font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13.5px] font-medium leading-snug">{item.name}</p>
                    {variantLabel(item.size, item.color) && (
                      <p className="text-[12px] text-v2-muted">{variantLabel(item.size, item.color)}</p>
                    )}
                  </div>
                  <p className="text-[13.5px] font-semibold">{inr(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-v2-line pt-4">
              <SummaryRow label="Subtotal" value={inr(c.subtotal)} />
              {c.discount > 0 && <SummaryRow label="Discount" value={<span className="text-v2-sage">−{inr(c.discount)}</span>} />}
              <SummaryRow label="Shipping" value={c.shipping > 0 ? inr(c.shipping) : "At payment"} muted={!(c.shipping > 0)} />
              <div className="border-t border-v2-line pt-3">
                <SummaryRow label="Total" value={inr(c.finalTotal)} strong />
              </div>
            </dl>
          </div>
        </aside>
      </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
