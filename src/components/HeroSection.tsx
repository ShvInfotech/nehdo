import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoArrowForward, IoChevronDown, IoStar, IoFlashOutline, IoShieldCheckmarkOutline } from "react-icons/io5";


/* ───────────────────────────────────────────
   Floating Particle Component
   ─────────────────────────────────────────── */
const Particle = ({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) => (
    <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: size, height: size, left: x, top: y, background: color }}
        animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
);

/* ───────────────────────────────────────────
   Rotating Text Ring
   ─────────────────────────────────────────── */
const RotatingBadge = () => {
    const text = " ★ SUMMER COLLECTION ★ NEW ARRIVALS ★ TRENDING ";
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 md:w-40 md:h-40"
        >
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    <path id="circlePath" d="M 100 100 m -75 0 a 75 75 0 1 1 150 0 a 75 75 0 1 1 -150 0" />
                </defs>
                <text className="fill-brand/40 text-[13px] font-bold tracking-[4px] uppercase">
                    <textPath href="#circlePath">{text}</textPath>
                </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand text-white flex items-center justify-center shadow-button">
                    <span className="font-heading text-lg md:text-xl font-extrabold">50%</span>
                </div>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════ */
const HeroSection = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const sliderImages = [
        "/images/hero-model.png",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
    ];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % sliderImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);


    // Mouse parallax for floating elements
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02);
        mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02);
    };

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen md:min-h-[95vh] flex items-center overflow-hidden"
        >
            {/* ── Multi‑layer background ── */}
            <motion.div style={{ scale: bgScale }} className="absolute inset-0">
                {/* Mesh gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6F2] via-[#F5EDE3] to-[#EDE0D1]" />
                {/* Radial accent glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-gradient-radial from-brand/8 via-transparent to-transparent rounded-full" />
                <div className="absolute bottom-[-30%] left-[-15%] w-[50vw] h-[50vw] bg-gradient-radial from-accent/6 via-transparent to-transparent rounded-full" />
                {/* Grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
            </motion.div>

            {/* ── Floating particles ── */}
            <Particle delay={0} size={6} x="10%" y="20%" color="rgba(126,66,15,0.15)" />
            <Particle delay={1.5} size={4} x="25%" y="70%" color="rgba(201,169,110,0.25)" />
            <Particle delay={2.8} size={8} x="75%" y="15%" color="rgba(234,138,84,0.12)" />
            <Particle delay={0.8} size={5} x="85%" y="60%" color="rgba(126,66,15,0.1)" />
            <Particle delay={3.5} size={3} x="50%" y="85%" color="rgba(201,169,110,0.2)" />
            <Particle delay={1.2} size={7} x="60%" y="30%" color="rgba(234,138,84,0.08)" />
            <Particle delay={2.0} size={4} x="35%" y="45%" color="rgba(126,66,15,0.12)" />

            {/* ── Decorative grid lines (subtle) ── */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
                <div className="absolute top-0 left-1/4 w-px h-full bg-brand" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-brand" />
                <div className="absolute top-0 left-3/4 w-px h-full bg-brand" />
                <div className="absolute top-1/3 left-0 w-full h-px bg-brand" />
                <div className="absolute top-2/3 left-0 w-full h-px bg-brand" />
            </div>

            {/* ═══════ Content ═══════ */}
            <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-16 py-8 md:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[85vh]">

                    {/* ─── Left: Content (7 cols) ─── */}
                    <motion.div style={{ y: textY }} className="lg:col-span-7 flex flex-col items-start relative z-20">

                        {/* Animated badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-brand/15 to-gold/15 backdrop-blur-sm text-brand px-5 py-2.5 rounded-full mb-8 border border-brand/10"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 bg-brand rounded-full"
                            />
                            <span className="text-sm font-bold tracking-wide uppercase">New Collection 2026</span>
                            <IoFlashOutline className="text-gold" size={14} />
                        </motion.div>

                        {/* ── Headline with creative typography ── */}
                        <div className="mb-6 md:mb-8">
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-heading text-[3.2rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[0.95] tracking-tight"
                                >
                                    <span className="text-gray-900">Elevate</span>
                                </motion.h1>
                            </div>
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-heading text-[3.2rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[0.95] tracking-tight"
                                >
                                    <span className="text-gray-900">Your </span>
                                    <span className="relative inline-block">
                                        <span className="relative z-10 bg-gradient-to-r from-brand via-accent to-gold bg-clip-text text-transparent">
                                            Everyday
                                        </span>
                                        {/* Underline brush stroke */}
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                                            className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-2 md:h-3 bg-gradient-to-r from-brand/20 via-accent/30 to-gold/20 rounded-full origin-left"
                                        />
                                    </span>
                                </motion.h1>
                            </div>
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="font-heading text-[3.2rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[0.95] tracking-tight text-gray-900"
                                >
                                    Style<span className="text-brand">.</span>
                                </motion.h1>
                            </div>
                        </div>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="text-muted text-base md:text-lg max-w-xl mb-8 leading-relaxed"
                        >
                            Discover curated fashion that speaks your language. <span className="text-gray-800 font-medium">Premium quality</span>, modern designs, delivered to your door.
                        </motion.p>

                        {/* ── Search Bar ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.95 }}
                            className="w-full max-w-xl mb-8"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 via-accent/10 to-gold/20 rounded-[1.25rem] blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex items-center bg-white rounded-2xl border border-gray-200/80 shadow-card group-focus-within:shadow-card-hover group-focus-within:border-brand/30 transition-all duration-300">
                                    <IoSearchOutline size={20} className="ml-5 text-gray-400 group-focus-within:text-brand transition-colors flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search clothing, shoes, bags..."
                                        className="flex-1 px-4 py-4 md:py-5 text-sm md:text-base bg-transparent focus:outline-none placeholder:text-gray-400"
                                    />
                                    <button className="mr-2 bg-brand hover:bg-brand-light text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-sm font-semibold shadow-button hover:shadow-button-hover hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2 flex-shrink-0">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── CTA Buttons ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="flex flex-wrap items-center gap-4 mb-10"
                        >
                            <a href="/shop" className="group relative inline-flex items-center gap-3 bg-brand text-white px-9 py-4 rounded-2xl text-base font-bold shadow-button overflow-hidden">
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="relative z-10">Shop Now</span>
                                <IoArrowForward className="relative z-10 group-hover:translate-x-1.5 transition-transform" size={18} />
                            </a>
                            <a href="/collection" className="group inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-bold text-gray-800 border-2 border-gray-300 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all">
                                Explore Collection
                                <span className="w-0 group-hover:w-5 overflow-hidden transition-all duration-300">
                                    <IoArrowForward size={16} />
                                </span>
                            </a>
                        </motion.div>


                    </motion.div>

                    {/* ─── Right: Immersive Visual (5 cols) ─── */}
                    <motion.div
                        style={{ y: imageY, x: springX, rotateY: springX }}
                        className="lg:col-span-5 relative hidden lg:flex justify-center items-center"
                    >
                        <div className="relative w-full max-w-[520px]">
                            {/* ── Main hero image ── */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImage}
                                        src={sliderImages[currentImage]}
                                        alt="Fashion model in premium outfit"
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                {/* Color overlay for brand cohesion */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold/10" />

                                {/* Bottom info strip */}
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.0, duration: 0.6 }}
                                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                                >
                                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Trending Now</p>
                                    <p className="text-white font-heading text-lg font-bold">Summer '26 Collection</p>
                                </motion.div>
                            </motion.div>

                            {/* ── Floating product card ── */}
                            <motion.div
                                initial={{ opacity: 0, x: 40, y: 20 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
                                style={{ y: springY }}
                                className="absolute -right-8 top-[15%] z-20"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-card-hover p-4 w-[160px] border border-white/50"
                                >
                                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 mb-3 overflow-hidden">
                                        <img src="/images/hero-products.png" alt="Featured product" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="font-heading text-xs font-bold text-gray-800 truncate">Premium Jacket</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-accent font-bold text-sm">₹59.99</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => <IoStar key={i} size={8} className="text-gold" />)}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* ── Rotating badge ── */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                                className="absolute -left-10 -bottom-6 z-20"
                            >
                                <RotatingBadge />
                            </motion.div>

                            {/* ── Floating trust badge ── */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3, type: "spring" }}
                                style={{ x: springX }}
                                className="absolute -left-12 top-[40%] z-20"
                            >
                                <motion.div
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-card-hover p-3.5 border border-white/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">Free Shipping</p>
                                            <p className="text-[10px] text-muted">Orders above ₹250</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* ── Decorative shapes behind image ── */}
                            <div className="absolute -z-10 -top-8 -right-8 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-brand/10 to-accent/10 blur-sm" />
                            <motion.div
                                animate={{ rotate: [0, 3, 0, -3, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -z-10 -bottom-6 -left-6 w-3/4 h-3/4 rounded-[2rem] border-2 border-dashed border-brand/15"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            >
                <span className="text-[10px] text-muted font-semibold uppercase tracking-[3px]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-5 h-9 rounded-full border-2 border-brand/30 flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-brand rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
