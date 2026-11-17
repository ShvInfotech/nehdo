import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronDown, IoClose, IoOptionsOutline, IoSearchOutline } from "react-icons/io5";
import { PRICE_BANDS, QUICK_FILTERS, SORTS, useCatalog, type CatalogScope } from "../hooks/useCatalog";
import { Breadcrumbs, Button, ButtonLink, Container, Sheet } from "../components/ui";
import ProductCard from "../components/product/ProductCard";
import { cx } from "../lib/format";

const PAGE = 24;

export interface CatalogHeader {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: { label: string; to?: string }[];
}

type Catalog = ReturnType<typeof useCatalog>;

/** Shared listing layout for Shop, Search and Collection pages. */
const CatalogPage: React.FC<{ scope: CatalogScope; header: CatalogHeader }> = ({ scope, header }) => {
  const cat = useCatalog(scope);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE);

  // reset paging whenever the result set changes
  useEffect(() => setVisible(PAGE), [cat.results]);

  const shown = cat.results.slice(0, visible);
  const activeCount = cat.chips.length;

  return (
    <div className="pb-10">
      {/* header band */}
      <div className="border-b border-v2-line bg-v2-sunken/50">
        <Container className="py-8 md:py-12">
          <Breadcrumbs items={header.crumbs} />
          {header.eyebrow && (
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-v2-plum">{header.eyebrow}</p>
          )}
          <h1 className={cx("text-[32px] md:text-[48px]", header.eyebrow ? "mt-2" : "mt-5")}>{header.title}</h1>
          {header.description && <p className="mt-2 max-w-2xl text-[15px] text-v2-muted md:text-base">{header.description}</p>}
          {scope.kind === "search" && <SearchRefine initial={scope.query} />}
        </Container>
      </div>

      <Container className="pt-6 md:pt-8">
        {cat.fallback && (
          <p className="mb-6 rounded-v2 bg-v2-butter/70 px-4 py-3 text-[14px]">
            We’re still curating this collection — here’s everything we stock in the meantime.
          </p>
        )}

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* desktop sidebar */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="v2-no-scrollbar sticky top-[calc(var(--v2-header-h)+24px)] max-h-[calc(100vh-var(--v2-header-h)-48px)] overflow-y-auto pb-6 pr-2">
              <FilterPanel cat={cat} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-v2-line bg-v2-surface px-4 text-[13.5px] font-semibold lg:hidden"
              >
                <IoOptionsOutline size={17} />
                Filters
                {activeCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-v2-plum px-1.5 text-[11px] text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <p className="hidden text-[14px] text-v2-muted sm:block" aria-live="polite">
                <span className="font-semibold text-v2-ink">{cat.results.length}</span>{" "}
                {cat.results.length === 1 ? "product" : "products"}
              </p>
              <label className="relative ml-auto">
                <span className="sr-only">Sort by</span>
                <select
                  value={cat.selected.sort}
                  onChange={(e) => cat.set("sort", e.target.value)}
                  className="h-11 cursor-pointer appearance-none rounded-full border border-v2-line bg-v2-surface pl-4 pr-10 text-[16px] font-semibold md:h-10 md:text-[13.5px] focus:border-v2-plum focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id === "featured" ? "Sort: Featured" : s.label}
                    </option>
                  ))}
                </select>
                <IoChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-v2-muted" />
              </label>
            </div>

            {cat.chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {cat.chips.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => cat.set(c.key, null)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-v2-lilac px-3 py-1.5 text-[13px] md:min-h-0 font-semibold text-v2-plum hover:bg-v2-plum hover:text-white"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label} <IoClose />
                  </button>
                ))}
                <button onClick={cat.clear} className="min-h-11 px-2 text-[13px] md:min-h-0 font-semibold text-v2-muted underline-offset-2 hover:underline">
                  Clear all
                </button>
              </div>
            )}

            {/* results */}
            {shown.length > 0 ? (
              <>
                <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 xl:grid-cols-4">
                  {shown.map((p) => (
                    <li key={p.id}>
                      <ProductCard product={p} />
                    </li>
                  ))}
                </ul>
                {visible < cat.results.length && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <p className="text-[13px] text-v2-muted">
                      Showing {shown.length} of {cat.results.length}
                    </p>
                    <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                      Show more
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState hasFilters={cat.chips.length > 0} onClear={cat.clear} isSearch={scope.kind === "search"} />
            )}
          </div>
        </div>
      </Container>

      {/* mobile filters */}
      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} side="bottom" title="Filters">
        <div className="px-5 pb-28 pt-4">
          <FilterPanel cat={cat} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-2 border-t border-v2-line bg-v2-bg p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <Button variant="secondary" onClick={cat.clear} className="flex-1">
            Clear
          </Button>
          <Button onClick={() => setFiltersOpen(false)} className="flex-[2]">
            Show {cat.results.length} {cat.results.length === 1 ? "product" : "products"}
          </Button>
        </div>
      </Sheet>
    </div>
  );
};

