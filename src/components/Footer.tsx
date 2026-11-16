import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";

// ─── DATA ────────────────────────────────────────────────────
const FOOTER_COLS = [
    {
        heading: "Shop",
        links: [
            { label: "All products",   href: "/shop" },
            { label: "New arrivals",   href: "/shop?filter=new" },
            { label: "Bestsellers",    href: "/shop?filter=trending" },
            { label: "On sale",        href: "/shop?filter=sale" },
        ],
    },
    {
        heading: "By need",
        links: [
            { label: "For her",        href: "/collection/women" },
            { label: "For him",        href: "/collection/men" },
            { label: "For couples",    href: "/collection/couples" },
            { label: "Wellness",       href: "/collection/wellness" },
        ],
    },
    {
        heading: "Help",
        links: [
            { label: "FAQ",            href: "/faq" },
            { label: "Contact us",     href: "/contact" },
            { label: "Shipping info",  href: "/shipping" },
            { label: "Returns",        href: "/returns" },
            { label: "Track order",    href: "/orders" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About",          href: "/about" },
            { label: "Privacy policy", href: "/privacy" },
            { label: "Terms of use",   href: "/terms" },
        ],
    },
];

// Payment marks — just text, no icons
const PAYMENT_MARKS = ["UPI", "Visa", "Mastercard", "RuPay", "GPay", "PhonePe", "COD"];

// ─── MOBILE ACCORDION COL ─────────────────────────────────────
const FooterCol: React.FC<{
    heading: string;
    links: { label: string; href: string }[];
}> = ({ heading, links }) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ borderBottom: "1px solid rgba(244,238,230,0.12)" }}>
            {/* Mobile toggle */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="lg:hidden"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "16px 0",
                    background: "transparent",
                    border: "none",
                    color: "var(--paper)",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    {heading}
                </span>
                {open ? <IoRemoveOutline size={14} /> : <IoAddOutline size={14} />}
            </button>

            {/* Desktop heading */}
            <p
                className="hidden lg:block"
                style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(244,238,230,0.5)",
                    marginBottom: "20px",
                }}
            >
                {heading}
            </p>

            {/* Links */}
            <ul
                className={`lg:block ${open ? "block" : "hidden"}`}
                style={{ listStyle: "none", padding: 0, margin: 0, paddingBottom: open ? "16px" : 0 }}
            >
                {links.map((link) => (
                    <li key={link.label} style={{ marginBottom: "10px" }}>
                        <Link
                            to={link.href}
                            style={{
                                fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "rgba(244,238,230,0.7)",
                                textDecoration: "none",
                                transition: "color 150ms ease",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--paper)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(244,238,230,0.7)")}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ─── FOOTER ──────────────────────────────────────────────────
const Footer: React.FC = () => (
    <footer
        style={{
            backgroundColor: "var(--oxblood)",
            borderTop: "1px solid rgba(244,238,230,0.12)",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* ── Main grid ───────────────────────────────────── */}
        <div
            style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "80px 40px 60px",
            }}
        >
            {/* Top row: brand pitch + columns */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "48px 40px",
                    marginBottom: "72px",
                }}
            >
                {/* Brand column */}
                <div style={{ gridColumn: "span 2", maxWidth: "340px" }}>
                    <p
                        style={{
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontSize: "36px",
                            fontWeight: 400,
                            color: "var(--paper)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            marginBottom: "16px",
                        }}
                    >
                        Nehdo
                    </p>
                    <p
                        style={{
                            fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.65,
                            color: "rgba(244,238,230,0.65)",
                            marginBottom: "24px",
                            maxWidth: "280px",
                        }}
                    >
                        Pleasure is wellness. Nobody has to know.
                        <br />
                        Every order ships in a plain box.
                    </p>

                    {/* Discreet badge */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 14px",
                            border: "1px solid rgba(244,238,230,0.2)",
                            borderRadius: "2px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "rgba(244,238,230,0.6)",
                            }}
                        >
                            Plain box · Secret billing · COD available
                        </span>
                    </div>
                </div>

                {/* Nav columns */}
                {FOOTER_COLS.map((col) => (
                    <FooterCol key={col.heading} heading={col.heading} links={col.links} />
                ))}
            </div>

            {/* ── Hairline ────────────────────────────────── */}
            <div style={{ borderTop: "1px solid rgba(244,238,230,0.12)", marginBottom: "32px" }} />

            {/* ── Bottom row ──────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                {/* Copyright + 18+ disclaimer */}
                <div>
                    <p
                        style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "10px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(244,238,230,0.4)",
                            marginBottom: "6px",
                        }}
                    >
                        © {new Date().getFullYear()} Nehdo Wellness. All rights reserved.
                    </p>
                    <p
                        style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "10px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(244,238,230,0.3)",
                        }}
                    >
                        18+ only · For adults in India · Content is for educational/wellness purposes
                    </p>
                </div>

                {/* Payment marks — plain text */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                    }}
                >
                    {PAYMENT_MARKS.map((mark) => (
                        <span
                            key={mark}
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "rgba(244,238,230,0.35)",
                                padding: "4px 8px",
                                border: "1px solid rgba(244,238,230,0.12)",
                                borderRadius: "2px",
                            }}
                        >
                            {mark}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* ── Giant cropped wordmark at bottom ───────────── */}
        <div
            aria-hidden="true"
            style={{
                position: "relative",
                overflow: "hidden",
                height: "clamp(60px, 10vw, 120px)",
                lineHeight: 1,
                borderTop: "1px solid rgba(244,238,230,0.08)",
            }}
        >
            <span
                style={{
                    display: "block",
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: "clamp(100px, 20vw, 240px)",
                    fontWeight: 400,
                    color: "rgba(244,238,230,0.06)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.75,
                    paddingLeft: "32px",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                }}
            >
                Nehdo Wellness
            </span>
        </div>
    </footer>
);

export default Footer;
