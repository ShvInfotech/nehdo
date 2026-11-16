import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward, IoStar } from "react-icons/io5";
import { cx, discountPct, inr } from "../lib/format";

/* ── Layout ─────────────────────────────────────────────────── */

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cx("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10", className)} {...rest} />
);

export const Section: React.FC<React.HTMLAttributes<HTMLElement> & { tight?: boolean }> = ({
  className,
  tight,
  ...rest
}) => <section className={cx(tight ? "py-10 md:py-14" : "py-14 md:py-20", className)} {...rest} />;

export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; to: string };
  align?: "left" | "center";
  className?: string;
}> = ({ eyebrow, title, description, action, align = "left", className }) => (
  <div
    className={cx(
      "mb-8 flex gap-4 md:mb-10",
      align === "center" ? "flex-col items-center text-center" : "flex-col sm:flex-row sm:items-end sm:justify-between",
      className,
    )}
  >
    <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="text-[28px] sm:text-[34px] md:text-[42px]">{title}</h2>
      {description && <p className="mt-3 text-[15px] text-v2-muted md:text-base">{description}</p>}
    </div>
    {action && (
      <Link
        to={action.to}
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-v2-plum hover:text-v2-plum-deep"
      >
        {action.label}
        <IoArrowForward className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

export const Eyebrow: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...rest }) => (
  <span
    className={cx(
      "inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-v2-plum",
      className,
    )}
    {...rest}
  />
);

export const Breadcrumbs: React.FC<{ items: { label: string; to?: string }[]; className?: string }> = ({
  items,
  className,
}) => (
  <nav aria-label="Breadcrumb" className={cx("text-[13px] text-v2-muted", className)}>
    <ol className="flex flex-wrap items-center gap-1.5">
      <li>
        <Link to="/" className="hover:text-v2-ink">
          Home
        </Link>
      </li>
      {items.map((it, i) => (
        <li key={i} className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden>/</span>
          {it.to && i < items.length - 1 ? (
            <Link to={it.to} className="hover:text-v2-ink">
              {it.label}
            </Link>
          ) : (
            <span aria-current={i === items.length - 1 ? "page" : undefined} className="max-w-[60vw] truncate text-v2-ink">
              {it.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

/* ── Badges ─────────────────────────────────────────────────── */

type Tone = "plum" | "coral" | "sage" | "neutral" | "white";
const tones: Record<Tone, string> = {
  plum: "bg-v2-lilac text-v2-plum",
  coral: "bg-v2-coral text-white",
  sage: "bg-v2-sage/10 text-v2-sage",
  neutral: "bg-v2-sunken text-v2-ink",
  white: "bg-white/90 text-v2-ink backdrop-blur",
};

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }> = ({
  tone = "neutral",
  className,
  ...rest
}) => (
  <span
    className={cx(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
      tones[tone],
      className,
    )}
    {...rest}
  />
);

/* ── Commerce ───────────────────────────────────────────────── */

export const Price: React.FC<{
  price: number;
  original?: number | null;
  size?: "sm" | "md" | "lg";
  showPct?: boolean;
  className?: string;
}> = ({ price, original, size = "md", showPct = true, className }) => {
  const pct = discountPct(price, original);
  const main = { sm: "text-[15px]", md: "text-[17px]", lg: "text-[26px]" }[size];
  return (
    <div className={cx("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cx("font-v2-display font-semibold tracking-tight text-v2-ink", main)}>{inr(price)}</span>
      {pct && (
        <>
          <span className="text-[13px] text-v2-muted line-through">{inr(original!)}</span>
          {showPct && <span className="text-[13px] font-semibold text-v2-coral">{pct}% off</span>}
        </>
      )}
    </div>
  );
};

export const Rating: React.FC<{ value: number; count?: number; className?: string }> = ({
  value,
  count,
  className,
}) => {
  if (!value) return null;
  return (
    <span className={cx("relative inline-flex items-center gap-1 text-[12px] text-v2-muted", className)}>
      <IoStar className="text-[#F5A524]" aria-hidden />
      <span className="font-semibold text-v2-ink">{value.toFixed(1)}</span>
      {!!count && <span>({count})</span>}
      <span className="sr-only">out of 5 stars</span>
    </span>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden className={cx("v2-skeleton rounded-v2", className)} />
);

/** Image with a soft placeholder and graceful fallback when the URL is empty or broken. */
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { frameClassName?: string }> = ({
  src,
  alt = "",
  className,
  frameClassName,
  ...rest
}) => {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className={cx("relative overflow-hidden bg-v2-sunken", frameClassName)}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cx("h-full w-full object-cover", className)}
          {...rest}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center [container-type:inline-size]">
          <span className="font-v2-display text-[min(24px,22cqw)] font-semibold text-v2-plum/25">nehdo</span>
        </div>
      )}
    </div>
  );
};
