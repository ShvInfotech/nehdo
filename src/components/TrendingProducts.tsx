import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import { userapiRequest } from "../services/apiService";
import { Product, products as staticProducts } from "../data/products";
import ProductCard from "./ProductCard";

const TrendingProducts = () => {
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Use already-loaded products from the global store
        const trending = staticProducts.filter(p => p.isTrending).slice(0, 10);
        // If static not loaded yet, fetch
        if (trending.length === 0) {
            userapiRequest("/user/api/v1/product?filter=trending&limit=10", "GET")
                .then((res: any) => {
                    if (res?.products) {
                        const mapped: Product[] = res.products.map((p: any) => ({
                            id: p._id,
                            name: p.name || "",
                            brand: p.brand || "",
                            price: p.salePrice || p.price || 0,
                            originalPrice: p.salePrice && p.salePrice < p.price ? p.price : null,
                            image: p.productImage || "",
                            images: p.productImages || [],
                            category: p.category || "All",
                            subcategory: p.subcategory || "",
                            description: p.longDescription || "",
                            sortdescription: p.shortDescription || "",
                            sizes: p.sizes || [],
                            colors: p.colors || [],
                            variants: p.variants || [],
                            rating: p.avgRating || 0,
                            reviews: p.reviewCount || 0,
                            isNew: p.isNew || false,
                            isTrending: true,
                            tags: p.tags || [],
                        }));
                        setTrendingProducts(mapped);
                    }
                })
                .catch(() => {});
        } else {
            setTrendingProducts(trending);
        }
    }, []);

    const displayProducts = trendingProducts.length > 0
        ? trendingProducts
        : staticProducts.filter(p => p.isTrending).slice(0, 10);

    if (displayProducts.length === 0) return null;

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-10"
            >
                <div>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Trending Products
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mt-3" />
                </div>

                <Link to="/shop" className="group flex items-center gap-2 text-muted hover:text-brand transition-colors text-sm font-medium">
                    View all
                    <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {displayProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>

            {/* Mobile view-all */}
            <div className="mt-8 text-center md:hidden">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-xl text-gray-900 font-semibold text-sm hover:bg-gray-200 transition-colors">
                    View all products <IoArrowForward size={14} />
                </Link>
            </div>
        </section>
    );
};

export default TrendingProducts;
