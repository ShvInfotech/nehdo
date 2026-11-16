/** Join class names, skipping falsy values. */
export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/** ₹1,299 — Indian digit grouping, no decimals. */
export const inr = (amount: number) =>
  `₹${Math.round(amount || 0).toLocaleString("en-IN")}`;

/** Whole-number discount percentage, or null when there is no discount. */
export const discountPct = (price: number, original: number | null | undefined) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : null;
