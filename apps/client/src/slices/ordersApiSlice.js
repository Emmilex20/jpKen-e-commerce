// apps/client/src/slices/ordersApiSlice.js

import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL, PAYSTACK_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
  // ADDED: Define tagTypes at the top level for cache invalidation
  tagTypes: ['Order'], // You might also add 'Product', 'User' if you have those types

  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
      // ADDED: Invalidate 'Order' tag after creating a new order
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
      // ADDED: Provide 'Order' tag for a single order
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    payOrder: builder.mutation({ // Used for PayPal
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      // ADDED: Invalidate 'Order' tag after paying an order
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      // ADDED: Invalidate 'Order' tag after delivering an order
      invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
      // ADDED: Provide 'Order' tag for the list of orders
      providesTags: ['Order'],
    }),
    // This is the endpoint definition
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
      // ADDED: Provide 'Order' tag for 'my orders' list
      providesTags: ['Order'],
    }),
    markOrderPaidManually: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-manually`,
        method: 'PUT',
      }),
      // ADDED: Invalidate 'Order' tag after manually marking an order as paid
      invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    initializePaystackPayment: builder.mutation({
      query: ({ orderId, amount, email }) => ({
        url: `${ORDERS_URL}/${orderId}/paystack/initialize`,
        method: 'POST',
        body: { amount, email },
      }),
      // ADDED: Invalidate 'Order' tag after initializing Paystack payment
      // IMPORTANT: The actual payment confirmation comes from the webhook.
      // This invalidation is for when the payment process *starts*, but the webhook
      // will be the ultimate source of truth for 'isPaid'.
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }],
    }),
    // --- NEW CANCEL ORDER MUTATION ---
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),
    // --- END NEW CANCEL ORDER MUTATION ---
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useMarkOrderPaidManuallyMutation,
  useInitializePaystackPaymentMutation,
  useCancelOrderMutation, // NEWLY EXPORTED HOOK
} = ordersApiSlice;