// apps/client/src/slices/usersApiSlice.js
import { apiSlice } from './apiSlice'; // Import the base apiSlice
import { USERS_URL } from '../constants'; // Assuming you have USERS_URL in constants.js

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all users (for Admin User List)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'], // Tag for caching and invalidation
      keepUnusedDataFor: 5, // Keep data for 5 seconds even if no component is using it
    }),

    // Mutation to delete a user (for Admin User List)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'], // Invalidate 'User' tag to refetch all users after deletion
    }),

    // Query to get details of a single user (for Admin User Edit Page)
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }], // Specific tag for this user's details
    }),

    // Mutation to update a user (for Admin User Edit Page)
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg }], // Invalidate specific user's cache
    }),
  }),
});

// Export the generated hooks
export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApiSlice;