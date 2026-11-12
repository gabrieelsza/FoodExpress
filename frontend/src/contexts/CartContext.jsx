import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { calculateItemPrice } from '../utils/helpers';

const CartContext = createContext(null);

const STORAGE_KEY = 'foodexpress_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variation, addons, notes, quantity } = action.payload;
      const unitPrice = calculateItemPrice(product, variation, addons);

      // Check if identical item already exists in cart
      const existingIndex = state.findIndex(
        (item) =>
          item.productId === product.id &&
          item.variationId === (variation?.id || null) &&
          JSON.stringify(item.addonIds) ===
            JSON.stringify(addons.map((a) => a.id).sort()) &&
          item.notes === notes
      );

      if (existingIndex >= 0) {
        newState = state.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          cartItemId: Date.now() + Math.random(),
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          variationId: variation?.id || null,
          variationName: variation?.name || null,
          addonIds: addons.map((a) => a.id).sort(),
          addonsDetail: addons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
          notes: notes || '',
          quantity,
          unitPrice,
        };
        newState = [...state, newItem];
      }
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter((item) => item.cartItemId !== cartItemId);
      } else {
        newState = state.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        );
      }
      break;
    }

    case 'REMOVE_ITEM': {
      newState = state.filter((item) => item.cartItemId !== action.payload);
      break;
    }

    case 'CLEAR': {
      newState = [];
      break;
    }

    default:
      return state;
  }

  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart);

  const addItem = useCallback((product, variation, addons, notes, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variation, addons, notes, quantity } });
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  }, []);

  const removeItem = useCallback((cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
