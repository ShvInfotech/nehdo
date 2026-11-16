/**
 * Listing logic for Shop / Search / Collection.
 * Filter + sort rules come from v1 Shop.tsx; the URL is the single source
 * of truth so every filtered view is shareable and survives refresh.
 * Adds support for ?filter=new|trending|sale, which v1 nav links already use
 * but v1 Shop ignored.
 */
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products as allProducts, searchProducts, type Product } from "../../data/products";

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Top rated" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

export const PRICE_BANDS = [
  { id: "u500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-2500", label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { id: "o2500", label: "Over ₹2,500", min: 2500, max: Infinity },
] as const;

export const QUICK_FILTERS = [
  { id: "new", label: "New arrivals" },
  { id: "trending", label: "Bestsellers" },
  { id: "sale", label: "On sale" },
] as const;

type Key = "category" | "brand" | "price" | "sort" | "filter";

export type CatalogScope =
  | { kind: "shop" }
  | { kind: "search"; query: string }
  | { kind: "collection"; slug: string };

/** Base list for each page type (v1 Search / Collection rules). */
function scopeProducts(scope: CatalogScope): { base: Product[]; fallback: boolean } {
  if (scope.kind === "search") {
    return { base: scope.query.trim() ? searchProducts(scope.query.trim()) : [], fallback: false };
  }
  if (scope.kind === "collection") {
    const slug = scope.slug.toLowerCase().trim();
    const matches = allProducts.filter(
      (p) => (p.category || "").toLowerCase().trim() === slug || (p.brand || "").toLowerCase().trim() === slug,
    );
    // v1 falls back to everything; v2 does too but tells the shopper.
    return matches.length ? { base: matches, fallback: false } : { base: allProducts, fallback: true };
  }
  return { base: allProducts, fallback: false };
}

const countBy = (list: Product[], pick: (p: Product) => string) => {
  const m = new Map<string, number>();
  list.forEach((p) => {
    const k = pick(p);
    if (k) m.set(k, (m.get(k) || 0) + 1);
  });
  return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
};

export function useCatalog(scope: CatalogScope) {
  const [params, setParams] = useSearchParams();
  const scopeKey = scope.kind === "search" ? `s:${scope.query}` : scope.kind === "collection" ? `c:${scope.slug}` : "shop";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { base, fallback } = useMemo(() => scopeProducts(scope), [scopeKey]);
  const categories = useMemo(() => countBy(base, (p) => p.category), [base]);
  const brands = useMemo(() => countBy(base, (p) => p.brand), [base]);

  // URL values, resolved case-insensitively against what exists
  const rawCategory = params.get("category")?.toLowerCase();
  const rawBrand = params.get("brand")?.toLowerCase();
  const category = categories.find((c) => c.name.toLowerCase() === rawCategory)?.name ?? null;
  const brand = brands.find((b) => b.name.toLowerCase() === rawBrand)?.name ?? null;
  const price = PRICE_BANDS.find((b) => b.id === params.get("price")) ?? null;
  const sort: SortId = (SORTS.find((s) => s.id === params.get("sort"))?.id ?? "featured") as SortId;
  const filter = QUICK_FILTERS.find((f) => f.id === params.get("filter")) ?? null;

  const results = useMemo(() => {
    let r = [...base];
    if (filter?.id === "new") r = r.filter((p) => p.isNew);
    if (filter?.id === "trending") r = r.filter((p) => p.isTrending);
    if (filter?.id === "sale") r = r.filter((p) => p.originalPrice && p.originalPrice > p.price);
    if (category) r = r.filter((p) => p.category === category);
    if (brand) r = r.filter((p) => p.brand === brand);
    if (price) r = r.filter((p) => p.price >= price.min && p.price < price.max);
    switch (sort) {
      case "price-asc": r.sort((a, b) => a.price - b.price); break;
      case "price-desc": r.sort((a, b) => b.price - a.price); break;
      case "newest": r.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      case "rating": r.sort((a, b) => b.rating - a.rating); break;
    }
    return r;
  }, [base, filter, category, brand, price, sort]);

  const set = useCallback(
    (key: Key, value: string | null) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === "" || (key === "sort" && value === "featured")) next.delete(key);
          else next.set(key, key === "category" || key === "brand" ? value.toLowerCase() : value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clear = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams();
        const q = prev.get("q");
        if (q) next.set("q", q); // keep the search query
        const s = prev.get("sort");
        if (s) next.set("sort", s);
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const chips = [
    filter && { key: "filter" as Key, label: filter.label },
    category && { key: "category" as Key, label: category },
    brand && { key: "brand" as Key, label: brand },
    price && { key: "price" as Key, label: price.label },
  ].filter(Boolean) as { key: Key; label: string }[];

  return {
    results,
    total: base.length,
    fallback,
    categories,
    brands,
    selected: { category, brand, price: price?.id ?? null, sort, filter: filter?.id ?? null },
    set,
    clear,
    chips,
  };
}
