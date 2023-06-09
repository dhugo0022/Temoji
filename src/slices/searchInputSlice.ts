import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const searchInputSlice = createSlice({
  name: "searchInput",
  initialState: {
    value: ""
  },
  reducers: {
    setSearchInput(state, action: PayloadAction<string>) {
      state.value = action.payload;
    }
  }
});

export const {
  setSearchInput
} = searchInputSlice.actions;

export const {
  reducer: searchInputReducer
} = searchInputSlice;