import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowUp } from "react-icons/io5";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const h = () => setVisible(window.scrollY > 600);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-brand text-white rounded-full shadow-button hover:shadow-button-hover hover:bg-brand-light flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    aria-label="Scroll to top"
                >
                    <IoArrowUp size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

const ScrollRestoration: React.FC = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const Layout: React.FC = () => (
    <div className="flex flex-col min-h-screen bg-surface">
        <ScrollRestoration />
        <TopBar />
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
        <AuthModal />
        <ScrollToTop />
    </div>
);

export default Layout;
