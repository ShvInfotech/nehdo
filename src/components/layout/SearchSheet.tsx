import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoArrowForward, IoCloseOutline, IoSearchOutline, IoTrendingUp } from "react-icons/io5";
import { searchProducts, getCategories } from "../../data/products";
import { Img } from "../ui";
import { inr } from "../../lib/format";
import { lockOverlay } from "../../lib/overlay";

const SUGGESTED = ["Lubricant", "Massager", "Condoms", "Couples", "Intimate wash"];

/** Full-width search panel dropping from the top, with live product matches. */
const SearchSheet: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // depends on `open` only — parent re-renders must not reset the query
  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey, true);
    const release = lockOverlay();
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
      release();
    };
  }, [open]);

  const results = useMemo(() => (q.trim().length > 1 ? searchProducts(q.trim()).slice(0, 6) : []), [q]);
  const categories = useMemo(() => getCategories().filter((c) => c !== "All").slice(0, 6), []);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  };

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
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[85vh] overflow-y-auto rounded-b-v2-xl bg-v2-bg shadow-v2-lg"
          >
            <div className="mx-auto max-w-[880px] px-4 pb-8 pt-4 sm:px-6 sm:pt-6">
              <form onSubmit={submit} className="flex items-center gap-2">
                <div className="flex h-14 flex-1 items-center gap-3 rounded-full border border-v2-line bg-v2-surface px-5 focus-within:border-v2-plum focus-within:ring-4 focus-within:ring-v2-plum/10">
                  <IoSearchOutline size={20} className="text-v2-muted" />
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products, brands, categories"
                    className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-v2-muted/70 focus-visible:outline-none"
                    aria-label="Search"
                  />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-v2-sunken"
                >
                  <IoCloseOutline size={24} />
                </button>
              </form>

              {results.length > 0 ? (
                <div className="mt-6">
                  <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">Products</p>
                  <ul className="divide-y divide-v2-line overflow-hidden rounded-v2-lg border border-v2-line bg-v2-surface">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/product/${p.id}`}
                          onClick={onClose}
                          className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-v2-sunken"
                        >
                          <Img src={p.image} alt="" frameClassName="h-14 w-14 shrink-0 rounded-v2-sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14.5px] font-semibold">{p.name}</span>
                            <span className="block truncate text-[12.5px] text-v2-muted">{p.brand || p.category}</span>
                          </span>
                          <span className="font-v2-display text-[15px] font-semibold">{inr(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
                    className="mt-3 inline-flex items-center gap-1.5 px-1 text-sm font-semibold text-v2-plum"
                  >
                    See all results for “{q.trim()}” <IoArrowForward />
                  </button>
                </div>
              ) : q.trim().length > 1 ? (
                <p className="mt-8 text-center text-[15px] text-v2-muted">
                  No matches for “{q.trim()}”. Try a broader word.
                </p>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">
                      <IoTrendingUp /> Popular searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          onClick={() => go(`/search?q=${encodeURIComponent(s)}`)}
                          className="rounded-full border border-v2-line bg-v2-surface px-4 py-2 text-[13.5px] font-medium hover:border-v2-plum hover:text-v2-plum"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {categories.length > 0 && (
                    <div>
                      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => go(`/shop?category=${encodeURIComponent(c.toLowerCase())}`)}
                            className="rounded-full bg-v2-lilac px-4 py-2 text-[13.5px] font-medium text-v2-plum hover:bg-v2-plum hover:text-white"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <p className="mt-6 text-center text-[12px] text-v2-muted">Your searches are private and never saved to your account.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchSheet;
