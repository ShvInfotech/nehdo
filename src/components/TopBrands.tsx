import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";
import { userapiRequest } from "../services/apiService";

const brandLogos = [
    { name: "Gucci", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/yd39t1mo_expires_30_days.png", width: 140 },
    { name: "Prada", src: "https://images.unsplash.com/photo-1649734927719-9ce8abaf042c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJybmFkJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D", width: 110 },
    { name: "Versace", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/vajq1vdc_expires_30_days.png", width: 140 },
    { name: "Dior", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/f3tqar1o_expires_30_days.png", width: 110 },
    { name: "Chanel", src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/d8wsg97x_expires_30_days.png", width: 90 },
];

const TopBrands = () => {
   
    const [brands,setbrands] = useState(brandLogos)
  const GetBrands = async()=>{
    try {
      const respons = await  userapiRequest('/user/api/v1/common/brands')
      setbrands(respons.brands)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
GetBrands()
  },[])

    const allLogos = [...brands, ...brands];
   

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="relative bg-brand rounded-3xl md:rounded-[2rem] overflow-hidden py-10 md:py-14 px-6 md:px-12"
            >
                {/* Decorative texture */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                </div>

                <div className="relative z-10">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
                        <div>
                            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                                Top Brands. <span className="text-gold">Best Quality.</span>
                            </h2>
                            <p className="text-white/60 text-sm md:text-base max-w-md">
                                Handpicked styles from top brands, curated just for you.
                            </p>
                        </div>

                        <Link
                            to="/brands"
                            className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm"
                        >
                            Shop Top Brands
                            <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                    </div>

                    {/* Marquee Brand Logos */}
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-12 md:gap-20 animate-marquee hover:[animation-play-state:paused]">
                            {allLogos.map((logo, i) => (
                                <div 
    key={`${logo.name}-${i}`} 
    className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0 duration-300" 
> 
    <img 
        src={logo.src} 
        alt={logo.name} 
        style={{ width: logo.width }} 
        className="h-auto object-contain" 
    /> 
</div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default TopBrands;
