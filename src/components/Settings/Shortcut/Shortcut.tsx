import { useRef, useState } from "react";
import { type as getOsType } from "@tauri-apps/api/os";

import "./Shortcut.css";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { setShortcut } from "../../../slices/userSettingsSlice";

// Default modifier names
const modifiers = ["Control", "Alt", "Shift", "Meta"];

/**
 * Structure of mapping = [Control, Alt, Shift, Meta]
 * undefined = doesn't need mapping
*/
const osTypeMappings = {
  // Linux
  "Linux": ["Ctrl", undefined, undefined, undefined],
  // Mac
  "Darwin": [undefined, "Option", undefined, "Command"],
  // Windows
  "Windows_NT": ["Ctrl", undefined, undefined, "Super"]
};

// User's OS
const osType = await getOsType();

// User's OS mapping
const osTypeMapping = osTypeMappings[osType];

/**
 * Validates if the given string is a modifier. (Ctrl, Alt, Shift, etc...)
 * 
 * PS: The returned value of the modifier is the mapped one
 * @param key the pressed key
 * @returns the modifier if the key is a valid one or undefined otherwise
 */
const validateModifier = (key: string): string | undefined => {
  for (const [index, modifier] of modifiers.entries()) {
    if (key === modifier) {
      const mappedModifier = osTypeMapping[index];

      const trueModifier = mappedModifier ? mappedModifier : modifier;
      return trueModifier;
    }
  }

  return undefined;
};

/**
 * Validates if the given string consists of only one 
 * character and this character is a letter.
 * 
 * PS: The returned value of the letter is an uppercased one
 * @param key the pressed key
 * @returns the letter if the key is a valid one or undefined otherwise
 */
const validateLetter = (key: string): string | undefined => {
  const letter = key.toUpperCase();
  const regex = new RegExp(/[A-Z]/);
  return key.length === 1 && regex.test(letter) ? letter : undefined;
};

/**
 * Appends a new key to the buffer
 * 
 * @param setBuffer the buffer setter
 * @param key the new key to be added
 */
const appendKeyToBuffer = (
  setBuffer: React.Dispatch<React.SetStateAction<string>>,
  key: string,
  callback: ((updatedBuffer: string) => void) | undefined = undefined
) => {
  setBuffer((buffer) => {
    const newBuffer = buffer.length > 0 ? `${buffer}+${key}` : key;
    callback?.call(this, newBuffer);
    return newBuffer;
  });
};

interface KeySet {
  modifiers: string[];
  letter?: string;
}

/**
 * 
 * @returns an empty keySet
 */
const createEmptyKeySet = (): KeySet => {
  return {
    modifiers: []
  };
};

/**
 * Adds a modifier to a keySet
 * @param setKeySet the keySet setter
 * @param modifier the modifier to be added
 */
const addModifierToKeySet = (setKeySet: React.Dispatch<React.SetStateAction<KeySet>>, modifier: string) => {
  setKeySet(keySet => {
    const newKeySet = keySet;
    const modifiers = newKeySet.modifiers;

    modifiers.push(modifier);

    return newKeySet;
  });
};

/**
 * Validates if a keySet is a valid shortcut
 * 
 * Conditions:
 * - There has to be at least one modifier
 * - The letter cannot be undefined
 */
const validateKeySet = (keySet: KeySet): boolean => {
  const hasValidModifiers = keySet.modifiers.length > 0;
  const hasValidLetter = keySet.letter !== undefined;
  return hasValidModifiers && hasValidLetter;
};

const Shortcut = () => {
  // App state
  const currentShortcut = useAppSelector(state => state.userSettings.value.shortcut);
  const dispatch = useAppDispatch();

  // Shortcut state
  const [buffer, setBuffer] = useState(currentShortcut);
  const [focused, setFocused] = useState(false);
  const [recording, setRecording] = useState(false);
  const [keySet, setKeySet] = useState(createEmptyKeySet());

  const lastKey = useRef("");

  return (
    <input
      className={`shortcut ${recording
        ? "recording"
        : buffer === currentShortcut ? "set" : "unset"}`}
      // Prevent it from being copied to the clipboard
      onCopy={(event) => event.preventDefault()}
      onChange={() => { }}
      value={buffer.length > 0 ? buffer : "Not defined"}
      title={buffer
        ? "1. Click to define a new shortcut.\n2. Press backspace to remove the current shortcut."
        : "Click to define a shortcut."}
      // onBlurCapture is being used because I wanted to change the 
      // state right away, there're times that unfocusing the window
      // doesn't trigger the onBlur method. So by using the Capture
      // one, we make sure that the buffer will show the shortcut
      // without erros
      onBlurCapture={() => {
        if (focused) {
          setFocused(false);
        }

        if (recording) {
          setRecording(false);
        }

        setKeySet(createEmptyKeySet());
        if (buffer !== currentShortcut) {
          setBuffer(currentShortcut);
        }
      }}
      onClick={() => {
        // This handles focus by click
        if (!focused) {
          setFocused(true);
        }

        if (!recording) {
          setRecording(true);
        }

        setBuffer("Recording...");
      }}
      onKeyUp={(event) => {
        const key = event.key;

        // This handles focus by tab
        if (key === "Tab" && !focused) {
          setFocused(true);
          setBuffer("Click to record...");
          return;
        }

        if (recording) {
          const isKeySetValid = validateKeySet(keySet);
          if (!isKeySetValid) {
            setBuffer("Recording...");
            setKeySet(createEmptyKeySet());
            return;
          }
        }
      }}
      onKeyDown={(event) => {
        const key = event.key;

        if (lastKey.current === key) {
          return;
        }

        lastKey.current = key;

        if (!recording) {
          return false;
        }

        if (buffer === "Recording..."
          || buffer === "Invalid key"
          || buffer === "No modifiers") {
          setBuffer("");
        }

        const validModifier = validateModifier(key);

        if (validModifier) {
          appendKeyToBuffer(setBuffer, validModifier);
          addModifierToKeySet(setKeySet, validModifier);
          return;
        }

        const validLetter = validateLetter(key);

        if (!validLetter) {
          setBuffer("Invalid key");
          setKeySet(createEmptyKeySet());
          return;
        }

        if (keySet.modifiers.length < 1) {
          setBuffer("No modifiers");
          setKeySet(createEmptyKeySet());
          return;
        }

        // When we reach this point, it means that we found a valid shortcut
        if (!keySet.letter) {
          appendKeyToBuffer(setBuffer, validLetter, (updatedBuffer) => {
            if (updatedBuffer !== currentShortcut) {
              dispatch(setShortcut(updatedBuffer));
              setRecording(false);
              setKeySet(createEmptyKeySet());
              console.log(updatedBuffer);
            } else {
              setBuffer("Same shortcut...");
              setKeySet(createEmptyKeySet());
            }
          });
        }
      }}
    >
    </input>
  );
};

export default Shortcut;