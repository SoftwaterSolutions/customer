import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../url';

export const externalApi = createApi({
  reducerPath: 'externalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://',
  }),

  endpoints: (builder) => ({
    getRestCountries: builder.mutation({
      query: () => ({
        url: 'restcountries.com/v3.1/all?fields=name,flags,idd,cca2',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetRestCountriesMutation } = externalApi;
