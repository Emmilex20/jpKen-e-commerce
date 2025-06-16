// apps/client/src/context/CartContext.jsx
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';

const CartContext = createContext();

// Define initial state for cart items
const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : '',
};

// Reducer for cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // eslint-disable-next-line no-case-declarations
      const item = action.payload;
      // eslint-disable-next-line no-case-declarations
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'CART_SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case 'CART_CLEAR_ITEMS':
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
    localStorage.setItem('paymentMethod', state.paymentMethod);
  }, [state.cartItems, state.shippingAddress, state.paymentMethod]);

  const addToCart = (product, qty) => {
    dispatch({ type: 'CART_ADD_ITEM', payload: { product, qty } });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: id });
  };

  const saveShippingAddress = (data) => {
    dispatch({ type: 'CART_SAVE_SHIPPING_ADDRESS', payload: data });
  };

  const savePaymentMethod = (data) => {
    dispatch({ type: 'CART_SAVE_PAYMENT_METHOD', payload: data });
  };

  const clearCartItems = () => {
    dispatch({ type: 'CART_CLEAR_ITEMS' });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);