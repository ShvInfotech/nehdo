import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
    productId: number;
    name: string;
    brand: string;
    image: string;
    price: number;
    originalPrice: number | null;
    quantity: number;
    size: string;
    color: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (productId: number, size: string, color: string) => void;
    updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    shipping: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId && i.size === item.size && i.color === item.color);
            if (existing) {
                return prev.map(i =>
                    i.productId === item.productId && i.size === item.size && i.color === item.color
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { ...item, quantity }];
        });
    }, []);

    const removeItem = useCallback((productId: number, size: string, color: string) => {
        setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size && i.color === color)));
    }, []);

    const updateQuantity = useCallback((productId: number, size: string, color: string, quantity: number) => {
        if (quantity <= 0) return removeItem(productId, size, color);
        setItems(prev => prev.map(i =>
            i.productId === productId && i.size === size && i.color === color ? { ...i, quantity } : i
        ));
    }, [removeItem]);

    const clearCart = useCallback(() => setItems([]), []);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 250 ? 0 : 9.99;
    const total = subtotal + shipping;

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, shipping, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
