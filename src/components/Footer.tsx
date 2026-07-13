import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    IoLogoFacebook,
    IoLogoTwitter,
    IoLogoInstagram,
    IoLogoLinkedin,
    IoChevronDown,
    IoArrowForward,
} from "react-icons/io5";

const footerSections = [
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Shop", href: "/shop" },
            { label: "Contact Us", href: "/contact" }
        ],
    },
    {
        title: "Help",
        links: [
            { label: "Customer Support", href: "/contact" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Returns", href: "/returns" },
            { label: "Shipping", href: "/shipping" }
        ],
    },
    {
        title: "FAQ",
        links: [
            { label: "Account", href: "/account" },
            { label: "Orders", href: "/orders" },
            { label: "Payments", href: "/faq" }
        ],
    },
];

const socials = [
    { icon: IoLogoFacebook, label: "Facebook", color: "hover:bg-blue-600" },
    { icon: IoLogoTwitter, label: "Twitter", color: "hover:bg-sky-500" },
    { icon: IoLogoInstagram, label: "Instagram", color: "hover:bg-pink-600" },
    { icon: IoLogoLinkedin, label: "LinkedIn", color: "hover:bg-blue-700" },
];

const Footer = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (title: string) => {
        setOpenSection((prev) => (prev === title ? null : title));
    };

    return (
        <footer className="bg-surface-warm">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 pt-14 md:pt-20 pb-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="inline-block mb-5">
                            <img src="/images/nehdo-logo.png" alt="NEHDO" className="h-8 md:h-10 object-contain" />
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs mb-6">
                            We have clothes that suit your style and which you're proud to wear. From women to men, designed for everyone.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href="#"
                                    className={`w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white ${s.color} hover:border-transparent transition-all shadow-sm hover:shadow-md`}
                                    aria-label={s.label}
                                >
                                    <s.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            {/* Desktop heading */}
                            <h3 className="hidden md:block font-heading font-bold text-sm text-gray-900 uppercase tracking-wider mb-5">
                                {section.title}
                            </h3>

                            {/* Mobile accordion */}
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="md:hidden flex items-center justify-between w-full py-3 border-b border-gray-200"
                            >
                                <span className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
                                    {section.title}
                                </span>
                                <IoChevronDown
                                    className={`text-gray-500 transition-transform ${openSection === section.title ? "rotate-180" : ""}`}
                                    size={16}
                                />
                            </button>

                            {/* Links */}
                            <ul className={`space-y-3 md:block ${openSection === section.title ? "block mt-3" : "hidden"}`}>
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted hover:text-brand transition-colors relative group inline-block"
                                        >
                                            {link.label}
                                            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand transition-all group-hover:w-full" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-6" />

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
                    <p>Nehdo © 2024–2026. All Rights Reserved.</p>
                    <div className="flex items-center gap-3">
                        {/* Payment icons as styled badges */}
                        {["Visa", "MC", "PayPal", "GPay", "Apple"].map((p) => (
                            <div
                                key={p}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 tracking-wider"
                            >
                                {p}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
