import React from "react";
import HeroSection from "../components/HeroSection";
import MarqueeSection from "../components/MarqueeSection";
import FeaturesSection from "../components/FeaturesSection";
import ShopByCategory from "../components/ShopByCategory";
import TrendingProducts from "../components/TrendingProducts";
import PromotionalBanners from "../components/PromotionalBanners";
import NewArrivals from "../components/NewArrivals";
import TopBrands from "../components/TopBrands";
import Testimonials from "../components/Testimonials";
import BlogSection from "../components/BlogSection";
import NewsletterSection from "../components/NewsletterSection";

export default function Home() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <ShopByCategory />
            <TrendingProducts />
            <MarqueeSection />
            <PromotionalBanners />
            <NewArrivals />
            <TopBrands />
            <Testimonials />
            <BlogSection />
            <NewsletterSection />
        </>
    );
}
