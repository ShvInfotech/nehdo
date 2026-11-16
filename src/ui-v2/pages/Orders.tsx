import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoAlertCircleOutline,
  IoArrowForward,
  IoBagHandleOutline,
  IoCheckmark,
  IoChevronDown,
  IoCloseCircleOutline,
  IoOpenOutline,
  IoRefresh,
  IoStar,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import {
  CANCEL_REASONS,
  RETURN_REASONS,
  ORDER_TABS,
  itemName,
  useOrderActions,
  useOrders,
  type ApiOrder,
  type DisplayStatus,
} from "../hooks/useAccount";
import AccountShell, { SignInGate } from "../layout/AccountShell";
import { Button, ButtonLink, Field, Img, Sheet, Skeleton } from "../primitives";
import { inputClasses } from "../primitives/Field";
import { variantLabel } from "../checkout/Parts";
import { cx, inr } from "../lib/format";

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const STATUS_STYLE: Record<DisplayStatus, string> = {
  Processing: "bg-v2-lilac text-v2-plum",
  Shipped: "bg-v2-butter text-[#8a6100]",
  "Out for Delivery": "bg-v2-blush text-v2-coral",
  Delivered: "bg-v2-sage/15 text-v2-sage",
  Cancelled: "bg-v2-sunken text-v2-muted",
};

const OrdersPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <SignInGate title="Sign in to see your orders" body="Track deliveries, cancel or return items, and leave reviews." />;
  }
  return <OrdersList />;
};

