import React from "react";
import { IoCheckmarkCircle, IoLockClosedOutline } from "react-icons/io5";
import { FREE_SHIPPING_ABOVE, PAYMENT_METHODS } from "../../config";
import { cx, inr } from "../../lib/format";

/** Progress toward the server's free-shipping rule (subtotal ≥ FREE_SHIPPING_ABOVE). */
export const FreeShippingBar: React.FC<{ subtotal: number; className?: string }> = ({ subtotal, className }) => {
  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100);
  return (
    <div className={cx("rounded-v2-lg bg-v2-surface p-4 shadow-v2-sm", className)} role="status">
      <p className="flex items-center gap-2 text-[14px] font-medium">
        {remaining === 0 ? (
          <>
            <IoCheckmarkCircle className="shrink-0 text-v2-sage" size={18} />
            You’ve unlocked free shipping
          </>
        ) : (
          <>
            You’re <span className="font-semibold text-v2-plum">{inr(remaining)}</span> away from free shipping
          </>
        )}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-v2-sunken" aria-hidden>
        <div
          className={cx("h-full rounded-full transition-[width] duration-500", remaining === 0 ? "bg-v2-sage" : "bg-v2-plum")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const SummaryRow: React.FC<{ label: React.ReactNode; value: React.ReactNode; muted?: boolean; strong?: boolean }> = ({
  label,
  value,
  muted,
  strong,
}) => (
  <div className={cx("flex items-baseline justify-between gap-4", strong ? "text-[17px] font-semibold" : "text-[14.5px]")}>
    <dt className={muted ? "text-v2-muted" : undefined}>{label}</dt>
    <dd className={cx(strong && "font-v2-display text-[22px]", muted && "text-v2-muted")}>{value}</dd>
  </div>
);

export const PaymentMarks: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-v2-muted">
      <IoLockClosedOutline className="text-v2-sage" /> Secure checkout by Razorpay
    </p>
    <ul className="mx-auto mt-2.5 grid max-w-[300px] grid-cols-3 gap-1.5" aria-label="Accepted payment methods">
      {PAYMENT_METHODS.map((m) => (
        <li key={m} className="truncate rounded-md border border-v2-line bg-v2-surface px-2 py-1 text-center text-[11px] font-semibold text-v2-muted">
          {m}
        </li>
      ))}
    </ul>
  </div>
);

/** Size/colour line, skipping empty values and the "Default" placeholder old stores. */
export const variantLabel = (size?: string, color?: string) =>
  [size && `Size ${size}`, color && color !== "Default" && color].filter(Boolean).join(" · ");
