'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types';

export interface CartItem {
  cartItemId: string; // unique id per cart entry (product + variant + custom text)
  productId: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  customizationDetails?: Record<string, string>;
  unitPrice: number;
  originalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant,
    customizationDetails?: Record<string, string>
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const freeShippingThreshold = 1000;
  const defaultShippingFee = 70;

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('moonshine_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse saved cart:', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('moonshine_cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: ProductVariant,
    customizationDetails?: Record<string, string>
  ) => {
    const unitPrice = variant ? (variant.salePrice || variant.price) : (product.salePrice || product.price);
    const originalPrice = variant ? variant.price : product.price;

    const cartItemId = `${product.id}_${variant ? variant.id : 'default'}_${JSON.stringify(customizationDetails || {})}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            product,
            variant,
            quantity,
            customizationDetails,
            unitPrice,
            originalPrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const discountTotal = cart.reduce((sum, item) => {
    const savingsPerUnit = Math.max(0, item.originalPrice - item.unitPrice);
    return sum + savingsPerUnit * item.quantity;
  }, 0);

  const shippingFee = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : defaultShippingFee;

  const total = subtotal + shippingFee;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountTotal,
        shippingFee,
        total,
        freeShippingThreshold,
        remainingForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
