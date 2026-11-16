/** Route entry points for the three listing pages. All share CatalogPage. */
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CatalogPage from "./Catalog";
import { QUICK_FILTERS } from "../hooks/useCatalog";

const COLLECTION_LABELS: Record<string, { title: string; description: string }> = {
  women: { title: "For her", description: "Massagers, lubricants and intimate care, chosen for comfort and pleasure." },
  men: { title: "For him", description: "Performance, protection and grooming essentials." },
  couples: { title: "For couples", description: "Products made to be discovered together." },
  wellness: { title: "Wellness & care", description: "Hygiene, cleaners and everyday intimate health." },
};

const titleCase = (s: string) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const ShopPage: React.FC = () => {
  const [params] = useSearchParams();
  const quick = QUICK_FILTERS.find((f) => f.id === params.get("filter"));
  return (
    <CatalogPage
      scope={{ kind: "shop" }}
      header={{
        title: quick?.label ?? "Shop all",
        description: quick ? undefined : "Every product we stock — genuine, sealed and shipped in plain packaging.",
        crumbs: quick ? [{ label: "Shop", to: "/shop" }, { label: quick.label }] : [{ label: "Shop" }],
      }}
    />
  );
};

export const SearchPage: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  return (
    <CatalogPage
      scope={{ kind: "search", query: q }}
      header={{
        eyebrow: "Search",
        title: q ? `Results for “${q}”` : "Search",
        crumbs: [{ label: "Search" }],
      }}
    />
  );
};

export const CollectionPage: React.FC = () => {
  const { slug = "" } = useParams();
  const meta = COLLECTION_LABELS[slug.toLowerCase()];
  const title = meta?.title ?? (slug ? titleCase(slug) : "Collections");
  return (
    <CatalogPage
      scope={{ kind: "collection", slug }}
      header={{
        eyebrow: "Collection",
        title,
        description: meta?.description,
        crumbs: [{ label: "Shop", to: "/shop" }, { label: title }],
      }}
    />
  );
};
