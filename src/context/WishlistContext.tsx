import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';

import { userapiRequest } from '../services/apiService';

export interface WishlistItem {
  _id: string;
  productId: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  count: number;
  clear: () => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from backend
  const refreshWishlist = useCallback(async () => {
    try {

      const token = localStorage.getItem('accessToken');

      if (!token) {
        setItems([]);
        return;
      }

      const res: any = await userapiRequest(
        '/user/api/v1/wishlist/get',
        'GET'
      );

      

      setItems(res.wishlists || []);

    } catch (error) {

      console.error('Wishlist load failed', error);
      setItems([]);
    }

  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Add / Remove wishlist
  const toggle = useCallback(async (productId: string) => {

    try {

      const res: any = await userapiRequest(
        '/user/api/v1/wishlist/add',
        'POST',
        { productId }
      );


      if (res.action === 'added' && res.wishlist) {

        setItems(prev => [
          ...prev,
          {
            _id: res.wishlist._id,
            productId: res.wishlist.productId
          }
        ]);

      } else if (res.action === 'removed') {

        setItems(prev =>
          prev.filter(item => item._id !== res.wishlistId)
        );
      }

    } catch (error) {

      console.error('Wishlist toggle failed', error);
    }

  }, []);

  

  const has = useCallback(
    (productId: string) =>
      items.some(item => item.productId === productId),
    [items]
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggle,
        has,
        count: items.length,
        clear,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {

  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return ctx;
};