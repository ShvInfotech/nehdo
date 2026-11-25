/**
 * Product detail logic, lifted from the old UI pages/Product.tsx:
 * variant lookup (`${color}/${size}`), variant price/stock, add to cart,
 * Buy now via Razorpay Magic Checkout, reviews fetch, related products.
 *
 * Differences from the old UI (bug fixes, not behaviour changes):
 *  - Add to cart now sends the selected quantity (old always added 1).
 *  - All hooks run unconditionally (old called useEffect after an early return).
 *  - Gallery falls back to the main image when `images` is empty.
 */
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductById, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { triggerMagicCheckout } from "../utils/magicCheckout";
import { userapiRequest } from "../services/apiService";
import { useAsync } from "./useAsync";

export interface ProductReview {
  _id: string;
  rating: number;
  review: string;
  userName: string;
}

export function useProductDetail(id: string) {
  const product: any = getProductById(id);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { user, setSession, isLoggedIn, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [size, setSize] = useState<string>(product?.sizes?.[0] || "");
  const [color, setColor] = useState<string>(product?.colors?.[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  const gallery: string[] = useMemo(() => {
    if (!product) return [];
    const list = [product.image, ...(product.images || [])].filter(Boolean);
    return [...new Set(list)] as string[];
  }, [product]);

  const variant = product?.variants?.find((v: any) => v.name === `${color}/${size}`);
  const price: number = variant?.price ?? product?.price ?? 0;
  const stock = Number(variant?.stock ?? 0); // no matching variant => 0 (original rule)
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 4;
  const original: number = product?.originalPrice ?? product?.price ?? 0;
  const discount = original > price ? Math.round((1 - price / original) * 100) : null;

  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10) : []),
    [product],
  );

  const { data: reviews, loading: reviewsLoading } = useAsync<ProductReview[]>(
    async () => {
      if (!product) return [];
      const res: any = await userapiRequest(`/user/api/v1/product/reviews/${product.id}`, "GET");
      return Array.isArray(res?.reviews) ? res.reviews : [];
    },
    [],
    [product?.id],
  );

  const lineItem = () => ({
    productId: product.id,
    name: product.name,
    brand: product.brand,
    image: product.image,
    price,
    originalPrice: product.originalPrice,
    size: size || product.sizes?.[0] || "",
    color: color || product.colors?.[0]?.name || "",
    shipping: product.shipping ?? true,
  });

  const addToCart = useCallback(async () => {
    if (!product || isOutOfStock) return;
    setAdding(true);
    try {
      await addItem(lineItem(), quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOutOfStock, quantity, price, size, color, addItem]);

  const buyNow = useCallback(() => {
    if (!product || isOutOfStock) return;
    setBuying(true);
    triggerMagicCheckout({
      items: [{ ...lineItem(), quantity }],
      user,
      onSuccess: (res) => {
        setBuying(false);
        if (res.accessToken && res.user) setSession(res.user, res.accessToken);
        toast.success("Order placed successfully!");
        navigate("/order-confirmation");
      },
      onError: () => setBuying(false),
      onClose: () => setBuying(false),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOutOfStock, quantity, price, size, color, user]);

  const toggleWishlist = useCallback(async () => {
    if (!product) return;
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    await toggle(product.id);
  }, [product, isLoggedIn, openAuthModal, toggle]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : product?.rating || 0;

  return {
    product,
    gallery,
    size,
    setSize,
    color,
    setColor,
    quantity,
    // never below 1, never above available stock
    setQuantity: (n: number) => setQuantity(Math.max(1, Math.min(n, stock > 0 ? stock : 1))),
    price,
    original,
    discount,
    stock,
    isOutOfStock,
    isLowStock,
    addToCart,
    adding,
    added,
    buyNow,
    buying,
    inWishlist: product ? has(product.id) : false,
    toggleWishlist,
    reviews,
    reviewsLoading,
    avgRating,
    related,
  };
}
