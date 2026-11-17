import React from "react";
import { Link } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { POLICIES } from "../content/policies";
import { Breadcrumbs, Container } from "../components/ui";
import { SUPPORT_EMAIL } from "../config";
import { cx } from "../lib/format";

type Slug = keyof typeof POLICIES;
const ORDER: Slug[] = ["shipping", "returns", "privacy", "terms"];
const SHORT: Record<Slug, string> = { shipping: "Shipping", returns: "Returns & refunds", privacy: "Privacy", terms: "Terms" };

/** One layout for all four policy pages; text comes verbatim from the old UI. */
const LegalPage: React.FC<{ slug: Slug }> = ({ slug }) => {
  const p = POLICIES[slug];
  return (
    <Container className="pb-16 pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Help", to: "/faq" }, { label: p.title }]} />

      <header className="mt-6 max-w-3xl">
        <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-v2-plum">{p.badge}</span>
        <h1 className="mt-2 text-[32px] md:text-[46px]">{p.title}</h1>
        <p className="mt-3 text-[16px] text-v2-muted">{p.subtitle}</p>
        <p className="mt-4 text-[13px] text-v2-muted">
          Last updated <span className="font-semibold text-v2-ink">{p.lastUpdated}</span>
        </p>
      </header>

      {/* policy switcher */}
      <nav aria-label="Policies" className="v2-no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {ORDER.map((s) => (
          <Link
            key={s}
            to={`/${s}`}
            aria-current={s === slug ? "page" : undefined}
            className={cx(
              "shrink-0 inline-flex min-h-11 items-center rounded-full md:min-h-0 px-4 py-2 text-[13.5px] font-semibold transition-colors",
              s === slug ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface hover:border-v2-ink/30",
            )}
          >
            {SHORT[s]}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-[calc(var(--v2-header-h)+24px)]">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">On this page</p>
            <ol className="space-y-1 border-l border-v2-line">
              {p.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[13.5px] text-v2-muted hover:border-v2-plum hover:text-v2-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <div className="v2-legal rounded-v2-xl bg-v2-surface p-6 shadow-v2-sm md:p-10">{p.body}</div>
          <div className="mt-6 flex flex-col gap-4 rounded-v2-xl bg-v2-lilac/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Questions about this policy?</p>
              <p className="text-[14px] text-v2-muted">Write to us and include your order number if it’s about an order.</p>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Question about ${p.title}`)}`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-v2-plum px-6 text-sm font-semibold text-white hover:bg-v2-plum-deep"
            >
              <IoMailOutline size={17} /> Email us
            </a>
          </div>
        </article>
      </div>
    </Container>
  );
};

export const TermsPage = () => <LegalPage slug="terms" />;
export const PrivacyPage = () => <LegalPage slug="privacy" />;
export const ReturnsPage = () => <LegalPage slug="returns" />;
export const ShippingPage = () => <LegalPage slug="shipping" />;
