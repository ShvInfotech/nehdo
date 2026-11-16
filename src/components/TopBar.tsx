import React, { useState, useEffect } from "react";
import { userapiRequest } from "../services/apiService";

// Default rotating messages — editorial, non-sleazy tone
const DEFAULT_MESSAGES = [
    "Discreet Packaging — nobody knows but you",
    "Secret Billing — shows as a generic name",
    "Free Shipping above ₹999",
    "Cash on Delivery available",
    "Genuine products, always",
    "Easy 7-day returns",
];

const AnnouncementBar: React.FC = () => {
    const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);
    const [dismissed, setDismissed] = useState(false);

    // Optionally fetch from API — same pattern as before, don't change API calls
    useEffect(() => {
        userapiRequest("/user/api/v1/common/promo", "GET")
            .then((res: any) => {
                if (res?.success && Array.isArray(res.promos) && res.promos.length > 0) {
                    setMessages(res.promos);
                }
            })
            .catch(() => {}); // silent fail — defaults show
    }, []);

    if (dismissed) return null;

    // Duplicate messages for seamless marquee loop
    const marqueeItems = [...messages, ...messages];

    return (
        <div
            className="relative overflow-hidden"
            style={{
                backgroundColor: "var(--ink)",
                borderBottom: "1px solid rgba(244,238,230,0.1)",
            }}
            role="banner"
            aria-label="Announcements"
        >
            {/* Marquee track */}
            <div
                className="flex py-3 select-none"
                style={{ width: "max-content" }}
                aria-hidden="true"
            >
                <div className="animate-marquee">
                    {marqueeItems.map((msg, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-6 px-8"
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "11px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "var(--paper)",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {msg}
                            <span style={{ color: "var(--clay)", opacity: 0.7 }}>—</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Dismiss button — far right, screen-reader accessible */}
            <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss announcement"
                style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--paper)",
                    opacity: 0.5,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "14px",
                    lineHeight: 1,
                    padding: "4px",
                    cursor: "pointer",
                    transition: "opacity 150ms ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.5")}
            >
                ×
            </button>
        </div>
    );
};

export default AnnouncementBar;
