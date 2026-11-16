/**
 * Storefront copy and constants used by v2.
 *
 * FREE_SHIPPING_ABOVE must match the server rule in
 * server/src/controller/user/v1/magic.controller.js (`subtotal >= 250`).
 * (v1 copy disagrees: ₹499 in FeaturesSection, ₹999 in TopBar — both wrong.)
 */
export const FREE_SHIPPING_ABOVE = 250;

export const SUPPORT_WHATSAPP = "919714920969";
/** Official contact email used across v1 policy pages. */
export const SUPPORT_EMAIL = "nehdoshopping@gmail.com";
/** Full Instagram profile URL. The footer icon is hidden while this is empty. */
export const INSTAGRAM_URL = "";
/**
 * The newsletter section is hidden until a subscribe API exists — v1's form
 * said "You're on the list" but stored nothing. Set to true once
 * sections/home/Newsletter.tsx posts to a real endpoint.
 */
export const NEWSLETTER_ENABLED = false;

/**
 * Default hero slider banners — shown whenever the admin "Hero Slider"
 * banners can't be loaded or none are active (e.g. local dev without the API).
 * Real admin banners always replace these.
 *
 * To use your own: drop images into /public/banners/ and update the paths.
 * Recommended sizes: desktop 1920×800, mobile 1080×1350 (JPG or WebP).
 * Keep key text/products in the centre — the slider crops edges on some screens.
 * Leave title/subtitle empty ("") if the text is already in the image.
 */
export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  href: string;
}

export const HERO_DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    desktopImage: "/banners/banner-1-desktop.svg",
    mobileImage: "/banners/banner-1-mobile.svg",
    title: "Feel good,\nno awkwardness.",
    subtitle: "Genuine products, honest guidance, and a plain box at your door.",
    ctaText: "Shop now",
    href: "/shop",
  },
  {
    id: "default-2",
    desktopImage: "/banners/banner-2-desktop.svg",
    mobileImage: "/banners/banner-2-mobile.svg",
    title: "Bestsellers\npeople love",
    subtitle: "The products our customers come back for.",
    ctaText: "Shop bestsellers",
    href: "/shop?filter=trending",
  },
  {
    id: "default-3",
    desktopImage: "/banners/banner-3-desktop.svg",
    mobileImage: "/banners/banner-3-mobile.svg",
    title: "Made for two",
    subtitle: "Discover products to explore together.",
    ctaText: "Shop for couples",
    href: "/collection/couples",
  },
];

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
