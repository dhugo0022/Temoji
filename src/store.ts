import { configureStore } from "@reduxjs/toolkit";

import { userSettingsReducer } from "./slices/userSettingsSlice";
import { searchInputReducer } from "./slices/searchInputSlice";
import { chosenGroupReducer } from "./slices/chosenGroupSlice";
import { emojiPreferencesReducer } from "./slices/emojiPreferencesSlice";

export const store = configureStore({
  reducer: {
    userSettings: userSettingsReducer,
    searchInput: searchInputReducer,
    chosenGroup: chosenGroupReducer,
    emojiPreferences: emojiPreferencesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;