import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import type { Product } from "../../data/products";
import ProductCard from "./ProductCard";
import { Skeleton } from "../primitives";
import { cx } from "../lib/format";

/**
 * Native horizontal scroll with snap — swipe on touch, arrow buttons on desktop.
 * Replaces v1's index-based carousels (no resize listeners needed).
 */
const ProductRail: React.FC<{ products: Product[]; loading?: boolean; label: string }> = ({
  products,
  loading,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, products.length]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const item = "w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23.5%] xl:w-[19%]";

  return (
    <div className="relative">
      <div
        ref={ref}
        role="list"
        aria-label={label}
        className="v2-no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:gap-4 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={item}>
                <Skeleton className="aspect-[4/5] rounded-v2-lg" />
                <Skeleton className="mt-3 h-3 w-1/3" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <Skeleton className="mt-2 h-4 w-1/4" />
              </div>
            ))
          : products.map((p) => (
              <div role="listitem" key={p.id} className={item}>
                <ProductCard product={p} />
              </div>
            ))}
      </div>

      {!loading && products.length > 4 && (
        <>
          <RailButton side="left" hidden={edges.start} onClick={() => scroll(-1)} />
          <RailButton side="right" hidden={edges.end} onClick={() => scroll(1)} />
        </>
      )}
    </div>
  );
};

const RailButton: React.FC<{ side: "left" | "right"; hidden: boolean; onClick: () => void }> = ({
  side,
  hidden,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === "left" ? "Scroll left" : "Scroll right"}
    tabIndex={hidden ? -1 : 0}
    className={cx(
      "absolute top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-v2-line bg-v2-surface shadow-v2 transition-opacity hover:bg-v2-sunken lg:flex",
      side === "left" ? "-left-5" : "-right-5",
      hidden && "pointer-events-none opacity-0",
    )}
  >
    {side === "left" ? <IoChevronBack size={18} /> : <IoChevronForward size={18} />}
  </button>
);

export default ProductRail;
