/**
 * Storefront Tailwind extension.
 * Every value points at a CSS variable defined in ./v2.css, so the whole
 * palette can be retuned from one file without touching components.
 * Namespaced under `v2` so nothing collides with the older admin theme.
 */
const c = (name) => `rgb(var(--v2-${name}) / <alpha-value>)`;

module.exports = {
  colors: {
    v2: {
      bg: c("bg"),
      surface: c("surface"),
      sunken: c("sunken"),
      ink: c("ink"),
      muted: c("muted"),
      line: c("line"),
      plum: c("plum"),
      "plum-deep": c("plum-deep"),
      coral: c("coral"),
      blush: c("blush"),
      lilac: c("lilac"),
      sage: c("sage"),
      butter: c("butter"),
    },
  },
  fontFamily: {
    "v2-display": ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
    "v2-sans": ['"DM Sans"', "system-ui", "sans-serif"],
  },
  borderRadius: {
    "v2-sm": "10px",
    v2: "16px",
    "v2-lg": "24px",
    "v2-xl": "32px",
  },
  boxShadow: {
    "v2-sm": "0 1px 2px rgb(34 24 38 / 0.06), 0 1px 1px rgb(34 24 38 / 0.04)",
    v2: "0 8px 24px -12px rgb(46 18 56 / 0.18), 0 2px 6px rgb(46 18 56 / 0.06)",
    "v2-lg": "0 24px 48px -20px rgb(46 18 56 / 0.30), 0 4px 12px rgb(46 18 56 / 0.08)",
  },
};
