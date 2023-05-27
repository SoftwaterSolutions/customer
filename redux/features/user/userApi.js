import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import customFetchBase from '../customFetchBaseQuery';
import { BASE_URL } from '../url';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: 'customers/logout',
          method: 'GET',
        };
      },
    }),
    getUser: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ id, data }) => ({
        url: `customers/update-password/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getAllAreas: builder.mutation({
      query: (params) => ({
        url: `areas/all`,
        method: 'GET',
        params: params,
      }),
    }),
    getAreas: builder.mutation({
      query: (params) => ({
        url: `areas`,
        method: 'GET',
        params: params,
      }),
    }),
    getArea: builder.mutation({
      query: (id) => ({
        url: `areas/${id}`,
        method: 'GET',
      }),
    }),
    getCategories: builder.mutation({
      query: (params) => ({
        url: `categories`,
        method: 'GET',
        params: params,
      }),
    }),
    getCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'GET',
      }),
    }),
    getProducts: builder.mutation({
      query: (params) => ({
        url: `products`,
        method: 'GET',
        params: params,
      }),
    }),
    getProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'GET',
      }),
    }),
    getMarkets: builder.mutation({
      query: (params) => ({
        url: `markets`,
        method: 'GET',
        params: params,
      }),
    }),
    getMarket: builder.mutation({
      query: (id) => ({
        url: `markets/${id}`,
        method: 'GET',
      }),
    }),
    getCountries: builder.mutation({
      query: (params) => ({
        url: `countries`,
        method: 'GET',
        params: params,
      }),
    }),
    getCountry: builder.mutation({
      query: (id) => ({
        url: `countries/${id}`,
        method: 'GET',
      }),
    }),
    getUoms: builder.mutation({
      query: (params) => ({
        url: `uoms`,
        method: 'GET',
        params: params,
      }),
    }),
    getUom: builder.mutation({
      query: (id) => ({
        url: `uoms/${id}`,
        method: 'GET',
      }),
    }),
    getDeliveryAddresses: builder.mutation({
      query: (params) => ({
        url: `delivery-addresses`,
        method: 'GET',
        params: params,
      }),
    }),
    updateDeliveryAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `delivery-addresses/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getDeliveryAddress: builder.mutation({
      query: (id) => ({
        url: `delivery-addresses/${id}`,
        method: 'GET',
      }),
    }),
    deleteDeliveryAddress: builder.mutation({
      query: (id) => ({
        url: `delivery-addresses/${id}`,
        method: 'DELETE',
      }),
    }),
    createDeliveryAddress: builder.mutation({
      query: (data) => ({
        url: `delivery-addresses`,
        method: 'POST',
        body: data,
      }),
    }),
    getPaymentMethods: builder.mutation({
      query: (params) => ({
        url: `payment-methods`,
        method: 'GET',
        params: params,
      }),
    }),
    getPaymentMethod: builder.mutation({
      query: (id) => ({
        url: `payment-methods/${id}`,
        method: 'GET',
      }),
    }),
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `payment-methods/${id}`,
        method: 'DELETE',
      }),
    }),
    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `payment-methods`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePaymentMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `payment-methods/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getPriceByMarkets: builder.mutation({
      query: (params) => ({
        url: `price-by-markets`,
        method: 'GET',
        params: params,
      }),
    }),
    getPriceByMarket: builder.mutation({
      query: (id) => ({
        url: `price-by-markets/${id}`,
        method: 'GET',
      }),
    }),
    getSavedItems: builder.mutation({
      query: ({ area_id, country_id }) => ({
        url: `saved-items`,
        method: 'GET',
        params: { area_id, country_id },
      }),
    }),
    addToSavedItems: builder.mutation({
      query: (data) => ({
        url: `saved-items`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteSavedItem: builder.mutation({
      query: (data) => ({
        url: `saved-items`,
        method: 'DELETE',
        body: data,
      }),
    }),
    getCart: builder.mutation({
      query: ({ area_id, country_id }) => ({
        url: `cart`,
        method: 'GET',
        params: { area_id, country_id },
      }),
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: `cart`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCartItemQuantity: builder.mutation({
      query: (data) => ({
        url: `cart/quantity`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteCartItem: builder.mutation({
      query: (data) => ({
        url: `cart`,
        method: 'DELETE',
        body: data,
      }),
    }),
    validateCheckout: builder.mutation({
      query: (data) => ({
        url: `orders/validate-checkout`,
        method: 'POST',
        body: data,
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `orders/checkout`,
        method: 'POST',
        body: data,
      }),
    }),
    getUserOrders: builder.mutation({
      query: () => ({
        url: `orders`,
        method: 'GET',
      }),
    }),
    getUserOrder: builder.mutation({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'GET',
      }),
    }),
    verifyPaystackPayment: builder.mutation({
      query: (reference) => ({
        url: `paystack/verify/${reference}`,
        method: 'GET',
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: 'stripe/intent',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLogoutUserMutation,
  useGetUserMutation,
  useUpdateUserMutation,
  useGetAllAreasMutation,
  useGetAreasMutation,
  useGetAreaMutation,
  useGetMarketsMutation,
  useGetMarketMutation,
  useGetCountriesMutation,
  useGetCountryMutation,
  useGetPriceByMarketMutation,
  useGetUomsMutation,
  useGetUomMutation,
  useGetProductsMutation,
  useGetProductMutation,
  useGetCategoriesMutation,
  useGetCategoryMutation,
  useGetCartMutation,
  useAddToCartMutation,
  useDeleteCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useGetSavedItemsMutation,
  useAddToSavedItemsMutation,
  useDeleteSavedItemMutation,
  useUpdatePasswordMutation,
  useGetDeliveryAddressesMutation,
  useGetDeliveryAddressMutation,
  useCreateDeliveryAddressMutation,
  useUpdateDeliveryAddressMutation,
  useDeleteDeliveryAddressMutation,
  useGetPaymentMethodsMutation,
  useGetPaymentMethodMutation,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useValidateCheckoutMutation,
  useCreateOrderMutation,
  useGetUserOrdersMutation,
  useGetUserOrderMutation,
  useVerifyPaystackPaymentMutation,
  useCreatePaymentIntentMutation,
} = userApi;
