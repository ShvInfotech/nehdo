import React, { createContext, useContext, useState, useCallback } from "react";

interface WishlistContextType {
    items: number[];
    toggle: (productId: number) => void;
    has: (productId: number) => boolean;
    count: number;
    clear: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<number[]>([]);

    const toggle = useCallback((productId: number) => {
        setItems(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    }, []);

    const has = useCallback((productId: number) => items.includes(productId), [items]);

    const clear = useCallback(() => setItems([]), []);

    return (
        <WishlistContext.Provider value={{ items, toggle, has, count: items.length, clear }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
};
