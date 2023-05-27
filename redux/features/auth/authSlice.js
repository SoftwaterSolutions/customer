import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  token: '',
  countries: [],
  country: null,
  area: null,
};

export const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    saveUser: (state, { payload }) => {
      state.user = payload;
    },
    saveToken: (state, { payload }) => {
      state.token = payload;
    },
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },
    saveCountries: (state, { payload }) => {
      state.countries = payload;
    },
    saveArea: (state, { payload }) => {
      state.area = payload;
    },
    saveCountry: (state, { payload }) => {
      state.country = payload;
    },
    clearUser: (state) => {
      state.user = {};
    },
    clearToken: (state) => {
      state.token = {};
    },
    logout: (state) => {
      state.token = '';
      state.user = {};
      state.area = null;
      state.market = null;
      state.country = null;
    },
  },
});

export const {
  saveUser,
  clearUser,
  saveToken,
  saveCountries,
  saveArea,
  saveCountry,
  clearToken,
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
