import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { cx } from "../lib/format";
import { lockOverlay } from "../lib/overlay";

type Side = "left" | "right" | "bottom" | "center";

const panelBySide: Record<Side, string> = {
  left: "left-0 top-0 h-full w-[88vw] max-w-[400px]",
  right: "right-0 top-0 h-full w-[92vw] max-w-[440px]",
  bottom: "bottom-0 left-0 w-full max-h-[90vh] rounded-t-v2-xl",
  center:
    "left-1/2 top-1/2 w-[calc(100vw-32px)] max-w-[480px] max-h-[calc(100vh-32px)] rounded-v2-xl", // centering via framer x/y below
};

type Anim = TargetAndTransition;
const motionBySide: Record<Side, { initial: Anim; animate: Anim; exit: Anim }> = {
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  center: {
    initial: { opacity: 0, scale: 0.96, x: "-50%", y: "-48%" },
    animate: { opacity: 1, scale: 1, x: "-50%", y: "-50%" },
    exit: { opacity: 0, scale: 0.96, x: "-50%", y: "-48%" },
  },
};

/**
 * Drawer / dialog. Handles backdrop, Escape, body scroll lock and
 * initial focus. Rendered in place (inside .v2) so tokens apply.
 */
export const Sheet: React.FC<{
  open: boolean;
  onClose: () => void;
  side?: Side;
  title?: string;
  hideHeader?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ open, onClose, side = "right", title, hideHeader, className, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // depends on `open` only, so parent re-renders don't steal focus back to the panel
  useEffect(() => {
    if (!open) return;
    const release = lockOverlay();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey, true);
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      release();
      document.removeEventListener("keydown", onKey, true);
      clearTimeout(t);
    };
  }, [open]);

  const m = motionBySide[side];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <motion.div
            className="absolute inset-0 bg-v2-plum-deep/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={m.initial}
            animate={m.animate}
            exit={m.exit}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className={cx(
              "absolute flex flex-col overflow-hidden bg-v2-bg shadow-v2-lg outline-none",
              panelBySide[side],
              className,
            )}
          >
            {!hideHeader && (
              <div className="flex shrink-0 items-center justify-between border-b border-v2-line px-5 py-4">
                <h2 className="text-lg">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-v2-sunken"
                >
                  <IoCloseOutline size={22} />
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
