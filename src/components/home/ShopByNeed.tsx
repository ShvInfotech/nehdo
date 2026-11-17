import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward } from "react-icons/io5";
import { Container, Section, SectionHeader } from "../ui";
import { cx } from "../../lib/format";

const NEEDS = [
  { label: "For her", desc: "Massagers, lubes & intimate care", href: "/collection/women", bg: "bg-v2-blush", dot: "bg-v2-coral", shape: "rounded-[60%_40%_55%_45%]" },
  { label: "For him", desc: "Performance, protection & grooming", href: "/collection/men", bg: "bg-v2-lilac", dot: "bg-v2-plum", shape: "rounded-[30%]" },
  { label: "For couples", desc: "Play, connection & discovery", href: "/collection/couples", bg: "bg-v2-butter", dot: "bg-v2-coral", shape: "rounded-full" },
  { label: "Wellness & care", desc: "Hygiene, cleaners & everyday health", href: "/collection/wellness", bg: "bg-v2-sage/15", dot: "bg-v2-sage", shape: "rounded-[45%_55%_40%_60%]" },
];

const ShopByNeed: React.FC = () => (
  <Section>
    <Container>
      <SectionHeader
        eyebrow="Start here"
        title="Shop by what you’re looking for"
        description="Not sure where to begin? Pick a starting point — every collection is curated and explained in plain language."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {NEEDS.map((n) => (
          <Link
            key={n.label}
            to={n.href}
            className={cx(
              "group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-v2-lg p-4 transition-transform duration-300 hover:-translate-y-1 sm:aspect-[5/6] md:p-6",
              n.bg,
            )}
          >
            <span
              aria-hidden
              className={cx(
                "absolute right-[-14%] top-[-10%] h-[44%] w-[58%] opacity-90 md:h-[62%] md:w-[70%] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
                n.dot,
                n.shape,
              )}
            />
            <span className="relative">
              <span className="block font-v2-display text-[22px] font-semibold leading-tight md:text-[28px]">{n.label}</span>
              <span className="mt-1 block text-[13px] leading-snug text-v2-ink/70 md:text-[14px]">{n.desc}</span>
              <span className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-v2-ink transition-transform group-hover:translate-x-1">
                <IoArrowForward />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Container>
  </Section>
);

export default ShopByNeed;
