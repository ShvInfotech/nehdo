/**
 * Storefront copy and constants used by v2.
 *
 * FREE_SHIPPING_ABOVE must match the server rule in
 * server/src/controller/user/v1/magic.controller.js (`subtotal >= 250`).
 * (v1 copy disagrees: ₹499 in FeaturesSection, ₹999 in TopBar — both wrong.)
 */
export const FREE_SHIPPING_ABOVE = 250;

export const SUPPORT_WHATSAPP = "919714920969";

export const DEFAULT_PROMOS = [
  "Discreet packaging — plain box, no product names",
  "Private billing — appears under a neutral name",
  `Free shipping above ₹${FREE_SHIPPING_ABOVE}`,
  "Cash on delivery available",
  "100% genuine, sealed products",
];

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; note?: string }[];
}

export const NAV: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All products", href: "/shop", note: "Everything we stock" },
      { label: "New arrivals", href: "/shop?filter=new", note: "Just landed" },
      { label: "Bestsellers", href: "/shop?filter=trending", note: "Customer favourites" },
      { label: "On sale", href: "/shop?filter=sale", note: "Limited-time prices" },
    ],
  },
  {
    label: "Shop by need",
    href: "/shop",
    children: [
      { label: "For her", href: "/collection/women" },
      { label: "For him", href: "/collection/men" },
      { label: "For couples", href: "/collection/couples" },
      { label: "Wellness & care", href: "/collection/wellness" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Help", href: "/faq" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "New arrivals", href: "/shop?filter=new" },
      { label: "Bestsellers", href: "/shop?filter=trending" },
      { label: "On sale", href: "/shop?filter=sale" },
    ],
  },
  {
    heading: "By need",
    links: [
      { label: "For her", href: "/collection/women" },
      { label: "For him", href: "/collection/men" },
      { label: "For couples", href: "/collection/couples" },
      { label: "Wellness & care", href: "/collection/wellness" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track an order", href: "/orders" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Nehdo", href: "/about" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];

export const PAYMENT_METHODS = ["UPI", "Visa", "Mastercard", "RuPay", "Net banking", "COD"];
