import React, { useEffect, useRef, useState } from "react";
import { Img } from "../ui";
import { cx } from "../../lib/format";

/**
 * Desktop: thumbnails + large image. Mobile: swipeable scroll-snap strip with dots.
 */
const Gallery: React.FC<{ images: string[]; alt: string; badges?: React.ReactNode }> = ({ images, alt, badges }) => {
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const list = images.length ? images : [""];

  // keep dots in sync with swipe position (mobile)
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    const el = strip.current;
    if (el && el.offsetParent !== null) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="md:grid md:grid-cols-[76px_1fr] md:gap-4">
      {/* thumbnails (desktop) */}
      {list.length > 1 && (
        <div className="v2-no-scrollbar hidden max-h-[640px] flex-col gap-3 overflow-y-auto md:flex">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cx(
                "shrink-0 overflow-hidden rounded-v2 border-2 transition-colors",
                i === active ? "border-v2-plum" : "border-transparent hover:border-v2-line",
              )}
            >
              <Img src={src} alt="" frameClassName="aspect-[4/5]" />
            </button>
          ))}
        </div>
      )}

      <div className={cx("relative", list.length <= 1 && "md:col-span-2")}>
        {/* mobile strip */}
        <div
          ref={strip}
          className="v2-no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6 md:hidden"
          aria-label="Product images"
        >
          {list.map((src, i) => (
            <div key={i} className="w-full shrink-0 snap-center px-4 sm:px-6">
              <Img src={src} alt={i === 0 ? alt : ""} frameClassName="aspect-[4/5] rounded-v2-xl" loading={i === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>

        {/* desktop main */}
        <div className="hidden md:block">
          <Img
            key={list[active]}
            src={list[active]}
            alt={alt}
            loading="eager"
            frameClassName="aspect-[4/5] rounded-v2-xl"
          />
        </div>

        {badges && <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1.5 md:left-4">{badges}</div>}

        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 md:hidden">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1}`}
                className={cx("h-1.5 rounded-full transition-all", i === active ? "w-6 bg-v2-plum" : "w-1.5 bg-v2-plum/25")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
