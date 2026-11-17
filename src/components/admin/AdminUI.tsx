/**
 * Shared building blocks for the admin panel. Same plum/coral brand as the
 * storefront, denser layout for data work. Use these in admin pages instead
 * of re-writing card/table/badge markup per page.
 */
import React from "react";
import { Link } from "react-router-dom";

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/** ₹ with Indian grouping, rounded to whole rupees. */
export const inr = (n: number | null | undefined) => `₹${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

/* ── Page header ───────────────────────────────────────────── */

export const PageHeader: React.FC<{
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-[24px] leading-tight md:text-[28px]">{title}</h1>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

/* ── Surfaces ──────────────────────────────────────────────── */

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }> = ({
  className,
  padded = true,
  ...rest
}) => (
  <div className={cx("rounded-2xl border border-gray-200/70 bg-white shadow-card", padded && "p-5 md:p-6", className)} {...rest} />
);

export const CardHeader: React.FC<{ title: React.ReactNode; action?: { label: string; to: string }; extra?: React.ReactNode }> = ({
  title,
  action,
  extra,
}) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="text-[16px] font-semibold">{title}</h2>
    {extra}
    {action && (
      <Link to={action.to} className="text-sm font-semibold text-brand hover:text-brand-dark">
        {action.label} →
      </Link>
    )}
  </div>
);

/* ── Stats ─────────────────────────────────────────────────── */

const toneMap = {
  plum: "bg-brand-50 text-brand",
  coral: "bg-orange-50 text-accent-dark",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-sky-50 text-sky-600",
} as const;

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ size?: number }>;
  tone?: keyof typeof toneMap;
  hint?: React.ReactNode;
  loading?: boolean;
}> = ({ label, value, icon: Icon, tone = "plum", hint, loading }) => (
  <Card className="flex items-start gap-4">
    <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
      <Icon size={21} />
    </span>
    <div className="min-w-0">
      <p className="text-[13px] font-medium text-gray-500">{label}</p>
      {loading ? (
        <span className="mt-1.5 block h-7 w-24 animate-pulse rounded-md bg-gray-100" />
      ) : (
        <p className="mt-0.5 font-heading text-[26px] font-semibold leading-tight tracking-tight">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  </Card>
);

/* ── Status badge ──────────────────────────────────────────── */

const STATUS_TONES: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  shipped: "bg-sky-50 text-sky-700 ring-sky-600/15",
  out_for_delivery: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
  processing: "bg-brand-50 text-brand ring-brand/15",
  accepted: "bg-brand-50 text-brand ring-brand/15",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/15",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/15",
  inactive: "bg-gray-100 text-gray-600 ring-gray-500/15",
};

export const formatStatus = (s: string) => (s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => (
  <span
    className={cx(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
      STATUS_TONES[(status || "").toLowerCase()] || "bg-gray-100 text-gray-700 ring-gray-500/15",
      className,
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {formatStatus(status)}
  </span>
);

/* ── Buttons ───────────────────────────────────────────────── */

export const adminButton = (variant: "primary" | "secondary" | "ghost" | "danger" = "primary", size: "sm" | "md" = "md") =>
  cx(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-9 px-3 text-[13px]" : "h-11 px-4 text-sm",
    variant === "primary" && "bg-brand text-white shadow-button hover:bg-brand-dark",
    variant === "secondary" && "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    variant === "ghost" && "text-gray-600 hover:bg-gray-100",
    variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
  );

/* ── Empty state ───────────────────────────────────────────── */

export const EmptyState: React.FC<{ icon?: React.ComponentType<{ size?: number }>; title: string; body?: string }> = ({
  icon: Icon,
  title,
  body,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    {Icon && (
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Icon size={22} />
      </span>
    )}
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    {body && <p className="mt-1 max-w-xs text-sm text-gray-400">{body}</p>}
  </div>
);
