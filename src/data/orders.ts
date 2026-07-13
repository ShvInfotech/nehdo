export interface OrderItem {
    productId: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

export interface Order {
    id: string;
    date: string;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    items: OrderItem[];
    total: number;
    shippingAddress: string;
    trackingNumber: string | null;
}

const IMG = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo";

export const orders: Order[] = [
    { id: "ORD-2026-1847", date: "2026-07-08", status: "Processing", items: [{ productId: 1, name: "Yves Saint Laurent Tee", image: `${IMG}/bkt7vcv1_expires_30_days.png`, price: 39.99, quantity: 2, size: "L", color: "Black" }, { productId: 9, name: "Versace Medusa Sneakers", image: `${IMG}/64ofuakc_expires_30_days.png`, price: 79.99, quantity: 1, size: "10", color: "White/Gold" }], total: 159.97, shippingAddress: "123 Fashion St, Mumbai 400001", trackingNumber: null },
    { id: "ORD-2026-1523", date: "2026-07-01", status: "Shipped", items: [{ productId: 5, name: "Chanel Vibe Blazer", image: `${IMG}/mb4krc3r_expires_30_days.png`, price: 65.99, quantity: 1, size: "M", color: "Pink Tweed" }], total: 65.99, shippingAddress: "456 Style Ave, Delhi 110001", trackingNumber: "TRK98765432" },
    { id: "ORD-2026-1201", date: "2026-06-22", status: "Delivered", items: [{ productId: 10, name: "LV Monogram Bag", image: `${IMG}/mb4krc3r_expires_30_days.png`, price: 149.99, quantity: 1, size: "One Size", color: "Monogram" }, { productId: 13, name: "Hermes Silk Scarf", image: `${IMG}/b2qfbw9i_expires_30_days.png`, price: 35.99, quantity: 1, size: "One Size", color: "Orange" }], total: 185.98, shippingAddress: "789 Luxury Blvd, Bangalore 560001", trackingNumber: "TRK12345678" },
    { id: "ORD-2026-0987", date: "2026-06-10", status: "Delivered", items: [{ productId: 4, name: "Dior Summer Dress", image: `${IMG}/64ofuakc_expires_30_days.png`, price: 49.99, quantity: 1, size: "S", color: "Blush" }], total: 49.99, shippingAddress: "321 Trend St, Hyderabad 500001", trackingNumber: "TRK55667788" },
    { id: "ORD-2026-0654", date: "2026-05-28", status: "Cancelled", items: [{ productId: 14, name: "Balenciaga Track Runner", image: `${IMG}/64ofuakc_expires_30_days.png`, price: 110.00, quantity: 1, size: "9", color: "White" }], total: 110.00, shippingAddress: "654 Urban Rd, Pune 411001", trackingNumber: null },
];
