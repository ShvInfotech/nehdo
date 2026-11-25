import React from "react";
import { useHomeBrands } from "../../hooks/useHomeData";
import { Container, Section } from "../ui";

/** Admin brands flagged for homepage (the old UI: TopBrands). Hidden when empty. */
const Brands: React.FC = () => {
  const { brands, loading } = useHomeBrands();
  if (loading || brands.length === 0) return null;
  const loop = [...brands, ...brands];

  return (
    <Section tight className="border-y border-v2-line bg-v2-surface">
      <Container>
        <p className="mb-6 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-v2-muted">
          Authorised retailer for brands you trust
        </p>
      </Container>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="v2-marquee flex w-max items-center gap-14 px-7">
          {loop.map((b, i) => (
            <li key={`${b.name}-${i}`} aria-hidden={i >= brands.length} className="shrink-0">
              <img
                src={b.src}
                alt={b.name}
                loading="lazy"
                className="h-10 w-auto max-w-[140px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Brands;
