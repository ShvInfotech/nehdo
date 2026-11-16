import React from "react";
import Hero from "../sections/home/Hero";
import TrustStrip from "../sections/home/TrustStrip";
import ShopByNeed from "../sections/home/ShopByNeed";
import CategoryGrid from "../sections/home/CategoryGrid";
import { Bestsellers, NewArrivals } from "../sections/home/ProductSections";
import Combos from "../sections/home/Combos";
import PromoBanners from "../sections/home/PromoBanners";
import Guide from "../sections/home/Guide";
import Brands from "../sections/home/Brands";
import Reviews from "../sections/home/Reviews";
import Newsletter from "../sections/home/Newsletter";
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
