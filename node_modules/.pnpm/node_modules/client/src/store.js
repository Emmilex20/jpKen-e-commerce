// apps/client/src/store.js - TEMPORARY WORKAROUND (if absolutely nothing else works)
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
// import { ordersApiSlice } from './slices/ordersApiSlice'; // Comment out or remove if this is the cause

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    // [ordersApiSlice.reducerPath]: ordersApiSlice.reducer, // Comment out or remove
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware
      // ordersApiSlice.middleware // <--- Temporarily remove if this is the only way to proceed
    ),
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',
});
export default store;