import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chosenGroupSlice = createSlice({
  name: "chosenGroup",
  initialState: {
    value: ""
  },
  reducers: {
    setChosenGroup(state, action: PayloadAction<string>) {
      state.value = action.payload;
    }
  }
});

export const {
  setChosenGroup
} = chosenGroupSlice.actions;

export const {
  reducer: chosenGroupReducer
} = chosenGroupSlice;