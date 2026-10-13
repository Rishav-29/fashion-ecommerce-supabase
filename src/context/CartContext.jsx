import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productId, size) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.productId === productId && item.size === size);
      if (existingItemIndex >= 0) {
        // Increment quantity if same product and size
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        // Add new item
        return [...prev, { id: `${productId}-${size}`, productId, size, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
