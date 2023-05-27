import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../features/url';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),

  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (data) => ({
        url: 'customers/signup',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: 'customers/verify',
        method: 'POST',
        body: data,
      }),
    }),
    verifyToken: builder.mutation({
      query: (data) => ({
        url: 'customers/verify-token',
        method: 'POST',
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => {
        return {
          url: 'customers/signin',
          method: 'POST',
          body: data,
        };
      },
    }),
    logoutUser: builder.mutation({
      query: (data) => {
        return {
          url: 'customers/log-out',
          method: 'POST',
          body: data,
        };
      },
    }),
    googleSignin: builder.mutation({
      query: (data) => {
        return {
          url: 'customers/signin/google',
          method: 'POST',
          body: data,
        };
      },
    }),
    forgotPasswordByEmail: builder.mutation({
      query: (data) => ({
        url: 'customers/forgot-password/email',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPasswordByPhone: builder.mutation({
      query: (data) => ({
        url: 'customers/forgot-password/phone',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: 'customers/reset-password',
        method: 'PATCH',
        body: data,
      }),
    }),
    getCountries: builder.mutation({
      query: (params) => ({
        url: 'countries',
        method: 'GET',
        params: params,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useVerifyOtpMutation,
  useVerifyTokenMutation,
  useForgotPasswordByEmailMutation,
  useForgotPasswordByPhoneMutation,
  useResetPasswordMutation,
  useGetCountriesMutation,
  useGoogleSigninMutation,
  useLogoutUserMutation,
} = authApi;
