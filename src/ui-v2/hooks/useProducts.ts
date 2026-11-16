import { useCallback, useMemo, useState } from "react";
import { products, type Product } from "../../data/products";
import { userapiRequest } from "../../services/apiService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useAsync } from "./useAsync";
import { mapApiProduct, productToCartItem } from "./mappers";

/*
 * `products` is the live module binding from data/products, populated by
 * loadProducts() before App renders. Read it inside hooks, not at import time.
 */

/** v1 TrendingProducts: global store first, API fallback when empty. */
export function useTrendingProducts(limit = 10) {
  const { data, loading } = useAsync<Product[]>(async () => {
    const local = products.filter((p) => p.isTrending).slice(0, limit);
    if (local.length > 0) return local;
    const res: any = await userapiRequest(`/user/api/v1/product?filter=trending&limit=${limit}`, "GET");
    return Array.isArray(res?.products) ? res.products.map(mapApiProduct) : [];
  }, [], [limit]);
  return { products: data, loading };
}

/** v1 NewArrivals: isNew products, with category tabs. */
export function useNewArrivals() {
  const all = useMemo(() => products.filter((p) => p.isNew), []);
  const tabs = useMemo(() => ["All", ...new Set(all.map((p) => p.category).filter(Boolean))], [all]);
  const [activeTab, setActiveTab] = useState("All");
  const items = useMemo(
    () => (activeTab === "All" ? all : all.filter((p) => p.category === activeTab)),
    [activeTab, all],
  );
  return { items, tabs, activeTab, setActiveTab };
}

/** A few product images for decorative use (v1 MarqueeSection pattern). */
export function useProductImages(count = 6) {
  return useMemo(
    () => products.map((p) => p.image).filter(Boolean).slice(0, count),
    [count],
  );
}

/**
 * Card-level actions. Same cart payload as v1 ProductCard.
 * Wishlist asks guests to sign in first instead of letting the API 401.
 */
export function useProductActions(product: Product) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = useCallback(async () => {
    setAdding(true);
    try {
      await addItem(productToCartItem(product));
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setAdding(false);
    }
  }, [addItem, product]);

  const toggleWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    await toggle(product.id);
  }, [isLoggedIn, openAuthModal, toggle, product.id]);

  return { addToCart, adding, added, inWishlist: has(product.id), toggleWishlist };
}
