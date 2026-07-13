import React from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";

const Collection = () => {
    const { slug } = useParams();
    // In a real app, you'd fetch collection data based on slug.
    // For now, we'll just show related products.
    const collectionName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ") : "Collection";
    
    // Just a mock filter logic
    const results = products.filter(p => p.category.toLowerCase().includes(slug || "") || p.brand.toLowerCase().includes(slug || ""));
    const displayProducts = results.length > 0 ? results : products; // Fallback

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 pb-24">
            <div className="mb-6"><Breadcrumb items={[{ label: "Collections", href: "/shop" }, { label: collectionName }]} /></div>

            {/* Collection Hero */}
            <div className="bg-brand text-white rounded-3xl p-8 md:p-16 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/64ofuakc_expires_30_days.png')] bg-cover bg-center mix-blend-overlay" />
                <div className="relative z-10">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">{collectionName}</h1>
                    <p className="text-brand-100 max-w-lg text-lg">Explore our curated selection of premium pieces designed for style and comfort.</p>
                </div>
            </div>

            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <p className="text-sm text-muted"><span className="font-semibold text-gray-900">{displayProducts.length}</span> products</p>
                <div className="flex gap-4 text-sm font-semibold text-gray-600">
                    <button className="hover:text-brand">Sort</button>
                    <button className="hover:text-brand">Filter</button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {displayProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
        </div>
    );
};

export default Collection;
