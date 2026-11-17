import React from "react";
import Hero from "../components/home/Hero";
import TrustStrip from "../components/home/TrustStrip";
import ShopByNeed from "../components/home/ShopByNeed";
import CategoryGrid from "../components/home/CategoryGrid";
import { Bestsellers, NewArrivals } from "../components/home/ProductSections";
import Combos from "../components/home/Combos";
import PromoBanners from "../components/home/PromoBanners";
import Guide from "../components/home/Guide";
import Brands from "../components/home/Brands";
import Reviews from "../components/home/Reviews";
import Newsletter from "../components/home/Newsletter";
import { NEWSLETTER_ENABLED } from "../config";

/**
 * Order is deliberate: reassure (hero + trust) → orient (needs, categories)
 * → convert (bestsellers, bundles, promos, new) → educate & retain.
 * Data-driven sections hide themselves when the API returns nothing.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ShopByNeed />
      <Bestsellers />
      <CategoryGrid />
      <Combos />
      <PromoBanners />
      <NewArrivals />
      <Guide />
      <Brands />
      <Reviews />
      {NEWSLETTER_ENABLED && <Newsletter />}
    </>
  );
}
