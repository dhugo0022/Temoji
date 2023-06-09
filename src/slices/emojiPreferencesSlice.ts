import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BaseEmoji } from "unicode-emoji";
import { initAppEmojiPreferences } from "../settings";

export type EmojiPreferencesType = {
  [key: string]: string;
};

type EmojiPreferencePayload = {
  emoji: BaseEmoji,
  preference: string;
};

const defaultEmojiPreferences = await initAppEmojiPreferences();

const emojiPreferencesSlice = createSlice({
  name: "emojiPreferences",
  initialState: {
    value: defaultEmojiPreferences
  },
  reducers: {
    setEmojiPreference: (state, emojiPreference: PayloadAction<EmojiPreferencePayload>) => {
      state.value[emojiPreference.payload.emoji.description] = emojiPreference.payload.preference;
    },
    removeEmojiPreference: (state, emojiDescription: PayloadAction<string>) => {
      delete state.value[emojiDescription.payload];
    }
  }
});

export const {
  setEmojiPreference,
  removeEmojiPreference
} = emojiPreferencesSlice.actions;

export const {
  reducer: emojiPreferencesReducer
} = emojiPreferencesSlice;