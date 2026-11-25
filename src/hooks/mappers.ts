import type { Product } from "../data/products";
import type { CartItem } from "../context/CartContext";

/** Raw API product → app Product. Copied from the old UI TrendingProducts fallback mapping. */
export const mapApiProduct = (p: any): Product =>
  ({
    id: p._id,
    name: p.name || "",
    brand: p.brand || "",
    price: p.salePrice || p.price || 0,
    originalPrice: p.salePrice && p.salePrice < p.price ? p.price : null,
    image: p.productImage || "",
    images: p.productImages || [],
    category: p.category || "All",
    subcategory: p.subcategory || "",
    description: p.longDescription || "",
    sortdescription: p.shortDescription || "",
    sizes: p.sizes || [],
    colors: p.colors || [],
    variants: p.variants || [],
    rating: p.avgRating || 0,
    reviews: p.reviewCount || 0,
    isNew: p.isNew || false,
    isTrending: true,
    tags: p.tags || [],
  }) as Product;

/** Product → cart payload. Same defaults as old ProductCard.handleAddToCart. */
export const productToCartItem = (product: Product): Omit<CartItem, "_id" | "quantity"> => ({
  shipping: false,
  productId: product.id,
  name: product.name,
  brand: product.brand,
  image: product.image,
  price: product.price,
  originalPrice: product.originalPrice,
  size: product.sizes[0],
  color: product.colors[0]?.name || "Default",
});
