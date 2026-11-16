import React from "react";
import { useNewArrivals, useTrendingProducts } from "../../hooks/useProducts";
import { Container, Section, SectionHeader } from "../../primitives";
import { cx } from "../../lib/format";
import ProductRail from "../../product/ProductRail";

/** v1: TrendingProducts */
export const Bestsellers: React.FC = () => {
  const { products, loading } = useTrendingProducts(12);
  if (!loading && products.length === 0) return null;
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Bestsellers"
          title="What everyone’s adding to cart"
          action={{ label: "Shop bestsellers", to: "/shop?filter=trending" }}
        />
        <ProductRail products={products} loading={loading} label="Bestsellers" />
      </Container>
    </Section>
  );
};

/** v1: NewArrivals (category tabs kept) */
export const NewArrivals: React.FC = () => {
  const { items, tabs, activeTab, setActiveTab } = useNewArrivals();
  if (items.length === 0 && activeTab === "All") return null;
  return (
    <Section>
      <Container>
        <SectionHeader eyebrow="Just landed" title="New arrivals" action={{ label: "See all new", to: "/shop?filter=new" }} />
        {tabs.length > 2 && (
          <div role="tablist" aria-label="Filter new arrivals" className="v2-no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={t === activeTab}
                onClick={() => setActiveTab(t)}
                className={cx(
                  "shrink-0 inline-flex min-h-11 items-center rounded-full md:min-h-0 px-4 py-2 text-[13.5px] font-semibold transition-colors",
                  t === activeTab ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface text-v2-ink hover:border-v2-ink/30",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <ProductRail products={items} label="New arrivals" />
      </Container>
    </Section>
  );
};
