import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoArrowForward, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useBanners, type Banner } from "../../hooks/useHomeData";
import { cx } from "../../lib/format";
import { HERO_DEFAULT_SLIDES, type HeroSlide } from "../../config";

const AUTOPLAY_MS = 5500;

/** Admin banner → slide. Links to the attached product, otherwise the shop. */
const fromBanner = (b: Banner): HeroSlide => ({
  id: b._id,
  desktopImage: b.desktopImage,
  mobileImage: b.mobileImage,
  title: b.title,
  subtitle: b.subtitle,
  ctaText: b.ctaButtonText,
  href: b.product ? `/product/${b.product._id}` : "/shop",
});

/**
 * Full-screen-width image banner slider. Uses admin "Hero Slider" banners;
 * falls back to HERO_DEFAULT_SLIDES (config.ts) when none are available.
 * Desktop image on ≥768px, mobile image below (falls back to desktop).
 * Autoplay pauses on hover/focus, when the tab is hidden, and for reduced motion.
 */
const Hero: React.FC = () => {
  const { banners, loading } = useBanners("Hero Slider");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const slides: HeroSlide[] = banners.length ? banners.map(fromBanner) : HERO_DEFAULT_SLIDES;
  const count = slides.length;

  const go = useCallback(
    (next: number, direction = next > index ? 1 : -1) => {
      if (!count) return;
      setDir(direction);
      setIndex((next + count) % count);
    },
    [count, index],
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // autoplay
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!document.hidden) next();
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, paused, next]);

  useEffect(() => {
    if (index >= count && count) setIndex(0);
  }, [count, index]);

  if (loading) {
    return <section aria-label="Featured" className="v2-skeleton aspect-[4/5] w-full rounded-none sm:aspect-[16/9] md:aspect-auto md:h-[min(72vh,680px)]" />;
  }
  if (!count) return null;

  const slide = slides[Math.min(index, count - 1)];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="relative w-full overflow-hidden bg-v2-plum-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] md:aspect-auto md:h-[min(72vh,680px)]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: `${d * 100}%` }),
              center: { x: 0 },
              exit: (d: number) => ({ x: `${d * -100}%` }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.6 }}
            className="absolute inset-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
          >
            <Slide slide={slide} eager={index === 0} />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <ArrowButton side="left" onClick={prev} />
            <ArrowButton side="right" onClick={next} />
            <div className="absolute inset-x-0 bottom-1 z-10 flex justify-center md:bottom-3">
              {slides.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className="flex h-11 min-w-8 items-center justify-center px-1.5"
                >
                  <span
                    className="relative block h-1.5 overflow-hidden rounded-full bg-white/40 transition-all"
                    style={{ width: i === index ? 32 : 10 }}
                  >
                  {i === index && !paused && (
                    <motion.span
                      key={`${b.id}-${index}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                    />
                  )}
                  {i === index && paused && <span className="absolute inset-0 bg-white" />}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/** One banner: full-bleed responsive image, optional text overlay, whole slide clickable. */
const Slide: React.FC<{ slide: HeroSlide; eager: boolean }> = ({ slide, eager }) => {
  const hasText = !!(slide.title || slide.subtitle);
  const label = slide.title ? slide.title.split("\n").join(" ") : "View offer";
  return (
    <Link to={slide.href} className="group block h-full w-full" aria-label={label}>
      <picture>
        {slide.mobileImage && <source media="(max-width: 767px)" srcSet={slide.mobileImage} />}
        <img
          src={slide.desktopImage}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          draggable={false}
          className="h-full w-full select-none object-cover"
        />
      </picture>
      {hasText && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent md:bg-gradient-to-r md:from-black/55 md:via-black/20" />
          <div className="absolute inset-x-0 bottom-0 pb-12 md:inset-y-0 md:flex md:items-center md:pb-0">
            {/* md:px-24 keeps text clear of the arrow buttons */}
            <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-6 md:px-24">
              <div className="max-w-xl text-white">
                {slide.title && (
                  <h2 className="whitespace-pre-line text-[30px] leading-[1.05] drop-shadow-sm sm:text-[42px] md:text-[56px]">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && <p className="mt-3 max-w-md text-[15px] text-white/85 md:text-[17px]">{slide.subtitle}</p>}
                <span className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-v2-plum-deep transition-colors group-hover:bg-v2-blush">
                  {slide.ctaText || "Shop now"}
                  <IoArrowForward className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

const ArrowButton: React.FC<{ side: "left" | "right"; onClick: () => void }> = ({ side, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={side === "left" ? "Previous slide" : "Next slide"}
    className={cx(
      "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-v2-ink shadow-v2 backdrop-blur transition hover:bg-white md:flex",
      side === "left" ? "left-5 lg:left-8" : "right-5 lg:right-8",
    )}
  >
    {side === "left" ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
  </button>
);

export default Hero;
