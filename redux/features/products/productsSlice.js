import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProducts: [],
  selectedDepot: [],
  selectedProd: [],
  pickupMode: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    saveProductsList: (state, {payload}) => {
      state.products = payload;
    },
    saveSelectedProducts: (state, {payload}) => {
      state.selectedProducts = payload;
    },
    saveSelectedDepot: (state, {payload}) => {
      state.selectedDepot = payload;
    },
    saveSelectedProd: (state, {payload}) => {
      state.selectedProd = payload;
    },
    savePickupMode: (state, {payload}) => {
      state.pickupMode = payload;
    },
    clearProductsList: state => {
      state.products = null;
    },
    clearSelectedProducts: state => {
      state.selectedProducts = null;
    },
  },
});

export const {
  saveProductsList,
  clearProductsList,
  saveSelectedProducts,
  clearSelectedProducts,
  saveSelectedDepot,
  saveSelectedProd,
  savePickupMode,
} = productsSlice.actions;

export default productsSlice.reducer;
