import React from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 pb-24">
            <div className="mb-8"><Breadcrumb items={[{ label: "Search Results" }]} /></div>

            <div className="text-center mb-12">
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
                <p className="text-muted text-lg">Found {results.length} results for "<span className="font-semibold text-gray-900">{query}</span>"</p>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoSearchOutline size={40} className="text-gray-400" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold mb-2">No results found</h2>
                    <p className="text-muted mb-8">We couldn't find any products matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default Search;
