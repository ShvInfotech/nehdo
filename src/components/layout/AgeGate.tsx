import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui";
import { lockOverlay } from "../../lib/overlay";

/* Same storage key + behaviour as old AgeGate (sessionStorage, redirect on deny). */
const AGE_KEY = "nehdo_age_verified";

const AgeGate: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let verified: string | null = null;
    try {
      verified = sessionStorage.getItem(AGE_KEY);
    } catch {
      /* storage blocked — still show the gate */
    }
    if (!verified) {
      const t = setTimeout(() => setVisible(true), 250);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => (visible ? lockOverlay() : undefined), [visible]);

  const confirm = () => {
    try {
      sessionStorage.setItem(AGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-end justify-center bg-v2-plum-deep/70 p-4 backdrop-blur-md sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="v2-age-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="w-full max-w-[440px] rounded-v2-xl bg-v2-bg p-7 text-center shadow-v2-lg sm:p-9"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-v2-lilac font-v2-display text-lg font-bold text-v2-plum">
              18+
            </span>
            <h2 id="v2-age-title" className="mt-5 text-[26px]">
              Are you 18 or older?
            </h2>
            <p className="mt-2 text-[14.5px] text-v2-muted">
              Nehdo sells sexual wellness products for adults. Please confirm your age to continue.
            </p>
            <div className="mt-7 grid gap-2.5">
              <Button size="lg" block onClick={confirm} autoFocus>
                Yes, I’m 18 or older
              </Button>
              <Button size="lg" block variant="ghost" onClick={() => (window.location.href = "https://www.google.com")}>
                No, take me back
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeGate;
