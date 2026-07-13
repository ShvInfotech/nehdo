export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number | null;
    image: string;
    images: string[];
    category: string;
    description: string;
    sizes: string[];
    colors: { name: string; hex: string }[];
    rating: number;
    reviews: number;
    isNew: boolean;
    isTrending: boolean;
    tags: string[];
}

const IMG = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo";

export const products: Product[] = [
    { id: 1, name: "Yves Saint Laurent Tee", brand: "YSL", price: 39.99, originalPrice: 59.99, image: `${IMG}/bkt7vcv1_expires_30_days.png`, images: [`${IMG}/bkt7vcv1_expires_30_days.png`, `${IMG}/gw9whifd_expires_30_days.png`], category: "Men", description: "A premium YSL cotton tee crafted from 100% organic cotton. Features a relaxed fit with the iconic YSL logo, perfect for everyday luxury. Soft to the touch and built to last.", sizes: ["S", "M", "L", "XL", "XXL"], colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "White", hex: "#f5f5f5" }, { name: "Navy", hex: "#1e3a5f" }], rating: 4.8, reviews: 128, isNew: true, isTrending: true, tags: ["t-shirt", "luxury", "casual"] },
    { id: 2, name: "Gucci Classic Polo", brand: "Gucci", price: 45.99, originalPrice: null, image: `${IMG}/gw9whifd_expires_30_days.png`, images: [`${IMG}/gw9whifd_expires_30_days.png`, `${IMG}/bkt7vcv1_expires_30_days.png`], category: "Men", description: "Timeless Gucci polo shirt made with premium piqué cotton. Features the signature interlocking G logo embroidered on the chest. A versatile piece for smart-casual occasions.", sizes: ["S", "M", "L", "XL"], colors: [{ name: "Green", hex: "#2d5a27" }, { name: "Red", hex: "#8b1a1a" }, { name: "Cream", hex: "#f5f0e1" }], rating: 4.9, reviews: 210, isNew: true, isTrending: true, tags: ["polo", "luxury", "smart-casual"] },
    { id: 3, name: "Prada Elite Jacket", brand: "Prada", price: 59.99, originalPrice: 79.99, image: `${IMG}/b2qfbw9i_expires_30_days.png`, images: [`${IMG}/b2qfbw9i_expires_30_days.png`, `${IMG}/64ofuakc_expires_30_days.png`], category: "Men", description: "Refined Prada jacket crafted from Italian wool blend. Slim-fit silhouette with peak lapels and horn buttons. Fully lined in signature Prada silk.", sizes: ["S", "M", "L", "XL"], colors: [{ name: "Charcoal", hex: "#36454f" }, { name: "Navy", hex: "#1e3a5f" }], rating: 4.7, reviews: 95, isNew: false, isTrending: false, tags: ["jacket", "formal", "wool"] },
    { id: 4, name: "Dior Summer Dress", brand: "Dior", price: 49.99, originalPrice: null, image: `${IMG}/64ofuakc_expires_30_days.png`, images: [`${IMG}/64ofuakc_expires_30_days.png`, `${IMG}/mb4krc3r_expires_30_days.png`], category: "Women", description: "Ethereal Dior summer dress in flowing chiffon. A-line silhouette with delicate floral print and adjustable tie waist. Perfect for garden parties and brunches.", sizes: ["XS", "S", "M", "L"], colors: [{ name: "Blush", hex: "#de9bc2" }, { name: "Sky Blue", hex: "#87ceeb" }, { name: "White", hex: "#ffffff" }], rating: 4.6, reviews: 142, isNew: true, isTrending: true, tags: ["dress", "summer", "chiffon"] },
    { id: 5, name: "Chanel Vibe Blazer", brand: "Chanel", price: 65.99, originalPrice: 89.99, image: `${IMG}/mb4krc3r_expires_30_days.png`, images: [`${IMG}/mb4krc3r_expires_30_days.png`, `${IMG}/bkt7vcv1_expires_30_days.png`], category: "Women", description: "Iconic Chanel tweed blazer with chain-trim edges. Double-breasted with gold-tone CC buttons. A statement piece that elevates any wardrobe.", sizes: ["XS", "S", "M", "L", "XL"], colors: [{ name: "Pink Tweed", hex: "#d4a5a5" }, { name: "Black", hex: "#1a1a1a" }], rating: 5.0, reviews: 312, isNew: false, isTrending: true, tags: ["blazer", "tweed", "luxury"] },
    { id: 6, name: "Armani Tailored Suit", brand: "Armani", price: 89.99, originalPrice: null, image: `${IMG}/bkt7vcv1_expires_30_days.png`, images: [`${IMG}/bkt7vcv1_expires_30_days.png`, `${IMG}/gw9whifd_expires_30_days.png`], category: "Men", description: "Impeccably tailored Armani suit in Super 150s wool. Notch lapel, dual vents, and half-canvas construction. The pinnacle of Italian sartorial excellence.", sizes: ["S", "M", "L", "XL", "XXL"], colors: [{ name: "Midnight", hex: "#191970" }, { name: "Charcoal", hex: "#36454f" }], rating: 4.5, reviews: 88, isNew: false, isTrending: false, tags: ["suit", "formal", "wool"] },
    { id: 7, name: "Fendi Logo Jacket", brand: "Fendi", price: 55.99, originalPrice: 75.99, image: `${IMG}/gw9whifd_expires_30_days.png`, images: [`${IMG}/gw9whifd_expires_30_days.png`, `${IMG}/b2qfbw9i_expires_30_days.png`], category: "Women", description: "Bold Fendi bomber jacket with the iconic FF monogram pattern. Ribbed cuffs and hem with gold-tone zipper. A statement outerwear piece for fashion-forward individuals.", sizes: ["XS", "S", "M", "L"], colors: [{ name: "Brown", hex: "#8b4513" }, { name: "Black", hex: "#1a1a1a" }], rating: 4.8, reviews: 176, isNew: true, isTrending: false, tags: ["jacket", "bomber", "logo"] },
    { id: 8, name: "Burberry Trench Coat", brand: "Burberry", price: 120.00, originalPrice: null, image: `${IMG}/b2qfbw9i_expires_30_days.png`, images: [`${IMG}/b2qfbw9i_expires_30_days.png`, `${IMG}/64ofuakc_expires_30_days.png`], category: "Women", description: "The quintessential Burberry trench coat in honey-colored gabardine. Features the signature check lining, storm shield, and D-ring belt. A timeless investment piece.", sizes: ["XS", "S", "M", "L", "XL"], colors: [{ name: "Honey", hex: "#c8a951" }, { name: "Black", hex: "#1a1a1a" }], rating: 4.4, reviews: 34, isNew: false, isTrending: false, tags: ["coat", "trench", "classic"] },
    { id: 9, name: "Versace Medusa Sneakers", brand: "Versace", price: 79.99, originalPrice: 99.99, image: `${IMG}/64ofuakc_expires_30_days.png`, images: [`${IMG}/64ofuakc_expires_30_days.png`, `${IMG}/mb4krc3r_expires_30_days.png`], category: "Shoes", description: "Luxurious Versace sneakers with Medusa head appliqué. Premium leather upper with rubber sole for comfort. Runs true to size.", sizes: ["7", "8", "9", "10", "11", "12"], colors: [{ name: "White/Gold", hex: "#ffffff" }, { name: "Black/Gold", hex: "#1a1a1a" }], rating: 4.7, reviews: 203, isNew: true, isTrending: true, tags: ["sneakers", "leather", "luxury"] },
    { id: 10, name: "LV Monogram Bag", brand: "Louis Vuitton", price: 149.99, originalPrice: null, image: `${IMG}/mb4krc3r_expires_30_days.png`, images: [`${IMG}/mb4krc3r_expires_30_days.png`, `${IMG}/bkt7vcv1_expires_30_days.png`], category: "Bags", description: "Iconic Louis Vuitton monogram canvas handbag with natural cowhide trim. Features alcantara lining and gold-tone hardware. A timeless companion for every occasion.", sizes: ["One Size"], colors: [{ name: "Monogram", hex: "#8b6914" }, { name: "Damier Ebene", hex: "#5c4033" }], rating: 4.9, reviews: 415, isNew: false, isTrending: true, tags: ["bag", "handbag", "monogram"] },
    { id: 11, name: "Kids Cotton Hoodie", brand: "Nehdo Kids", price: 24.99, originalPrice: 34.99, image: `${IMG}/bkt7vcv1_expires_30_days.png`, images: [`${IMG}/bkt7vcv1_expires_30_days.png`], category: "Kids", description: "Super soft organic cotton hoodie for children. Features fun colorblock design, kangaroo pocket, and ribbed cuffs. Machine washable and built for active play.", sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"], colors: [{ name: "Sky Blue", hex: "#87ceeb" }, { name: "Pink", hex: "#ffb6c1" }, { name: "Green", hex: "#90ee90" }], rating: 4.6, reviews: 89, isNew: true, isTrending: false, tags: ["hoodie", "kids", "cotton"] },
    { id: 12, name: "Valentino Rockstud Heels", brand: "Valentino", price: 95.00, originalPrice: null, image: `${IMG}/gw9whifd_expires_30_days.png`, images: [`${IMG}/gw9whifd_expires_30_days.png`], category: "Shoes", description: "Signature Valentino Garavani Rockstud pumps in patent leather. 100mm heel with platinum-finish studs. A red-carpet staple.", sizes: ["5", "6", "7", "8", "9"], colors: [{ name: "Nude", hex: "#e8c4a0" }, { name: "Black", hex: "#1a1a1a" }, { name: "Red", hex: "#b22222" }], rating: 4.8, reviews: 156, isNew: false, isTrending: true, tags: ["heels", "pumps", "studs"] },
    { id: 13, name: "Hermes Silk Scarf", brand: "Hermès", price: 35.99, originalPrice: null, image: `${IMG}/b2qfbw9i_expires_30_days.png`, images: [`${IMG}/b2qfbw9i_expires_30_days.png`], category: "Women", description: "Hand-rolled Hermès silk twill scarf in an exclusive equestrian print. 90cm x 90cm — can be worn as a headband, neck tie, or bag accessory.", sizes: ["One Size"], colors: [{ name: "Orange", hex: "#ff6600" }, { name: "Blue", hex: "#003366" }], rating: 4.9, reviews: 267, isNew: false, isTrending: false, tags: ["scarf", "silk", "accessory"] },
    { id: 14, name: "Balenciaga Track Runner", brand: "Balenciaga", price: 110.00, originalPrice: 139.99, image: `${IMG}/64ofuakc_expires_30_days.png`, images: [`${IMG}/64ofuakc_expires_30_days.png`], category: "Shoes", description: "Balenciaga Track Runner sneaker with multi-material upper. Chunky sole with mesh and nylon panels. Oversized but lightweight — a streetwear essential.", sizes: ["7", "8", "9", "10", "11", "12", "13"], colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#1a1a1a" }, { name: "Beige", hex: "#d2b48c" }], rating: 4.3, reviews: 198, isNew: true, isTrending: true, tags: ["sneakers", "track", "streetwear"] },
    { id: 15, name: "Givenchy Mini Crossbody", brand: "Givenchy", price: 68.00, originalPrice: null, image: `${IMG}/mb4krc3r_expires_30_days.png`, images: [`${IMG}/mb4krc3r_expires_30_days.png`], category: "Bags", description: "Compact Givenchy crossbody in smooth calfskin leather. Features adjustable chain strap, 4G clasp, and suede-lined interior. Fits phone, cards, and essentials.", sizes: ["One Size"], colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Tan", hex: "#d2b48c" }, { name: "Burgundy", hex: "#800020" }], rating: 4.7, reviews: 143, isNew: false, isTrending: false, tags: ["bag", "crossbody", "leather"] },
    { id: 16, name: "Kids Denim Overalls", brand: "Nehdo Kids", price: 29.99, originalPrice: 39.99, image: `${IMG}/gw9whifd_expires_30_days.png`, images: [`${IMG}/gw9whifd_expires_30_days.png`], category: "Kids", description: "Adorable denim overalls with adjustable straps and snap buttons. Made from soft, stretchy denim that moves with your little one. Multiple pockets for treasures.", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: [{ name: "Light Wash", hex: "#a8c5e2" }, { name: "Dark Wash", hex: "#2c3e50" }], rating: 4.5, reviews: 67, isNew: true, isTrending: false, tags: ["overalls", "denim", "kids"] },
];

export const categories = ["All", "Men", "Women", "Kids", "Shoes", "Bags"];
export const subCategories: Record<string, string[]> = {
    "Men": ["T-Shirts", "Shirts", "Jeans", "Jackets", "Suits"],
    "Women": ["Dresses", "Tops & Tees", "Blazers", "Coats", "Skirts"],
    "Kids": ["Hoodies", "Overalls", "T-Shirts", "Pants"],
    "Shoes": ["Sneakers", "Heels", "Runners", "Boots"],
    "Bags": ["Handbags", "Crossbody", "Backpacks", "Wallets"]
};
export const brands = [...new Set(products.map(p => p.brand))];

export const getProductById = (id: number) => products.find(p => p.id === id);
export const getProductsByCategory = (cat: string) => cat === "All" ? products : products.filter(p => p.category === cat);
export const getProductsByBrand = (brand: string) => products.filter(p => p.brand === brand);
export const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
    );
};
