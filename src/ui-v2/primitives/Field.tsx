import React, { useId } from "react";
import { cx } from "../lib/format";

export const inputClasses =
  "h-12 w-full rounded-v2 border border-v2-line bg-v2-surface px-4 text-[16px] text-v2-ink md:text-[15px] " +
  "placeholder:text-v2-muted/70 transition-colors focus:border-v2-plum focus:outline-none focus:ring-4 focus:ring-v2-plum/10 " +
  "disabled:cursor-default disabled:border-transparent disabled:bg-v2-sunken/70 disabled:text-v2-ink/80";

export const Field: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode; hint?: string }
> = ({ label, icon, hint, className, id, ...rest }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-v2-ink">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-v2-muted">{icon}</span>
        )}
        <input id={inputId} className={cx(inputClasses, !!icon && "pl-11", className)} {...rest} />
      </span>
      {hint && <span className="mt-1.5 block text-[12px] text-v2-muted">{hint}</span>}
    </label>
  );
};
