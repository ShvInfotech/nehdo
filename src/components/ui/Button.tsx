import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { cx } from "../../lib/format";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-v2-sans font-semibold whitespace-nowrap " +
  "transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary: "bg-v2-plum text-white hover:bg-v2-plum-deep shadow-v2-sm",
  accent: "bg-v2-coral text-white hover:brightness-95 shadow-v2-sm",
  secondary: "bg-v2-surface text-v2-ink border border-v2-line hover:border-v2-ink/30",
  ghost: "text-v2-ink hover:bg-v2-sunken",
  inverse: "bg-white text-v2-plum-deep hover:bg-v2-blush",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-[13px] md:h-9",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

export const buttonClasses = (
  variant: Variant = "primary",
  size: Size = "md",
  block = false,
  className?: string,
) => cx(base, variants[variant], sizes[size], block && "w-full", className);

interface CommonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
}

export const Button: React.FC<CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  variant,
  size,
  block,
  loading,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}) => (
  <button
    type={type}
    className={buttonClasses(variant, size, block, className)}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading && <Spinner />}
    {children}
  </button>
);

export const ButtonLink: React.FC<CommonProps & LinkProps> = ({
  variant,
  size,
  block,
  className,
  ...rest
}) => <Link className={buttonClasses(variant, size, block, className)} {...rest} />;

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden
    className={cx(
      "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
      className,
    )}
  />
);

/** Round icon-only button, optional count badge. Always pass `label`. */
export const IconButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; count?: number; tone?: "default" | "inverse" }
> = ({ label, count, tone = "default", className, children, type = "button", ...rest }) => (
  <button
    type={type}
    aria-label={count ? `${label} (${count})` : label}
    className={cx(
      "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors md:h-10 md:w-10",
      tone === "default" ? "text-v2-ink hover:bg-v2-sunken" : "text-white hover:bg-white/10",
      className,
    )}
    {...rest}
  >
    {children}
    {!!count && count > 0 && (
      <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-v2-coral px-1 text-[10px] font-bold leading-none text-white ring-2 ring-v2-bg">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </button>
);
