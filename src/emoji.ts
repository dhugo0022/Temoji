import * as unicodeEmoji from "unicode-emoji";
import { writeText } from "@tauri-apps/api/clipboard";
import { message } from "@tauri-apps/api/dialog";

// Writes some text to the clipboard
export const copyEmojiToClipboard = async (text: string) => {
  try {
    await writeText(text);
    await message("Emoji copied to clipboard", "Temoji")
  } catch (err) {
    await message("Failed to copy emoji to clipboard: " + err, {
      title: "Temoji",
      type: "error"
    })
  }
};

export const emojis = unicodeEmoji.getEmojis();

export const emojiGroup = {
  "smileys-emotion": "🙂",
  "people-body": "👋",
  "animals-nature": "🐹",
  "food-drink": "🍔",
  "travel-places": "✈️",
  activities: "⚽",
  objects: "💡",
  symbols: "🈸",
  flags: "🇧🇷"
};

export const skinTone = {
  unset: "👋",
  light: "👋🏻",
  "medium-light": "👋🏼",
  medium: "👋🏽",
  "medium-dark": "👋🏾",
  dark: "👋🏿"
};

const capitalize = (str: string) => {
  return str.at(0)?.toUpperCase().concat(str.slice(1));
};

//https://stackoverflow.com/a/40331823
interface PrettifyFilter {
  delimiter?: string;
  separator?: string;
}

const defaultPrettifyFilter = {
  delimiter: "-",
  separator: " & "
};

export const prettifyName = (raw: string, filter: PrettifyFilter = {}) => {
  const filledFilter = { ...defaultPrettifyFilter, ...filter };
  const { delimiter, separator } = filledFilter;
  if (raw.indexOf(delimiter) > -1) {
    const names = raw.split(delimiter).map(capitalize);
    return names.join(separator);
  } else {
    return capitalize(raw);
  }
};