import React from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { Link } from "react-router-dom";

const brandLogos = [
    { name: "Gucci", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/yd39t1mo_expires_30_days.png" },
    { name: "Prada", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/lhon3qi1_expires_30_days.png" },
    { name: "Versace", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/vajq1vdc_expires_30_days.png" },
    { name: "Dior", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/f3tqar1o_expires_30_days.png" },
    { name: "Chanel", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/d8wsg97x_expires_30_days.png" },
    { name: "Louis Vuitton", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/bkt7vcv1_expires_30_days.png" }, // Using generic placeholders for others
    { name: "Balenciaga", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/gw9whifd_expires_30_days.png" },
    { name: "Armani", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/b2qfbw9i_expires_30_days.png" },
    { name: "Fendi", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/64ofuakc_expires_30_days.png" },
    { name: "Burberry", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/mb4krc3r_expires_30_days.png" },
];

const Brands = () => {
    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Brands" }]} /></div>

            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Partner Brands</h1>
                <p className="text-muted text-lg">
                    Discover our carefully curated selection of the world's finest fashion brands.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {brandLogos.map((brand, i) => (
                    <Link to={`/shop?brand=${brand.name.toLowerCase()}`} key={brand.name}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-card-hover border border-gray-100 flex items-center justify-center aspect-square transition-all hover:scale-[1.02] cursor-pointer group"
                        >
                            <img 
                                src={brand.src} 
                                alt={brand.name} 
                                className="w-full h-auto max-h-24 object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                            />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Brands;
