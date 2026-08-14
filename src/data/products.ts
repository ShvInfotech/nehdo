import { userapiRequest } from '../services/apiService';

export interface Variant {
  _id: string;
  name: string; // e.g. "White/XS"
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  variants: Variant[]; // add this
  rating: number;
  reviews: number;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  isNew: boolean;
  isTrending: boolean;
  tags: string[];
}

// Global products array
export let products: Product[] = [];

// Load products from API
export const loadProducts = async () => {
  try {
    const res: any = await userapiRequest('/user/api/v1/product','GET');
    products = (res.products || []).map((p: any) => ({
      id: p._id,

      name: p.name || '',

      brand: p.brand || '',

      price: p.salePrice || p.price || 0,

      originalPrice:
        p.salePrice && p.salePrice < p.price
          ? p.price
          : null,

      image: p.productImage || '',

      // currently backend sends single image
      images: p.productImages  || [],

      category: p.category || 'All',

      subcategory: p.subcategory || '',

      description: p.description || '',

      sizes: Array.isArray(p.size)
  ? p.size
  : p.size
    ? [p.size]
    : [],

      colors: (p.colors || []).map((c: string) => ({
        name: c,
        hex: c.toLowerCase(), // temporary default color
      })),

      variants: p.variants || [],

      rating: p.averageRating || 0,

      reviews: p.totalCustomerRating || 0,

      isNew: (p.flags || []).includes('New Arrival'),

      isTrending: (p.flags || []).includes('Trending'),

      tags: p.flags || [],
    }));

    return products;

  } catch (error) {
    console.error('Failed to load products:', error);
    products = [];
    return [];
  }
};

// Dynamic categories from products
export const getCategories = () => [
  'All',
  ...new Set(products.map(p => p.category)),
];

// Dynamic brands from products
export const getBrands = () => [
  ...new Set(products.map(p => p.brand)),
];

// Product by id
export const getProductById = (id: string) =>
  products.find(p => p.id === id);

// Products by category
export const getProductsByCategory = (cat: string) =>
  cat === 'All'
    ? products
    : products.filter(p => p.category === cat);

// Products by brand
export const getProductsByBrand = (brand: string) =>
  products.filter(p => p.brand === brand);

// Search products
export const searchProducts = (query: string) => {
  const q = query.toLowerCase();

  return products.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
  );
};