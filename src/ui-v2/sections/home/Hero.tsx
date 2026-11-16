import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IoArrowForward, IoCashOutline, IoLockClosedOutline, IoShieldCheckmarkOutline, IoStar } from "react-icons/io5";
import { useBanners, type Banner } from "../../hooks/useHomeData";
import { ButtonLink, Container, Skeleton } from "../../primitives";
import { cx, inr } from "../../lib/format";

const PROMISES = [
  { icon: <IoLockClosedOutline />, label: "Discreet delivery" },
  { icon: <IoShieldCheckmarkOutline />, label: "100% genuine" },
  { icon: <IoCashOutline />, label: "Cash on delivery" },
];

/** Admin-managed "Hero Slider" banners, with a typographic fallback when none are live. */
const Hero: React.FC = () => {
  const { banners, loading } = useBanners("Hero Slider");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  const banner: Banner | undefined = banners[i];

  return (
    <section className="pb-6 pt-4 md:pb-10 md:pt-6">
      <Container>
        <div className="relative overflow-hidden rounded-v2-xl bg-v2-blush">
          <Blobs />
          <div className="relative grid min-h-[560px] items-center gap-8 p-6 sm:p-10 md:min-h-[540px] md:grid-cols-[1.05fr_1fr] lg:p-14">
            {/* copy */}
            <div className="relative z-10 max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={banner?._id || "fallback"}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-v2-plum backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-v2-coral" />
                    Sexual wellness for adults, delivered discreetly
                  </span>
                  <h1 className="mt-5 text-[40px] leading-[1.02] sm:text-[52px] lg:text-[64px]">
                    {banner?.title || (
                      <>
                        Feel good,
                        <br />
                        <span className="text-v2-plum">no awkwardness.</span>
                      </>
                    )}
                  </h1>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-v2-ink/75 md:text-[17px]">
                    {banner?.subtitle ||
                      "Genuine products from trusted brands, honest guidance, and a plain box at your door. Nobody needs to know but you."}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to={banner?.product ? `/product/${banner.product._id}` : "/shop"} size="lg">
                  {banner?.ctaButtonText || "Shop now"} <IoArrowForward />
                </ButtonLink>
                <ButtonLink to="/shop?filter=trending" size="lg" variant="secondary">
                  Bestsellers
                </ButtonLink>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {PROMISES.map((p) => (
                  <li key={p.label} className="flex items-center gap-1.5 text-[13.5px] font-medium text-v2-ink/80">
                    <span className="text-v2-sage">{p.icon}</span>
                    {p.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* visual */}
            <div className={cx("relative sm:h-[380px] md:h-[440px]", banner || loading ? "h-[300px]" : "h-[220px]")}>
              {loading ? (
                <Skeleton className="h-full w-full rounded-v2-xl bg-white/50" />
              ) : banner ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={banner._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <picture>
                      {banner.mobileImage && <source media="(max-width: 767px)" srcSet={banner.mobileImage} />}
                      <img
                        src={banner.desktopImage}
                        alt=""
                        className="h-full w-full rounded-v2-xl object-cover shadow-v2-lg"
                      />
                    </picture>
                    {banner.product && <ProductChip banner={banner} />}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <FallbackArt />
              )}
            </div>
          </div>

          {banners.length > 1 && (
            <div className="absolute bottom-5 left-6 flex gap-1.5 sm:left-10 lg:left-14">
              {banners.map((b, n) => (
                <button
                  key={b._id}
                  onClick={() => setI(n)}
                  aria-label={`Show banner ${n + 1}`}
                  aria-current={n === i}
                  className={cx("h-1.5 rounded-full transition-all", n === i ? "w-8 bg-v2-plum" : "w-3 bg-v2-plum/25")}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

const ProductChip: React.FC<{ banner: Banner }> = ({ banner }) => {
  const p = banner.product!;
  return (
    <Link
      to={`/product/${p._id}`}
      className="absolute bottom-4 left-4 flex max-w-[260px] items-center gap-3 rounded-v2-lg bg-white/95 p-2.5 pr-4 shadow-v2-lg backdrop-blur transition-transform hover:-translate-y-0.5"
    >
      {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded-v2-sm object-cover" />}
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold">{p.name}</span>
        <span className="flex items-center gap-2 text-[12.5px] text-v2-muted">
          <span className="font-semibold text-v2-ink">{inr(p.salePrice)}</span>
          {p.avgRating > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <IoStar className="text-[#F5A524]" /> {p.avgRating.toFixed(1)}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
};

/** Soft abstract composition — no product photography needed. */
const FallbackArt: React.FC = () => (
  <div className="relative h-full w-full">
    <motion.div
      className="absolute right-[8%] top-[6%] h-[62%] w-[52%] rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-v2-plum"
      animate={{ rotate: [0, 6, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[6%] left-[6%] h-[48%] w-[44%] rounded-[60%_40%_45%_55%/55%_60%_40%_45%] bg-v2-coral"
      animate={{ rotate: [0, -8, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute bottom-[18%] right-[14%] h-[30%] w-[30%] rounded-full bg-v2-butter" />
    <div className="absolute left-[24%] top-[14%] h-16 w-16 rounded-full border-[10px] border-white/80" />
    <div className="absolute bottom-6 right-6 rounded-v2-lg bg-white/90 px-4 py-3 shadow-v2 backdrop-blur">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">What arrives</p>
      <p className="mt-0.5 text-[14px] font-semibold">A plain brown box. That’s it.</p>
    </div>
  </div>
);

const Blobs: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-v2-lilac blur-3xl" />
    <div className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-v2-butter/70 blur-3xl" />
  </div>
);

export default Hero;
