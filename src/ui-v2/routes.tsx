import React, { lazy } from "react";
import { Route } from "react-router-dom";

/*
 * v2 storefront route tree — same paths as v1.
 * Every storefront page is now a v2 page; admin routes are unaffected.
 * Lazy so v2 code + fonts only load when v2 is switched on.
 */
const AppShell = lazy(() => import("./layout/AppShell"));
const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Listings").then((m) => ({ default: m.ShopPage })));
const Search = lazy(() => import("./pages/Listings").then((m) => ({ default: m.SearchPage })));
const Collection = lazy(() => import("./pages/Listings").then((m) => ({ default: m.CollectionPage })));

const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

const Wishlist = lazy(() => import("./pages/Wishlist"));
const Account = lazy(() => import("./pages/Account"));
const Orders = lazy(() => import("./pages/Orders"));

const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const legal = (name: "TermsPage" | "PrivacyPage" | "ReturnsPage" | "ShippingPage") =>
  lazy(() => import("./pages/Legal").then((m) => ({ default: m[name] })));
const Terms = legal("TermsPage");
const Privacy = legal("PrivacyPage");
const Returns = legal("ReturnsPage");
const Shipping = legal("ShippingPage");
const NotFound = lazy(() => import("./pages/NotFound"));

/** A <Route> element (not a component) so it can sit directly inside <Routes>. */
export const v2StorefrontRoutes = (
  <Route element={<AppShell />}>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/order-confirmation" element={<OrderConfirmation />} />
    <Route path="/account" element={<Account />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/search" element={<Search />} />
    <Route path="/collection/:slug" element={<Collection />} />
    <Route path="/brands" element={<Shop />} />
    <Route path="/about" element={<About />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/returns" element={<Returns />} />
    <Route path="/shipping" element={<Shipping />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
