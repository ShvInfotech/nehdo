import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { IoGridOutline, IoListOutline, IoFunnelOutline, IoCloseOutline, IoChevronDown, IoStar } from "react-icons/io5";
import {
  products,
  getCategories,
  getBrands
} from '../data/products';
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest", "Top Rated"];
const priceRanges = [{ label: "Under ₹30", min: 0, max: 30 }, { label: "₹30 – ₹60", min: 30, max: 60 }, { label: "₹60 – ₹100", min: 60, max: 100 }, { label: "Over ₹100", min: 100, max: Infinity }];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Helper to format url param (e.g. "men" -> "Men")
    const formatParam = (p: string | null) => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : null;
const categories = getCategories();
const brands = getBrands();
    const initialCategory = categories.find(c => c.toLowerCase() === searchParams.get("category")?.toLowerCase()) || "All";
    const initialBrand = brands.find(b => b.toLowerCase() === searchParams.get("brand")?.toLowerCase()) || null;

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [sort, setSort] = useState("Featured");
    const [showFilters, setShowFilters] = useState(false);
    const [gridCols, setGridCols] = useState(4);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (selectedCategory !== "All") params.set("category", selectedCategory.toLowerCase());
        else params.delete("category");
        
        if (selectedBrand) params.set("brand", selectedBrand.toLowerCase());
        else params.delete("brand");
        
        setSearchParams(params, { replace: true });
    }, [selectedCategory, selectedBrand, setSearchParams]);

    const filtered = useMemo(() => {
        let result = [...products];
        if (selectedCategory !== "All") result = result.filter(p => p.category === selectedCategory);
        if (selectedBrand) result = result.filter(p => p.brand === selectedBrand);
        if (selectedPrice !== null) {
            const range = priceRanges[selectedPrice];
            result = result.filter(p => p.price >= range.min && p.price < range.max);
        }
        switch (sort) {
            case "Price: Low to High": result.sort((a, b) => a.price - b.price); break;
            case "Price: High to Low": result.sort((a, b) => b.price - a.price); break;
            case "Newest": result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
            case "Top Rated": result.sort((a, b) => b.rating - a.rating); break;
        }
        return result;
    }, [selectedCategory, selectedBrand, selectedPrice, sort]);

    const clearFilters = () => { setSelectedCategory("All"); setSelectedBrand(null); setSelectedPrice(null); };
    const hasFilters = selectedCategory !== "All" || selectedBrand || selectedPrice !== null;

    const FilterPanel = () => (
        <div className="space-y-8">
            {/* Category as Pills */}
            <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-900 mb-4">
                    Category
                </h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setSelectedCategory(c)} 
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                selectedCategory === c 
                                    ? "bg-brand border-brand text-white shadow-button" 
                                    : "bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Brand as Custom Checkboxes */}
            <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-900 mb-4">
                    Brands
                </h3>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map(b => (
                        <label key={b} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedBrand === b} 
                                onChange={() => setSelectedBrand(selectedBrand === b ? null : b)} 
                            />
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                selectedBrand === b ? "bg-brand border-brand" : "border-gray-300 group-hover:border-brand"
                            }`}>
                                {selectedBrand === b && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-sm ${selectedBrand === b ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                {b}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Price as Custom Checkboxes (Radios effectively) */}
            <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-900 mb-4">
                    Price Range
                </h3>
                <div className="space-y-3">
                    {priceRanges.map((r, i) => (
                        <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedPrice === i} 
                                onChange={() => setSelectedPrice(selectedPrice === i ? null : i)} 
                            />
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                selectedPrice === i ? "bg-brand border-brand" : "border-gray-300 group-hover:border-brand"
                            }`}>
                                {selectedPrice === i && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                            </div>
                            <span className={`text-sm ${selectedPrice === i ? "text-gray-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                {r.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {hasFilters && (
                <>
                    <div className="h-px bg-gray-100" />
                    <button 
                        onClick={clearFilters} 
                        className="w-full py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-brand hover:text-white transition-all shadow-sm"
                    >
                        Clear All Filters
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-brand-100 via-brand-50 to-surface rounded-3xl p-8 md:p-12 mb-8">
                <Breadcrumb items={[{ label: "Shop" }]} />
                <h1 className="font-heading text-3xl md:text-5xl font-bold text-gray-900 mt-4">Shop All Products</h1>
                <p className="text-muted mt-2 text-sm md:text-base">Discover {products.length} curated fashion pieces from top brands</p>
            </motion.div>

            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                        <h2 className="font-heading font-bold text-base text-gray-900 mb-4">Filters</h2>
                        <FilterPanel />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-brand transition-colors">
                                <IoFunnelOutline size={16} /> Filters {hasFilters && <span className="w-5 h-5 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">!</span>}
                            </button>
                            <p className="text-sm text-muted"><span className="font-semibold text-gray-900">{filtered.length}</span> products</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand cursor-pointer">
                                {sortOptions.map(o => <option key={o}>{o}</option>)}
                            </select>
                            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                {[4, 3].map(n => (
                                    <button key={n} onClick={() => setGridCols(n)} className={`p-2 rounded-lg transition-all ${gridCols === n ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}>
                                        <IoGridOutline size={16} className={gridCols === n ? "text-brand" : "text-gray-500"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasFilters && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedCategory !== "All" && <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">{selectedCategory} <IoCloseOutline size={14} className="cursor-pointer" onClick={() => setSelectedCategory("All")} /></span>}
                            {selectedBrand && <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">{selectedBrand} <IoCloseOutline size={14} className="cursor-pointer" onClick={() => setSelectedBrand(null)} /></span>}
                            {selectedPrice !== null && <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">{priceRanges[selectedPrice].label} <IoCloseOutline size={14} className="cursor-pointer" onClick={() => setSelectedPrice(null)} /></span>}
                        </div>
                    )}

                    {/* Product Grid */}
                    {filtered.length > 0 ? (
                        <div className={`grid gap-4 md:gap-6 grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><IoFunnelOutline size={32} className="text-gray-400" /></div>
                            <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">No products found</h3>
                            <p className="text-muted text-sm mb-4">Try adjusting your filters</p>
                            <button onClick={clearFilters} className="px-6 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-light transition-colors">Clear Filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showFilters && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setShowFilters(false)} />
                    <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30 }} className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <span className="font-heading text-lg font-bold">Filters</span>
                            <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-100"><IoCloseOutline size={24} /></button>
                        </div>
                        <div className="p-6"><FilterPanel /></div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default Shop;
