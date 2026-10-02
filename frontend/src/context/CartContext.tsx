'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vikrshi_order_list_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed reading cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed writing cart to localStorage', e);
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock || product.availabilityStatus === 'out_of_stock') {
      toast.error(`${product.name} is currently out of stock`);
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity }];
    });

    toast.success(`Added ${product.name} to order list`, {
      description: `${quantity} ${product.unit} ready for WhatsApp dispatch`,
      action: {
        label: 'View Order',
        onClick: () => setIsOpen(true),
      },
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.product.id === productId);
      if (removed) {
        toast.info(`Removed ${removed.product.name} from order list`);
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
