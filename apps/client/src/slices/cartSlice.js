// apps/client/src/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils'; // We will create this utility soon

// Initialize cart state from localStorage if available, otherwise an empty object
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' }; // Add initial state for checkout

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reducer to add an item to the cart
    addToCart: (state, action) => {
      const item = action.payload;

      // Check if the item already exists in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If it exists, update its quantity
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // If it's a new item, add it to the cartItems array
        state.cartItems = [...state.cartItems, item];
      }

      // Call a utility function to calculate totals and save to localStorage
      return updateCart(state);
    },
    // Reducer to remove an item from the cart
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    // Reducer to save shipping address
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    // Reducer to save payment method
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    // Reducer to clear cart items (used after successful order placement)
    // eslint-disable-next-line no-unused-vars
    clearCartItems: (state, action) => {
      state.cartItems = [];
      // Also clear from localStorage
      localStorage.removeItem('cart');
      // Optionally, you might want to recalculate totals after clearing
      // return updateCart(state); // Or simply return state without recalculating
    },
    // NOTE: For clearing specific items, use removeFromCart. This is for a full cart clear.
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;