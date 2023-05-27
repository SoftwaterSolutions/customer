import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countryList: [],
};

export const externalSlice = createSlice({
  name: 'external',
  initialState,
  reducers: {
    setCountryList: (state, { payload }) => {
      state.countryList = payload;
    },
  },
});

export const { setCountryList } = externalSlice.actions;

export default externalSlice.reducer;
