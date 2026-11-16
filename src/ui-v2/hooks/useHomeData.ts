/**
 * Homepage data hooks. Each one is the fetch logic lifted out of the
 * matching v1 component (same endpoint, same response handling).
 */
import { userapiRequest } from "../../services/apiService";
import { useCart } from "../../context/CartContext";
import { useAsync } from "./useAsync";
import { DEFAULT_PROMOS } from "../config";

/* ── Banners (v1: HeroSection, PromotionalBanners) ─────────── */

export interface BannerProduct {
  _id: string;
  name: string;
  salePrice: number;
  avgRating: number;
  image: string;
  category: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  ctaButtonText?: string;
  priority?: number;
  desktopImage: string;
  mobileImage: string;
  product?: BannerProduct | null;
}

export type BannerPlacement = "Hero Slider" | "Promotional Strip";

export function useBanners(placement: BannerPlacement) {
  const { data, loading } = useAsync<Banner[]>(
    async () => {
      const query = new URLSearchParams({ category: placement });
      const res: any = await userapiRequest(`/user/api/v1/common/banner?${query.toString()}`, "GET");
      return res?.success && Array.isArray(res.banners) ? res.banners : [];
    },
    [],
    [placement],
  );
  return { banners: data, loading };
}

/* ── Categories (v1: ShopByCategory) ──────────────────────── */

export interface HomeCategory {
  name: string;
  desc: string;
  image: string;
}

export function useHomeCategories() {
  const { data, loading } = useAsync<HomeCategory[]>(async () => {
    const res: any = await userapiRequest("/user/api/v1/common/category", "GET");
    return Array.isArray(res?.categories) ? res.categories : [];
  }, []);
  return { categories: data, loading };
}

/* ── Brands (v1: TopBrands) ───────────────────────────────── */

export interface HomeBrand {
  name: string;
  src: string;
}

export function useHomeBrands() {
  const { data, loading } = useAsync<HomeBrand[]>(async () => {
    const res: any = await userapiRequest("/user/api/v1/common/brands");
    return Array.isArray(res?.brands) ? res.brands : [];
  }, []);
  return { brands: data, loading };
}

/* ── Promo messages (v1: TopBar) ──────────────────────────── */

export function usePromos() {
  const { data } = useAsync<string[]>(async () => {
    const res: any = await userapiRequest("/user/api/v1/common/promo", "GET");
    return res?.success && Array.isArray(res.promos) && res.promos.length > 0 ? res.promos : DEFAULT_PROMOS;
  }, DEFAULT_PROMOS);
  return data;
}

/* ── Combos (v1: ComboDeals) ──────────────────────────────── */

export interface ComboProduct {
  _id: string;
  name: string;
  salePrice: number;
  price: number;
  productImage: string;
  category: string;
}

export interface Combo {
  _id: string;
  name: string;
  description: string;
  products: ComboProduct[];
  comboPrice: number;
  originalTotal: number;
  savingsPercent: number;
  tag?: string;
}

export function useCombos() {
  const { addItem } = useCart();
  const { data, loading } = useAsync<Combo[]>(async () => {
    const res: any = await userapiRequest("/user/api/v1/common/combo", "GET");
    return res?.success && Array.isArray(res.combos) ? res.combos : [];
  }, []);

  // Same as v1 handleAddCombo: each product added at an equal share of the combo price.
  const addCombo = async (combo: Combo) => {
    for (const p of combo.products) {
      await addItem({
        shipping: false,
        productId: p._id,
        name: p.name,
        brand: "",
        image: p.productImage,
        price: combo.comboPrice / combo.products.length,
        originalPrice: p.price,
        size: "",
        color: "Default",
      });
    }
  };

  return { combos: data, loading, addCombo };
}
