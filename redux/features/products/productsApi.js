import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../url';
import customFetchBase from '../customFetchBaseQuery';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: customFetchBase,

  endpoints: builder => ({
    getUOM: builder.mutation({
      query: () => ({
        url: 'business-domain/uom',
        method: 'GET',
      }),
    }),
    getBusinessProducts: builder.mutation({
      query: businessId => ({
        url: `business-domain/businesses/${businessId}/products`,
        method: 'GET',
      }),
    }),
    getBusinessInventories: builder.mutation({
      query: businessId => ({
        url: `business-domain/businesses/${businessId}/inventories`,
        method: 'GET',
      }),
    }),
    fetchBusinessProducts: builder.query({
      query: businessId => ({
        url: `business-domain/businesses/${businessId}/products`,
        method: 'GET',
      }),
    }),
    fetchBusinessInventories: builder.query({
      query: businessId => ({
        url: `business-domain/businesses/${businessId}/inventories`,
        method: 'GET',
      }),
    }),
    createBusinessProducts: builder.mutation({
      query: ({data, businessId}) => ({
        url: `business-domain/businesses/${businessId}/products`,
        method: 'POST',
        body: data,
      }),
    }),
    updateBusinessProducts: builder.mutation({
      query: ({data, productId}) => ({
        url: `business-domain/products/${productId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    archiveProduct: builder.mutation({
      query: ({productId, bool}) => ({
        url: `business-domain/products/${productId}/archive`,
        method: 'PATCH',
        body: {archive: bool},
      }),
    }),
    fetchDepots: builder.query({
      query: () => ({
        url: 'depot-domain/depots',
        method: 'GET',
      }),
    }),
    getDepots: builder.mutation({
      query: () => ({
        url: 'depot-domain/depots',
        method: 'GET',
      }),
    }),
    checkPickupStatus: builder.mutation({
      query: ({latitude, longitude}) => ({
        url: 'depot-domain/locations/pickup-status',
        method: 'POST',
        body: {latitude, longitude},
      }),
    }),
    sendProductsToDepot: builder.mutation({
      query: ({businessId, dropOffMethod, products}) => ({
        url: `business-domain/businesses/${businessId}/depot-products`,
        method: 'POST',
        body: {dropOffMethod, products},
      }),
    }),
    createBusinessCustomer: builder.mutation({
      query: ({businessId, data}) => ({
        url: `business-domain/businesses/${businessId}/customers`,
        method: 'POST',
        body: data,
      }),
    }),
    updateBusinessCustomer: builder.mutation({
      query: ({customerId, data}) => ({
        url: `business-domain/customers/${customerId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteBusinessCustomer: builder.mutation({
      query: ({customerId}) => ({
        url: `business-domain/customers/${customerId}`,
        method: 'DELETE',
      }),
    }),
    fetchBusinessCustomer: builder.query({
      query: ({businessId}) => ({
        url: `business-domain/businesses/${businessId}/customers`,
      }),
    }),
    createOutlet: builder.mutation({
      query: ({businessId, data}) => ({
        url: `business-domain/businesses/${businessId}/outlets`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOutlet: builder.mutation({
      query: ({outletId, data}) => ({
        url: `business-domain/outlets/${outletId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteOutlet: builder.mutation({
      query: ({outletId}) => ({
        url: `business-domain/outlets/${outletId}`,
        method: 'DELETE',
      }),
    }),
    fetchOutlet: builder.query({
      query: ({businessId}) => ({
        url: `business-domain/businesses/${businessId}/outlets`,
      }),
    }),
  }),
});

export const {
  useGetUOMMutation,
  useGetBusinessProductsMutation,
  useCreateBusinessProductsMutation,
  useUpdateBusinessProductsMutation,
  useArchiveProductMutation,
  useFetchBusinessProductsQuery,
  useFetchDepotsQuery,
  useGetDepotsMutation,
  useCheckPickupStatusMutation,
  useSendProductsToDepotMutation,
  useFetchBusinessInventoriesQuery,
  useGetBusinessInventoriesMutation,
  useCreateBusinessCustomerMutation,
  useFetchBusinessCustomerQuery,
  useUpdateBusinessCustomerMutation,
  useDeleteBusinessCustomerMutation,
  useCreateOutletMutation,
  useFetchOutletQuery,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = productsApi;
