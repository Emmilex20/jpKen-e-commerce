// apps/client/src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get user info and token from localStorage if they exist, otherwise null
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const tokenFromStorage = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null;

const initialState = {
  userInfo: userInfoFromStorage, // Set initial user info from localStorage
  token: tokenFromStorage,       // Set initial token from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set user credentials upon login/registration
    setCredentials: (state, action) => {
      state.userInfo = action.payload; // Store user info in Redux state
      state.token = action.payload.token; // Store token in Redux state (assuming payload contains .token)
      localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store user info in localStorage
      localStorage.setItem('token', action.payload.token); // Store token separately in localStorage
    },
    // Action to clear user credentials upon logout
    logout: (state) => {
      state.userInfo = null; // Clear user info from Redux state
      state.token = null;       // Clear token from Redux state
      localStorage.removeItem('userInfo'); // Remove user info from localStorage
      localStorage.removeItem('token');    // Remove token from localStorage

      // ⭐ OPTIONAL BUT RECOMMENDED: Clear cart items from localStorage on logout
      //    (assuming your cart items are stored under 'cartItems' in localStorage)
      localStorage.removeItem('cartItems');
      // You might also remove other user-specific data here if applicable
    },
  },
});

// Export the actions
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;