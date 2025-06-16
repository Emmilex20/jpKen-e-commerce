// apps/client/src/slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// This correctly gets the env var (e.g., VITE_BACKEND_URL=https://your-api.onrender.com)
const backendBaseUrl = import.meta.env.VITE_BACKEND_URL;

// Define the base query for all API calls
const baseQuery = fetchBaseQuery({
  baseUrl: backendBaseUrl,
  // Removed `credentials: 'include'` as cookies are no longer used for JWT auth.
  // Keep it only if you have other, non-JWT related cookies that need to be sent cross-origin.
  // For most cases with token in localStorage, it's not needed.
  // credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth slice state
    const token = getState().auth.token;
    if (token) {
      // Set the Authorization header with the Bearer token
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create the main API slice using createApi
export const apiSlice = createApi({
  baseQuery, // Use the base query defined above
  tagTypes: ['Product', 'Order', 'User'], // Define common tag types for caching
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({
    // You will add your specific endpoints (like products, users, orders) here later
    // Other slices (e.g., productApiSlice, authApiSlice) will "inject" their endpoints here
  }),
});

// We don't export any hooks from here directly, as other slices will inject them.
// However, createApi returns the slice itself, which is what we export.