import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { usePromos } from "../../hooks/useHomeData";

/** One message at a time, auto-rotating, manual arrows. Calm, not a ticker. */
const AnnouncementBar: React.FC = () => {
  const messages = usePromos();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, [messages.length]);

  const step = (d: number) => setI((n) => (n + d + messages.length) % messages.length);

  return (
    <div className="bg-v2-plum-deep text-white">
      <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between gap-2 px-2 sm:px-6">
        <button aria-label="Previous message" onClick={() => step(-1)} className="rounded-full p-1.5 text-white/60 hover:text-white">
          <IoChevronBack size={14} />
        </button>
        <div className="relative h-full flex-1 overflow-hidden text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center truncate text-[12.5px] font-medium tracking-wide"
            >
              {messages[i % messages.length]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button aria-label="Next message" onClick={() => step(1)} className="rounded-full p-1.5 text-white/60 hover:text-white">
          <IoChevronForward size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
