import React from "react";
import { IoStar } from "react-icons/io5";
import { Container, Section, SectionHeader } from "../../primitives";

/*
 * Customer reviews. Intentionally EMPTY — v1 used invented names and
 * fashion-store copy. Add real, consented customer quotes here (or wire
 * to a reviews endpoint) and the section appears automatically.
 */
export interface Review {
  quote: string;
  author: string; // first name + initial, e.g. "Priya S."
  city?: string;
  rating: number;
}

export const REVIEWS: Review[] = [];

const Reviews: React.FC = () => {
  if (REVIEWS.length === 0) return null;
  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="Reviews" title="In their words" align="center" />
        <div className="v2-no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:px-0">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="w-[85%] shrink-0 snap-start rounded-v2-lg bg-v2-surface p-6 shadow-v2-sm md:w-auto">
              <div className="flex gap-0.5 text-[#F5A524]" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, n) => (
                  <IoStar key={n} className={n < r.rating ? "" : "opacity-25"} />
                ))}
              </div>
              <blockquote className="mt-4 text-[15.5px] leading-relaxed">“{r.quote}”</blockquote>
              <figcaption className="mt-5 text-[13.5px] font-semibold">
                {r.author}
                {r.city && <span className="font-normal text-v2-muted"> · {r.city}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Reviews;
