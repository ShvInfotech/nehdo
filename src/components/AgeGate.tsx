import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AGE_KEY = "nehdo_age_verified";

const AgeGate: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show only on first visit; skip for returning visitors
        const verified = sessionStorage.getItem(AGE_KEY);
        if (!verified) {
            // Small delay so the page renders first
            const t = setTimeout(() => setVisible(true), 300);
            return () => clearTimeout(t);
        }
    }, []);

    const confirm = () => {
        sessionStorage.setItem(AGE_KEY, "true");
        setVisible(false);
    };

    const deny = () => {
        // Redirect away — standard pattern for 18+ gates
        window.location.href = "https://www.google.com";
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 10000,
                        backgroundColor: "rgba(27, 20, 18, 0.85)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="age-gate-heading"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{
                            backgroundColor: "var(--paper)",
                            border: "1px solid var(--hairline)",
                            borderRadius: "2px",
                            maxWidth: "480px",
                            width: "100%",
                            padding: "clamp(32px, 6vw, 56px)",
                            textAlign: "center",
                        }}
                    >
                        {/* Mono label */}
                        <p
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "11px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--clay)",
                                marginBottom: "24px",
                            }}
                        >
                            Age Verification
                        </p>

                        {/* Serif heading */}
                        <h1
                            id="age-gate-heading"
                            style={{
                                fontFamily: "'Instrument Serif', Georgia, serif",
                                fontSize: "clamp(32px, 6vw, 52px)",
                                fontWeight: 400,
                                lineHeight: 1.05,
                                letterSpacing: "-0.02em",
                                color: "var(--ink)",
                                marginBottom: "16px",
                            }}
                        >
                            Are you <em>18 or older?</em>
                        </h1>

                        {/* Supporting copy */}
                        <p
                            style={{
                                fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                                fontSize: "15px",
                                lineHeight: 1.6,
                                color: "var(--ink)",
                                opacity: 0.65,
                                marginBottom: "36px",
                                maxWidth: "340px",
                                margin: "0 auto 36px",
                            }}
                        >
                            Nehdo Wellness is an adult wellness brand. By entering, you confirm you are 18 years of age or older.
                        </p>

                        {/* Buttons */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                alignItems: "center",
                            }}
                        >
                            <button
                                type="button"
                                onClick={confirm}
                                className="btn-primary"
                                style={{ width: "100%", maxWidth: "280px", justifyContent: "center" }}
                            >
                                Yes, I am 18+
                                <span className="btn-arrow">→</span>
                            </button>

                            <button
                                type="button"
                                onClick={deny}
                                className="btn-secondary"
                                style={{ width: "100%", maxWidth: "280px", justifyContent: "center" }}
                            >
                                No, take me back
                            </button>
                        </div>

                        {/* Fine print */}
                        <p
                            style={{
                                marginTop: "24px",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "10px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "var(--ink)",
                                opacity: 0.4,
                            }}
                        >
                            By entering you agree to our Terms &amp; Privacy Policy
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AgeGate;