/* ── Filters ─────────────────────────────────────────────────── */

const FilterPanel: React.FC<{ cat: Catalog }> = ({ cat }) => {
  const { selected, set } = cat;
  return (
    <div className="space-y-7">
      <Group title="Show">
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <Pill key={f.id} active={selected.filter === f.id} onClick={() => set("filter", selected.filter === f.id ? null : f.id)}>
              {f.label}
            </Pill>
          ))}
        </div>
      </Group>

      {cat.categories.length > 1 && (
        <Group title="Category">
          <OptionList
            options={cat.categories.map((c) => ({ id: c.name, label: c.name, count: c.count }))}
            value={selected.category}
            onChange={(v) => set("category", v)}
          />
        </Group>
      )}

      {cat.brands.length > 1 && (
        <Group title="Brand">
          <OptionList
            options={cat.brands.map((b) => ({ id: b.name, label: b.name, count: b.count }))}
            value={selected.brand}
            onChange={(v) => set("brand", v)}
            collapseAfter={6}
          />
        </Group>
      )}

      <Group title="Price">
        <OptionList
          options={PRICE_BANDS.map((b) => ({ id: b.id, label: b.label }))}
          value={selected.price}
          onChange={(v) => set("price", v)}
        />
      </Group>
    </div>
  );
};

const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <fieldset>
    <legend className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-v2-muted">{title}</legend>
    {children}
  </fieldset>
);

const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cx(
      "inline-flex min-h-11 items-center rounded-full md:min-h-0 px-3.5 py-2 text-[13px] font-semibold transition-colors",
      active ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface hover:border-v2-ink/30",
    )}
  >
    {children}
  </button>
);

/** Single-select list; clicking the active option clears it. */
const OptionList: React.FC<{
  options: { id: string; label: string; count?: number }[];
  value: string | null;
  onChange: (v: string | null) => void;
  collapseAfter?: number;
}> = ({ options, value, onChange, collapseAfter }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = collapseAfter && !expanded ? collapseAfter : options.length;
  return (
    <div>
      <ul className="space-y-0.5">
        {options.slice(0, limit).map((o) => {
          const active = value === o.id;
          return (
            <li key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(active ? null : o.id)}
                className={cx(
                  "flex min-h-11 w-full items-center gap-3 rounded-v2-sm px-2 py-2 text-left text-[14px] md:min-h-0 transition-colors hover:bg-v2-sunken",
                  active && "font-semibold",
                )}
              >
                <span
                  className={cx(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-v2-plum" : "border-v2-line",
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-v2-plum" />}
                </span>
                <span className="flex-1 truncate">{o.label}</span>
                {o.count !== undefined && <span className="text-[12px] text-v2-muted">{o.count}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {collapseAfter && options.length > collapseAfter && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 px-2 text-[13px] font-semibold text-v2-plum hover:underline"
        >
          {expanded ? "Show less" : `Show all ${options.length}`}
        </button>
      )}
    </div>
  );
};

/* ── Bits ────────────────────────────────────────────────────── */

const SearchRefine: React.FC<{ initial: string }> = ({ initial }) => {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  useEffect(() => setQ(initial), [initial]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className="mt-6 flex h-12 max-w-xl items-center gap-3 rounded-full border border-v2-line bg-v2-surface px-5 focus-within:border-v2-plum focus-within:ring-4 focus-within:ring-v2-plum/10"
      role="search"
    >
      <IoSearchOutline className="text-v2-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search again"
        aria-label="Search products"
        className="h-full flex-1 bg-transparent text-[16px] outline-none focus-visible:outline-none md:text-[15px]"
      />
    </form>
  );
};

const EmptyState: React.FC<{ hasFilters: boolean; onClear: () => void; isSearch: boolean }> = ({
  hasFilters,
  onClear,
  isSearch,
}) => (
  <div className="mt-8 rounded-v2-xl border border-dashed border-v2-line px-6 py-16 text-center">
    <p className="font-v2-display text-[22px] font-semibold">
      {hasFilters ? "Nothing matches those filters" : isSearch ? "No products found" : "Nothing here yet"}
    </p>
    <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-v2-muted">
      {hasFilters
        ? "Try removing a filter or two to see more."
        : isSearch
          ? "Check the spelling or try a more general word, like “lube” or “massager”."
          : "New products are on their way. Browse the full range meanwhile."}
    </p>
    <div className="mt-6 flex justify-center gap-2">
      {hasFilters && <Button onClick={onClear}>Clear filters</Button>}
      <ButtonLink to="/shop" variant={hasFilters ? "secondary" : "primary"}>
        Browse all products
      </ButtonLink>
    </div>
  </div>
);

export default CatalogPage;
