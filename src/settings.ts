import {
  readTextFile,
  writeTextFile,
  createDir,
  exists,
  BaseDirectory
} from "@tauri-apps/api/fs";

import Theme from "./components/Settings/Theme/Theme";
import { UserSettingsType } from "./slices/userSettingsSlice";
import { EmojiPreferencesType } from "./slices/emojiPreferencesSlice";

// I will not support folders, only files
// The settings files will be .json
class Settings {
  fileName: string;
  baseDirectory: BaseDirectory;

  constructor(fileName: string, baseDirectory: BaseDirectory) {
    this.fileName = fileName;
    this.baseDirectory = baseDirectory;
  }

  /**
   * Checks if the file exists.
   * @returns if the file exists 
   */
  async exists() {
    return await exists(this.fileName, { dir: this.baseDirectory });
  }

  /**
   * Creates the base directory for the file.
   */
  async createBaseDir() {
    await createDir('', { dir: this.baseDirectory, recursive: true });
  }

  /**
   * Writes the given contents object as stringified (prettified) JSON
   * to the file.
   * @param contents the object you want to stringify as JSON
   */
  async write(contents: object) {
    const prettifiedContents = JSON.stringify(contents, null, 2);
    await writeTextFile(this.fileName, prettifiedContents, { dir: this.baseDirectory });
  }

  /**
   * Reads the contents of the file and parses it as JSON.
   * @returns the contents parsed as JSON
   */
  async read(): Promise<object> {
    const contents = await readTextFile(this.fileName, { dir: this.baseDirectory });
    const jsonObject = JSON.parse(contents);
    return jsonObject;
  }

  /**
   * Reads the contents of the the file, parses it as JSON.
   * and casts it to the given type
   * @returns 
   */
  async readAs<Type>(): Promise<Type> {
    return await this.read() as Type;
  }
}

// TODO: move this to its separate file
export const themeList = ["Light", "Dark"] as const;
export type Theme = typeof themeList[number];

export const defaultUserSettings: UserSettingsType = {
  theme: "Light",
  shortcut: "Ctrl+."
};

const appSettings = new Settings("settings.json", BaseDirectory.AppConfig);

/**
 * Reads the contents of the file using the {@link Settings.readAs | readAs} method
 * from the {@link appSettings} instance and returns the parsed content casted
 * as {@link UserSettingsType}
 * @returns the settings' contents casted as the {@link UserSettingsType} type
 */
async function getAppSettings(): Promise<UserSettingsType> {
  return await appSettings.readAs<UserSettingsType>();
}

/**
 * Loads the settings from the settings file
 * and return the userSettings object that
 * will be used to initialize the userSettings
 * state.
 * 
 * If the settings file does not exist, the
 * default settings will be used to create
 * the settings file and to populate the
 * state on the store.
 */
export async function initAppSettings(): Promise<UserSettingsType> {
  if (await appSettings.exists()) {
    const userSettings = await getAppSettings();
    return userSettings;
  } else {
    appSettings.createBaseDir();
    await appSettings.write(defaultUserSettings);
    return defaultUserSettings;
  }
}

/**
 * Saves the given userSettings state 
 * to the settings file.
 * @param userSettings the userSettings object to be saved
 */
export async function saveAppSettings(userSettings: UserSettingsType) {
  await appSettings.write(userSettings);
}

export const defaultEmojiPreferences: EmojiPreferencesType = {};

const appEmojiPreferences = new Settings("emojiPreferences.json", BaseDirectory.AppData);

export async function getAppEmojiPreferences(): Promise<EmojiPreferencesType> {
  return await appEmojiPreferences.readAs<EmojiPreferencesType>();
}

export async function initAppEmojiPreferences() {
  if (await appEmojiPreferences.exists()) {
    const emojiPreferences = await getAppEmojiPreferences();
    return emojiPreferences;
  } else {
    appEmojiPreferences.createBaseDir();
    await appEmojiPreferences.write(defaultEmojiPreferences);
    return defaultEmojiPreferences;
  }
}

export async function saveAppEmojiPreferences(emojiPreferences: EmojiPreferencesType) {
  await appEmojiPreferences.write(emojiPreferences);
}