const OrdersList: React.FC = () => {
  const o = useOrders();
  return (
    <AccountShell
      title="Your orders"
      crumb="Orders"
      actions={
        <Button variant="ghost" size="sm" onClick={o.refetch} disabled={o.loading}>
          <IoRefresh className={o.loading ? "animate-spin" : ""} /> Refresh
        </Button>
      }
    >
      <div role="tablist" aria-label="Filter orders" className="v2-no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {ORDER_TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={o.tab === t}
            onClick={() => o.setTab(t)}
            className={cx(
              "shrink-0 inline-flex min-h-11 items-center rounded-full md:min-h-0 px-4 py-2 text-[13.5px] font-semibold transition-colors",
              o.tab === t ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface hover:border-v2-ink/30",
            )}
          >
            {t}
            {!!o.counts[t] && <span className={cx("ml-1.5", o.tab === t ? "text-white/70" : "text-v2-muted")}>{o.counts[t]}</span>}
          </button>
        ))}
      </div>

      {o.loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-v2-xl" />
          ))}
        </div>
      ) : o.error ? (
        <div role="alert" className="rounded-v2-xl border border-v2-coral/30 bg-v2-blush px-6 py-10 text-center">
          <IoAlertCircleOutline className="mx-auto text-v2-coral" size={30} />
          <p className="mt-3 font-semibold">We couldn’t load your orders</p>
          <p className="mt-1 text-[14px] text-v2-muted">{o.error}</p>
          <Button className="mt-5" onClick={o.refetch}>
            Try again
          </Button>
        </div>
      ) : o.orders.length === 0 ? (
        <div className="rounded-v2-xl border border-dashed border-v2-line px-6 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-v2-lilac text-v2-plum">
            <IoBagHandleOutline size={28} />
          </span>
          <p className="mt-5 font-v2-display text-[22px] font-semibold">
            {o.tab === "All" ? "No orders yet" : `No ${o.tab.toLowerCase()} orders`}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-v2-muted">
            {o.tab === "All" ? "When you place an order, it’ll show up here." : "Try another tab to see the rest."}
          </p>
          {o.tab === "All" && (
            <ButtonLink to="/shop" className="mt-6">
              Start shopping
            </ButtonLink>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {o.orders.map((order) => (
            <li key={order._id}>
              <OrderCard order={order} onUpdated={o.refetch} />
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
};

/* ── Card ─────────────────────────────────────────────────────── */

const OrderCard: React.FC<{ order: ApiOrder; onUpdated: () => void }> = ({ order, onUpdated }) => {
  const a = useOrderActions(order, onUpdated);
  const [open, setOpen] = useState(false);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const detailsId = `order-${order._id}`;

  return (
    <article className="overflow-hidden rounded-v2-xl border border-v2-line bg-v2-surface">
      <button
        type="button"
        onClick={() => setOpen((x) => !x)}
        aria-expanded={open}
        aria-controls={detailsId}
        className="flex w-full flex-col gap-4 p-5 text-left transition-colors hover:bg-v2-sunken/40 sm:flex-row sm:items-center md:p-6"
      >
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((it) => (
            <Img key={it._id} src={it.image} alt="" frameClassName="h-16 w-14 rounded-v2-sm ring-2 ring-v2-surface" />
          ))}
          {order.items.length > 3 && (
            <span className="flex h-16 w-14 items-center justify-center rounded-v2-sm bg-v2-sunken text-[13px] font-semibold ring-2 ring-v2-surface">
              +{order.items.length - 3}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx("rounded-full px-2.5 py-1 text-[12px] font-semibold", STATUS_STYLE[a.status])}>{a.status}</span>
            <span className="text-[13px] text-v2-muted">
              {a.status === "Delivered" && order.deliveredAt ? `Delivered ${fmtDate(order.deliveredAt)}` : `Placed ${fmtDate(order.createdAt)}`}
            </span>
          </div>
          <p className="mt-1.5 truncate text-[15px] font-semibold">
            #{order.orderNumber} · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="font-v2-display text-[19px] font-semibold">{inr(order.totalAmount)}</span>
          <IoChevronDown className={cx("text-v2-muted transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div id={detailsId} className="border-t border-v2-line p-5 md:p-6">
          <Progress status={a.status} />

          {(order.trackingNumber || order.trackingUrl) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-v2-lg bg-v2-sunken/70 p-4 text-[14px]">
              <span>
                Tracking number <span className="font-semibold">{order.trackingNumber || "—"}</span>
              </span>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-v2-plum hover:underline"
                >
                  Track shipment <IoOpenOutline />
                </a>
              )}
            </div>
          )}

          <ul className="mt-5 divide-y divide-v2-line">
            {order.items.map((it) => (
              <li key={it._id} className="flex gap-4 py-3">
                <Link to={`/product/${it.productId}`} className="shrink-0">
                  <Img src={it.image} alt="" frameClassName="h-[72px] w-[60px] rounded-v2-sm" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${it.productId}`} className="line-clamp-2 text-[14.5px] font-medium hover:text-v2-plum">
                    {itemName(it)}
                  </Link>
                  <p className="text-[13px] text-v2-muted">
                    {[variantLabel(it.size, it.color), `Qty ${it.quantity}`].filter(Boolean).join(" · ")}
                  </p>
                  <Link to={`/product/${it.productId}`} className="mt-1 inline-block text-[13px] font-semibold text-v2-plum hover:underline">
                    Buy again
                  </Link>
                </div>
                <span className="text-[14.5px] font-semibold">{inr(it.total ?? it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {order.shippingAddress && (
              <div className="rounded-v2-lg border border-v2-line p-4 text-[14px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-v2-muted">Delivering to</p>
                <p className="mt-2 leading-relaxed">
                  {order.shippingAddress.addressline}
                  {order.shippingAddress.landmark && <>, {order.shippingAddress.landmark}</>}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                {order.payment?.method && (
                  <p className="mt-3 text-[13px] text-v2-muted">
                    Paid via <span className="font-semibold uppercase text-v2-ink">{order.payment.method}</span>
                    {order.payment.status && ` · ${order.payment.status}`}
                  </p>
                )}
              </div>
            )}
            <dl className="space-y-2 rounded-v2-lg border border-v2-line p-4 text-[14px]">
              <Row label="Subtotal" value={inr(order.subtotal)} />
              {order.discount > 0 && <Row label="Discount" value={<span className="text-v2-sage">−{inr(order.discount)}</span>} />}
              <Row label="Shipping" value={order.shippingCharge > 0 ? inr(order.shippingCharge) : "Free"} />
              <div className="border-t border-v2-line pt-2">
                <Row label={<span className="font-semibold">Total</span>} value={<span className="font-v2-display text-[17px] font-semibold">{inr(order.totalAmount)}</span>} />
              </div>
            </dl>
          </div>

          {(a.canCancel || a.canReturn) && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {a.canCancel && (
                <Button variant="secondary" size="sm" onClick={() => a.open("cancel")}>
                  <IoCloseCircleOutline /> Cancel order
                </Button>
              )}
              {a.canReturn && (
                <Button variant="secondary" size="sm" onClick={() => a.open("return")}>
                  <IoRefresh /> Request a return
                </Button>
              )}
            </div>
          )}

          {a.canReview && <ReviewBox a={a} />}
        </div>
      )}

      <ActionSheet order={order} a={a} />
    </article>
  );
};

const Row: React.FC<{ label: React.ReactNode; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="text-v2-muted">{label}</dt>
    <dd>{value}</dd>
  </div>
);

const STEPS: DisplayStatus[] = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

const Progress: React.FC<{ status: DisplayStatus }> = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <p className="flex items-center gap-2 rounded-v2-lg bg-v2-sunken p-4 text-[14px] text-v2-muted">
        <IoCloseCircleOutline size={18} /> This order was cancelled.
      </p>
    );
  }
  const at = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-1" aria-label={`Order status: ${status}`}>
      {STEPS.map((s, i) => {
        const done = i <= at;
        return (
          <li key={s} className="text-center">
            <div className="flex items-center">
              <span className={cx("h-1 flex-1 rounded-full", i === 0 ? "bg-transparent" : done ? "bg-v2-plum" : "bg-v2-line")} />
              <span
                className={cx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                  done ? "bg-v2-plum text-white" : "bg-v2-sunken text-v2-muted",
                )}
                aria-current={i === at ? "step" : undefined}
              >
                {done ? <IoCheckmark size={14} /> : i + 1}
              </span>
              <span className={cx("h-1 flex-1 rounded-full", i === STEPS.length - 1 ? "bg-transparent" : i < at ? "bg-v2-plum" : "bg-v2-line")} />
            </div>
            <p className={cx("mt-2 text-[11.5px] leading-tight sm:text-[12.5px]", done ? "font-semibold" : "text-v2-muted")}>{s}</p>
          </li>
        );
      })}
    </ol>
  );
};

type Actions = ReturnType<typeof useOrderActions>;

const ReviewBox: React.FC<{ a: Actions }> = ({ a }) =>
  a.reviewSubmitted ? (
    <p className="mt-6 flex items-center gap-2 rounded-v2-lg bg-v2-sage/10 p-4 text-[14px] font-medium text-v2-sage">
      <IoCheckmark size={18} /> Thanks — your review was submitted.
    </p>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        a.submitReview();
      }}
      className="mt-6 rounded-v2-lg bg-v2-sunken/60 p-5"
    >
      <p className="font-semibold">How was this order?</p>
      <p className="text-[13px] text-v2-muted">Your rating applies to every product in this order.</p>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={a.review.rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => a.setReview((r) => ({ ...r, rating: n }))}
            className={cx("p-0.5 text-[26px] transition-transform hover:scale-110", n <= a.review.rating ? "text-[#F5A524]" : "text-v2-line")}
          >
            <IoStar />
          </button>
        ))}
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Your review</span>
        <textarea
          value={a.review.review}
          onChange={(e) => a.setReview((r) => ({ ...r, review: e.target.value }))}
          rows={3}
          placeholder="What did you like? Anything we could do better?"
          className={cx(inputClasses, "h-auto py-3")}
        />
      </label>
      <Button type="submit" size="sm" className="mt-3" loading={a.reviewBusy}>
        Submit review <IoArrowForward />
      </Button>
    </form>
  );

const ActionSheet: React.FC<{ order: ApiOrder; a: Actions }> = ({ order, a }) => {
  const isCancel = a.modal === "cancel";
  const reasons = isCancel ? CANCEL_REASONS : RETURN_REASONS;
  return (
    <Sheet open={!!a.modal} onClose={a.close} side="center" title={isCancel ? "Cancel order" : "Request a return"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.submit();
        }}
        className="space-y-4 p-6"
      >
        <p className="text-[14.5px] text-v2-muted">
          Order <span className="font-semibold text-v2-ink">#{order.orderNumber}</span>
          {isCancel ? " will be cancelled before it ships." : ". Tell us what went wrong."}
        </p>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold">Reason</span>
          <select value={a.reason} onChange={(e) => a.setReason(e.target.value)} className={cx(inputClasses, "cursor-pointer")} required>
            <option value="">Select a reason</option>
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        {!isCancel && a.isCodPaid && (
          <fieldset className="space-y-3 rounded-v2-lg border border-v2-line p-4">
            <legend className="px-1 text-[13px] font-semibold">Refund bank account</legend>
            <p className="text-[13px] text-v2-muted">You paid cash on delivery, so we need an account to refund to.</p>
            <Field label="Account holder name" value={a.bank.holderName} onChange={(e) => a.setBank("holderName", e.target.value)} autoComplete="name" />
            <Field
              label="Account number"
              inputMode="numeric"
              value={a.bank.accountNumber}
              onChange={(e) => a.setBank("accountNumber", e.target.value.replace(/\D/g, ""))}
              autoComplete="off"
            />
            <Field
              label="IFSC code"
              value={a.bank.ifscCode}
              onChange={(e) => a.setBank("ifscCode", e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              autoComplete="off"
            />
          </fieldset>
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={a.close} disabled={a.busy}>
            {isCancel ? "Keep order" : "Not now"}
          </Button>
          <Button type="submit" variant={isCancel ? "primary" : "accent"} loading={a.busy} disabled={!a.canSubmit}>
            {isCancel ? "Cancel order" : "Submit return request"}
          </Button>
        </div>
      </form>
    </Sheet>
  );
};

export default OrdersPage;
