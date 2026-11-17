import React from "react";
import { Link } from "react-router-dom";
import { IoBagAddOutline, IoCheckmark, IoHeart, IoHeartOutline } from "react-icons/io5";
import type { Product } from "../../data/products";
import { useProductActions } from "../../hooks/useProducts";
import { Badge, Img, Price, Rating, Spinner } from "../ui";
import { cx, discountPct } from "../../lib/format";

const ProductCard: React.FC<{ product: Product; className?: string }> = ({ product, className }) => {
  const { addToCart, adding, added, inWishlist, toggleWishlist } = useProductActions(product);
  const pct = discountPct(product.price, product.originalPrice);
  const hoverImage = product.images?.find((src) => src && src !== product.image);

  return (
    // `relative` contains abs-positioned descendants (e.g. sr-only text) so they can't leak out of rails
    <article className={cx("group relative flex flex-col", className)}>
      {/* image frame — buttons are positioned against this */}
      <div className="relative">
        <Link
          to={`/product/${product.id}`}
          className="relative block overflow-hidden rounded-v2-lg bg-v2-sunken"
          aria-label={product.name}
        >
          <Img
            src={product.image}
            alt={product.name}
            frameClassName="aspect-[4/5]"
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {pct && <Badge tone="coral">−{pct}%</Badge>}
            {product.isNew && <Badge tone="white">New</Badge>}
          </div>
        </Link>

        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
          className={cx(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-v2-sm backdrop-blur transition-colors before:absolute before:-inset-1.5 before:content-['']",
            inWishlist ? "text-v2-coral" : "text-v2-ink hover:text-v2-coral",
          )}
        >
          {inWishlist ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
        </button>

        <button
          type="button"
          onClick={addToCart}
          disabled={adding}
          aria-label={`Add ${product.name} to cart`}
          className={cx(
            "absolute bottom-3 right-3 flex h-10 min-w-10 items-center before:absolute before:-inset-1 before:content-[''] justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-white shadow-v2 transition-all duration-300",
            added ? "bg-v2-sage" : "bg-v2-plum hover:bg-v2-plum-deep",
            // desktop: reveal on hover/focus; touch: always visible
            "md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100",
            added && "md:translate-y-0 md:opacity-100",
          )}
        >
          {adding ? <Spinner /> : added ? <IoCheckmark size={16} /> : <IoBagAddOutline size={16} />}
          <span className="hidden sm:inline">{added ? "Added" : "Add"}</span>
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <div className="flex min-h-[18px] items-center justify-between gap-2">
          <span className="truncate text-[11.5px] font-semibold uppercase tracking-[0.1em] text-v2-muted">
            {product.brand}
          </span>
          <Rating value={product.rating} count={product.reviews} />
        </div>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-[14.5px] font-medium leading-snug hover:text-v2-plum"
        >
          {product.name}
        </Link>
        <Price price={product.price} original={product.originalPrice} size="sm" showPct={false} className="mt-auto pt-2" />
      </div>
    </article>
  );
};

export default ProductCard;
