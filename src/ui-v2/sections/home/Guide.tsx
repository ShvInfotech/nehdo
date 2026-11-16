import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward, IoChatbubblesOutline, IoLeafOutline, IoSparklesOutline, IoWaterOutline } from "react-icons/io5";
import { Container, Section, SectionHeader } from "../../primitives";
import { cx } from "../../lib/format";

/*
 * v2 replacement for BlogSection (v1 content was fashion placeholder).
 * Links go to /faq until a real guides/blog route exists.
 */
const GUIDES = [
  { icon: IoSparklesOutline, tag: "Beginner", title: "First time? Start here", desc: "A no-pressure guide to choosing your first product.", tone: "bg-v2-blush" },
  { icon: IoWaterOutline, tag: "Essentials", title: "Lubricant 101", desc: "Water, silicone or oil-based — what to use and when.", tone: "bg-v2-lilac" },
  { icon: IoLeafOutline, tag: "Care", title: "Cleaning & storage", desc: "Keep products safe, hygienic and lasting longer.", tone: "bg-v2-sage/15" },
  { icon: IoChatbubblesOutline, tag: "Couples", title: "Bringing it up with a partner", desc: "Simple ways to start the conversation.", tone: "bg-v2-butter" },
];

const Guide: React.FC = () => (
  <Section>
    <Container>
      <SectionHeader
        eyebrow="The Nehdo guide"
        title="Questions you didn’t want to Google"
        description="Straightforward, judgement-free answers written for real people."
        action={{ label: "All help topics", to: "/faq" }}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {GUIDES.map(({ icon: Icon, tag, title, desc, tone }) => (
          <Link
            key={title}
            to="/faq"
            className="group flex flex-col rounded-v2-lg border border-v2-line bg-v2-surface p-5 transition-shadow hover:shadow-v2"
          >
            <span className={cx("flex h-12 w-12 items-center justify-center rounded-v2 text-v2-plum", tone)}>
              <Icon size={22} />
            </span>
            <span className="mt-5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-v2-muted">{tag}</span>
            <span className="mt-1 font-v2-display text-[19px] font-semibold leading-snug">{title}</span>
            <span className="mt-2 text-[14px] text-v2-muted">{desc}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-v2-plum">
              Read <IoArrowForward className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </Container>
  </Section>
);

export default Guide;
