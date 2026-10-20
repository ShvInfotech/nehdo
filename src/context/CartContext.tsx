import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';

import { userapiRequest } from '../services/apiService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice: number | null;
  quantity: number;
  size: string;
  color: string;
  shipping: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, '_id' | 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  itemCount: number;
  cartCount: number;
  subtotal: number;
  shipping: number;
  setShippingCharge: (amount: number) => void;
  shippingInfo: { estimated_delivery_days?: string; courier_name?: string; } | null;
  setShippingInfo: (info: any) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'guestCart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initial state: if guest cart exists in localStorage, preload it
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingInfo, setShippingInfo] = useState<{ estimated_delivery_days?: string; courier_name?: string; } | null>(null);

  // Helper: Sync guest cart to backend database
  const syncGuestCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (!stored) return;

      const guestItems: CartItem[] = JSON.parse(stored);
      if (!Array.isArray(guestItems) || guestItems.length === 0) {
        localStorage.removeItem(GUEST_CART_KEY);
        return;
      }

      // Send guest cart items to backend to save into MongoDB
      await userapiRequest('/user/api/v1/cart/sync', 'POST', {
        items: guestItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }))
      });

      // Clear guest cart from localStorage after successful database sync
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (err) {
      console.error('Guest cart sync error:', err);
    }
  }, []);

  // Load cart: either from backend (if logged in) or from localStorage (if guest)
  const refreshCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        // Guest user: Load cart from localStorage
        const stored = localStorage.getItem(GUEST_CART_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setItems(Array.isArray(parsed) ? parsed : []);
          } catch {
            setItems([]);
          }
        } else {
          setItems([]);
        }
        return;
      }

      // Logged in user: First sync any guest items saved before logging in
      await syncGuestCart();

      // Fetch user's cart from database
      const res: any = await userapiRequest('/user/api/v1/cart/get', 'GET');
      const carts = res.carts || [];

      setItems(
        carts.map((c: any) => ({
          _id: String(c._id),
          productId: String(c.productId),
          name: c.productName || '',
          brand: c.brand || '',
          image: c.productImage || '',
          price: c.price || 0,
          originalPrice: c.originalPrice || null,
          quantity: c.quantity || 1,
          size: c.size || '',
          color: c.color || '',
          shipping: c.shipping ?? true
        }))
      );
    } catch (error) {
      console.error('Cart load failed', error);
      // Fallback to guest cart if request fails
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems([]);
        }
      }
    }
  }, [syncGuestCart]);

  // When user logs in or auth state changes, sync guest cart & refresh
  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  // Add item
  const addItem = useCallback(
    async (item: Omit<CartItem, '_id' | 'quantity'>, quantity = 1) => {
      try {
        const token = localStorage.getItem('accessToken');

        if (token) {
          // User is logged in: save directly to MongoDB
          const res = await userapiRequest('/user/api/v1/cart/add', 'POST', {
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity
          });
          toast.success(res.message || 'Product added to cart');
          await refreshCart();
        } else {
          // User is NOT logged in: save in localStorage (guest cart)
          const stored = localStorage.getItem(GUEST_CART_KEY);
          let guestCart: CartItem[] = [];
          if (stored) {
            try {
              guestCart = JSON.parse(stored);
            } catch {
              guestCart = [];
            }
          }

          const existingIndex = guestCart.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );

          if (existingIndex > -1) {
            guestCart[existingIndex].quantity += quantity;
          } else {
            const newItem: CartItem = {
              ...item,
              _id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              quantity
            };
            guestCart.push(newItem);
          }

          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
          setItems([...guestCart]);
          toast.success('Product added to cart');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to add product to cart');
      }
    },
    [refreshCart]
  );

  // Remove item by cart _id
  const removeItem = useCallback(async (cartId: string) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (token && !cartId.startsWith('guest_')) {
        // Logged in: delete from database
        const res = await userapiRequest(`/user/api/v1/cart/delete/${cartId}`, 'DELETE');
        toast.warn(res.message || 'Item removed from cart');
        setItems((prev) => prev.filter((item) => item._id !== cartId));
      } else {
        // Guest user: delete from localStorage
        const stored = localStorage.getItem(GUEST_CART_KEY);
        if (stored) {
          try {
            const guestCart: CartItem[] = JSON.parse(stored);
            const updated = guestCart.filter((item) => item._id !== cartId);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
            setItems(updated);
          } catch {
            setItems((prev) => prev.filter((item) => item._id !== cartId));
          }
        } else {
          setItems((prev) => prev.filter((item) => item._id !== cartId));
        }
        toast.warn('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  }, []);

  // Update quantity
  const updateQuantity = useCallback(
    async (cartId: string, quantity: number) => {
      try {
        if (quantity <= 0) {
          await removeItem(cartId);
          return;
        }

        const token = localStorage.getItem('accessToken');

        if (token && !cartId.startsWith('guest_')) {
          // Logged in: update database
          await userapiRequest(`/user/api/v1/cart/update/${cartId}`, 'PATCH', { quantity });
          setItems((prev) =>
            prev.map((item) => (item._id === cartId ? { ...item, quantity } : item))
          );
        } else {
          // Guest user: update in localStorage
          const stored = localStorage.getItem(GUEST_CART_KEY);
          if (stored) {
            try {
              const guestCart: CartItem[] = JSON.parse(stored);
              const updated = guestCart.map((item) =>
                item._id === cartId ? { ...item, quantity } : item
              );
              localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
              setItems(updated);
            } catch {
              setItems((prev) =>
                prev.map((item) => (item._id === cartId ? { ...item, quantity } : item))
              );
            }
          } else {
            setItems((prev) =>
              prev.map((item) => (item._id === cartId ? { ...item, quantity } : item))
            );
          }
        }
      } catch (error) {
        console.error('Update quantity failed', error);
      }
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem(GUEST_CART_KEY);
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingCharge;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
        clearCart,
        itemCount,
        cartCount,
        subtotal,
        shipping,
        setShippingCharge,
        shippingInfo,
        setShippingInfo,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};