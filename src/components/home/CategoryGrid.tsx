import React from "react";
import { Link } from "react-router-dom";
import { useHomeCategories } from "../../hooks/useHomeData";
import { Container, Img, Section, SectionHeader, Skeleton } from "../ui";

/** Admin categories flagged for homepage display (the old UI: ShopByCategory). */
const CategoryGrid: React.FC = () => {
  const { categories, loading } = useHomeCategories();
  if (!loading && categories.length === 0) return null;

  return (
    <Section tight>
      <Container>
        <SectionHeader title="Browse categories" action={{ label: "View all", to: "/shop" }} />
        <div className="v2-no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[38%] shrink-0 md:w-auto">
                  <Skeleton className="aspect-square rounded-v2-lg" />
                  <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
                </div>
              ))
            : categories.map((c) => (
                <Link
                  key={c.name}
                  to={`/shop?category=${encodeURIComponent(c.name.toLowerCase())}`}
                  className="group w-[38%] shrink-0 text-center md:w-auto"
                >
                  <Img
                    src={c.image}
                    alt=""
                    frameClassName="aspect-square rounded-v2-lg"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="mt-3 block text-[14.5px] font-semibold group-hover:text-v2-plum">{c.name}</span>
                  {c.desc && <span className="block truncate text-[12.5px] text-v2-muted">{c.desc}</span>}
                </Link>
              ))}
        </div>
      </Container>
    </Section>
  );
};

export default CategoryGrid;
