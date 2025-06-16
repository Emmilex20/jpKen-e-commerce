// apps/client/src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get user info from localStorage if it exists, otherwise null
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage, // Set initial state from localStorage
};

const authSlice = createSlice({
  name: 'auth', // Name of the slice
  initialState,
  reducers: {
    // Action to set user credentials upon login/registration
    setCredentials: (state, action) => {
      state.userInfo = action.payload; // Store user info in Redux state
      localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store in localStorage
    },
    // Action to clear user credentials upon logout
    // eslint-disable-next-line no-unused-vars
    logout: (state, action) => {
      state.userInfo = null; // Clear user info from Redux state
      localStorage.removeItem('userInfo'); // Remove from localStorage

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