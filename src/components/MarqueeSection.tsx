import React from "react";
import { motion } from "framer-motion";
import { products } from "../data/products";

const MarqueeSection = () => {
    // Generate items for the marquee
    const marqueeItems = [
        { text: "Purposefully Designed", image: products[0]?.image },
        { text: "New Season Essential", image: products[1]?.image },
        { text: "Premium Quality", image: products[2]?.image },
        { text: "Timeless Elegance", image: products[3]?.image },
        { text: "Modern Aesthetics", image: products[4]?.image },
    ];

    // Duplicate the items to create a seamless loop
    const duplicatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

    return (
        <section className="py-6 md:py-8 border-y border-brand/10 overflow-hidden mb-16 md:mb-28">
            <div className="relative flex w-full">
                <div className="flex w-max animate-marquee items-center gap-10 md:gap-16">
                    {duplicatedItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-6 md:gap-10">
                            <span className="font-heading text-2xl md:text-4xl font-semibold text-gray-900 whitespace-nowrap">
                                {item.text}
                            </span>
                            {item.image && (
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                                    <img 
                                        src={item.image} 
                                        alt="" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarqueeSection;
