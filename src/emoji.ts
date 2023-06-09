import { writeText } from "@tauri-apps/api/clipboard";
import { message } from "@tauri-apps/api/dialog";
import { BaseEmoji, getEmojis } from "unicode-emoji";

/**
 * Copies the given emoji to the clipboard.
 * @param emoji the emoji that is going to copied to the clipboard
 */
export const copyEmojiToClipboard = async (emoji: string) => {
  try {
    await writeText(emoji);
    await message(`Emoji ${emoji} copied to clipboard`, "Temoji");
  } catch (err) {
    await message("Failed to copy emoji to clipboard: " + err, {
      title: "Temoji",
      type: "error"
    });
  }
};

export const emojiGroupList = {
  "smileys-emotion": "🙂",
  "people-body": "👋",
  "animals-nature": "🐹",
  "food-drink": "🍔",
  "travel-places": "✈️",
  activities: "⚽",
  objects: "💡",
  symbols: "🈸",
  flags: "🇧🇷"
} as const;

export type EmojiGroupType = keyof typeof emojiGroupList;

export const skinToneList = {
  unset: "👋",
  light: "👋🏻",
  "medium-light": "👋🏼",
  medium: "👋🏽",
  "medium-dark": "👋🏾",
  dark: "👋🏿"
} as const;

export type SkinToneType = keyof typeof skinToneList;

const capitalize = (str: string) => {
  return str.at(0)?.toUpperCase().concat(str.slice(1))!;
};

//https://stackoverflow.com/a/40331823
interface PrettifyFilter {
  delimiter: string;
  separator: string;
}

const defaultPrettifyFilter: PrettifyFilter = {
  delimiter: "-",
  separator: " & "
};

/**
 * Prettifies the given string based on arbitrary
 * prettifying rules.
 * @param raw the raw string that is going to be prettified
 * @param filter the replacement filter
 * @returns the prittified string
 */
export const prettifyName = (raw: string, filter: PrettifyFilter = defaultPrettifyFilter): string => {
  const { delimiter, separator } = filter;
  if (raw.indexOf(delimiter) > -1) {
    const names = raw.split(delimiter).map(capitalize);
    return names.join(separator);
  } else {
    return capitalize(raw);
  }
};


/**
 * Sanitizes a country flag emoji description by allowing
 * only the country's name to pass as a desription.
 * @param countryFlagEmoji the country flag emoji reference
 * @returns the sanitized country flag emoji
 */
const sanitizeCountryFlagEmoji = (countryFlagEmoji: BaseEmoji) => {
  const description = countryFlagEmoji.description;
  if (description && description.indexOf("flag: ") > -1) {
    const countryName = description.split("flag: ")[1];
    countryFlagEmoji.description = countryName;
  }

  return countryFlagEmoji;
};

type PrettifiedEmojiGroup = {
  prettifiedName: string;
  emojis: BaseEmoji[];
};

export type PrettifiedEmojiGroups = Map<EmojiGroupType, PrettifiedEmojiGroup>;


// The following function was done in order to avoid having to
// prettify description of emojis or groups when the component 
// renders, to hopefully decrease the render time.

/**
 * Categorize the emojis into their appropriate groups
 * plus sanitizes the country flag ones.
 */
export const getEmojisByGroup = (): PrettifiedEmojiGroups => {
  const allEmojis = getEmojis();

  const groupMap = new Map<EmojiGroupType, PrettifiedEmojiGroup>();
  Object.keys(emojiGroupList).forEach(group => {
    const prettifiedGroup: PrettifiedEmojiGroup = {
      prettifiedName: prettifyName(group),
      emojis: []
    };

    groupMap.set(group as EmojiGroupType, prettifiedGroup);
  });

  allEmojis.forEach(emoji => {
    sanitizeCountryFlagEmoji(emoji);

    const emojiGroup = emoji.group;
    const mappedGroup = groupMap.get(emojiGroup)!;
    mappedGroup.emojis.push(emoji);
  });

  return groupMap;
};