import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant?: ProductVariant }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.product.id === action.product.id && 
        item.selectedVariant?.id === action.variant?.id
      );
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.product.id && item.selectedVariant?.id === action.variant?.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return sum + price * item.quantity;
        }, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { items: updatedItems, total, itemCount };
      } else {
        const newItems = [...state.items, { product: action.product, quantity: 1, selectedVariant: action.variant }];
        const total = newItems.reduce((sum, item) => {
          const price = item.selectedVariant?.price || item.product.price;
          return sum + price * item.quantity;
        }, 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { items: newItems, total, itemCount };
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id.toString() !== action.productId);
      const total = newItems.reduce((sum, item) => {
        const price = item.selectedVariant?.price || item.product.price;
        return sum + price * item.quantity;
      }, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id.toString() === action.productId
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = updatedItems.reduce((sum, item) => {
        const price = item.selectedVariant?.price || item.product.price;
        return sum + price * item.quantity;
      }, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: updatedItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
      
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (product: Product, variant?: ProductVariant) => {
    dispatch({ type: 'ADD_ITEM', product, variant });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};