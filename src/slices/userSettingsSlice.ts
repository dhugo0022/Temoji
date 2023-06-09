import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { initAppSettings, Theme } from "../settings";

export type UserSettingsType = {
  theme: Theme;
  shortcut: string;
};

const defaultUserSettings = await initAppSettings();

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState: {
    value: defaultUserSettings
  },
  reducers: {
    setSettings: (state, action: PayloadAction<UserSettingsType>) => {
      state.value = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.value.theme = action.payload;
    },
    setShortcut: (state, action: PayloadAction<string>) => {
      state.value.shortcut = action.payload;
    }
  }
});

export const {
  setSettings,
  setTheme,
  setShortcut
} = userSettingsSlice.actions;

export const {
  reducer: userSettingsReducer
} = userSettingsSlice;