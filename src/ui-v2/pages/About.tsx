import React from "react";
import { IoChatbubblesOutline, IoCubeOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { Breadcrumbs, ButtonLink, Container, Section } from "../primitives";

/*
 * DRAFT COPY — v1 About was a fashion template ("Redefining Everyday Style",
 * sustainable fabrics, "10k+ customers", founded 2026). This version makes no
 * factual claims beyond what the rest of the site already states. Add your
 * real story, founders, location and any figures you can stand behind.
 */
const VALUES = [
  {
    icon: IoShieldCheckmarkOutline,
    title: "Genuine, sealed products",
    desc: "Products from brands we trust, delivered sealed.",
  },
  {
    icon: IoCubeOutline,
    title: "Privacy by default",
    desc: "Plain packaging with no product names on the label, and a neutral name on your statement.",
  },
  {
    icon: IoChatbubblesOutline,
    title: "Honest, simple guidance",
    desc: "Plain-language answers, no judgement, and real people to talk to when you need help.",
  },
];

const AboutPage: React.FC = () => (
  <>
    <Container className="pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "About" }]} />
      <div className="relative mt-6 overflow-hidden rounded-v2-xl bg-v2-blush px-6 py-14 md:px-14 md:py-20">
        <div aria-hidden className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-v2-plum/90" />
        <div aria-hidden className="absolute -bottom-20 right-40 h-56 w-56 rounded-full bg-v2-coral/80" />
        <div className="relative max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-v2-plum">About Nehdo</p>
          <h1 className="mt-3 text-[36px] leading-[1.05] md:text-[56px]">Sexual wellness, without the awkwardness.</h1>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-v2-ink/75">
            Nehdo is an online store for adults in India who want good products, clear information and complete privacy —
            without having to ask anyone across a counter.
          </p>
        </div>
      </div>
    </Container>

    <Section>
      <Container>
        <div className="grid gap-4 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-v2-xl border border-v2-line bg-v2-surface p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-v2 bg-v2-lilac text-v2-plum">
                <Icon size={22} />
              </span>
              <h2 className="mt-5 text-[20px]">{title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-v2-muted">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    <Section tight>
      <Container>
        <div className="grid items-center gap-8 rounded-v2-xl bg-v2-surface p-7 shadow-v2-sm md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <h2 className="text-[28px] md:text-[34px]">Why we exist</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-v2-ink/80">
              Pleasure and intimate health are a normal part of life, but shopping for them often isn’t comfortable. We built
              Nehdo so you can browse at your own pace, understand what you’re buying, and receive it in a box that gives
              nothing away.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 md:items-end">
            <ButtonLink to="/shop" size="lg">
              Browse the shop
            </ButtonLink>
            <ButtonLink to="/faq" size="lg" variant="secondary">
              Read common questions
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  </>
);

export default AboutPage;
