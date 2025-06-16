// apps/client/src/slices/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { BASE_URL } from '../constants'; // You can remove this import if BASE_URL isn't used elsewhere

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL; // This correctly gets the env var

// Define the base query for all API calls
const baseQuery = fetchBaseQuery({
    baseUrl: backendBaseUrl, // <--- CHANGE THIS LINE TO USE backendBaseUrl
    credentials: 'include',
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