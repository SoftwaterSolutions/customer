import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  products: [],
  areas: [],
  uoms: [],
  uomsFilter: [],
  brandsFilter: [],
  markets: [],
  sortFilter: '',
  paymentMethods: [],
};

export const userSlice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    saveToUserStore: (state, { payload }) => {
      state[payload?.key] = payload.value;
    },
  },
});

export const { saveToUserStore } = userSlice.actions;

export default userSlice.reducer;
