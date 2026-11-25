import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { useBanners } from "../../hooks/useHomeData";
import { Container, Section } from "../ui";
import { cx } from "../../lib/format";

/** Admin "Promotional Strip" banners (the old UI: PromotionalBanners). */
const PromoBanners: React.FC = () => {
  const { banners, loading } = useBanners("Promotional Strip");
  if (loading || banners.length === 0) return null;
  const shown = banners.slice(0, 2);

  return (
    <Section tight>
      <Container>
        <div className={cx("grid gap-4", shown.length > 1 && "md:grid-cols-2")}>
          {shown.map((b) => (
            <Link
              key={b._id}
              to="/shop"
              className="group relative flex min-h-[260px] items-end overflow-hidden rounded-v2-xl bg-v2-plum-deep md:min-h-[320px]"
            >
              <picture>
                {b.mobileImage && <source media="(max-width: 767px)" srcSet={b.mobileImage} />}
                <img
                  src={b.desktopImage}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-v2-plum-deep/85 via-v2-plum-deep/30 to-transparent" />
              <div className="relative p-6 text-white md:p-8">
                <h3 className="whitespace-pre-line text-[26px] md:text-[32px]">{b.title}</h3>
                {b.subtitle && <p className="mt-2 max-w-sm text-[14.5px] text-white/80">{b.subtitle}</p>}
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-v2-plum-deep">
                  {b.ctaButtonText || "Shop now"}
                  <IoArrowForward className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PromoBanners;
