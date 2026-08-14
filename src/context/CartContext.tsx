import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';

import { userapiRequest } from '../services/apiService';
import { number } from 'framer-motion';

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
  addItem: (
    item: Omit<CartItem, '_id' | 'quantity'>,
    quantity?: number
  ) => Promise<void>;

  removeItem: (
    cartId: string
  ) => Promise<void>;

  updateQuantity: (
    cartId: string,
    quantity: number
  ) => Promise<void>;

  refreshCart: () => Promise<void>;

  clearCart: () => void;

  itemCount: number;
   cartCount: number;

  subtotal: number;
 shipping: number;
setShippingCharge: (amount: number) => void;
shippingInfo: {
  estimated_delivery_days?: string;
  courier_name?: string;
} | null;
setShippingInfo: (info: any) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [items, setItems] = useState<CartItem[]>([]);
const [shippingCharge, setShippingCharge] = useState(0);
const [shippingInfo, setShippingInfo] = useState<{
  estimated_delivery_days?: string;
  courier_name?: string;
} | null>(null);
  // Load cart from backend
  const refreshCart = useCallback(async () => {

    try {

      const token = localStorage.getItem('accessToken');

      if (!token) {
        setItems([]);
        return;
      }

      const res: any = await userapiRequest(
        '/user/api/v1/cart/get',
        'GET'
      );

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
      setItems([]);
    }

  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add item
  const addItem = useCallback(async (
    item: Omit<CartItem, '_id' | 'quantity'>,
    quantity = 1
  ) => {

    try {

      await userapiRequest(
        '/user/api/v1/cart/add',
        'POST',
        {
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity
        }
      );

      await refreshCart();

    } catch (error) {
      console.error('Add cart failed', error);
    }

  }, [refreshCart]);

  // Remove item by cart _id
  const removeItem = useCallback(async (cartId: string) => {

    try {

      await userapiRequest(
        `/user/api/v1/cart/delete/${cartId}`,
        'DELETE'
      );

      setItems(prev =>
        prev.filter(item => item._id !== cartId)
      );

    } catch (error) {
      console.error('Remove cart failed', error);
    }

  }, []);

  // Update quantity
  const updateQuantity = useCallback(async (
    cartId: string,
    quantity: number
  ) => {

    try {

      if (quantity <= 0) {
        await removeItem(cartId);
        return;
      }

      await userapiRequest(
        `/user/api/v1/cart/update/${cartId}`,
        'PATCH',
        { quantity }
      );

      setItems(prev =>
        prev.map(item =>
          item._id === cartId
            ? { ...item, quantity }
            : item
        )
      );

    } catch (error) {
      console.error('Update quantity failed', error);
    }

  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartCount = items.length

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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