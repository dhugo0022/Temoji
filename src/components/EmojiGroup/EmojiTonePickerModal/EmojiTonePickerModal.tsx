import ReactModal from "react-modal";

import "./EmojiTonePickerModal.css";
import { BaseEmoji, Emoji } from "unicode-emoji";
import { copyEmojiToClipboard } from "../../../emoji";
import { useAppSelector, useAppDispatch } from "../../../hooks";
import { removeEmojiPreference, setEmojiPreference } from "../../../slices/emojiPreferencesSlice";
import { saveAppEmojiPreferences } from "../../../settings";
import { useEffect } from "react";

type EmojiTonePickerModalProps = {
  longClickedEmoji: BaseEmoji | undefined;
  setLongClickedEmoji: React.Dispatch<React.SetStateAction<BaseEmoji | undefined>>;
  isEmojiTonePickerOpen: boolean;
  setIsEmojiTonePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EmojiTonePickerModal = (props: EmojiTonePickerModalProps) => {
  const {
    longClickedEmoji,
    setLongClickedEmoji,
    isEmojiTonePickerOpen,
    setIsEmojiTonePickerOpen
  } = props;

  const emojiPreferences = useAppSelector(state => state.emojiPreferences.value);
  const dispatch = useAppDispatch();

  const close = () => {
    setLongClickedEmoji(undefined);
    setIsEmojiTonePickerOpen(false);
  };

  // After the preference is updated
  useEffect(() => {
    saveAppEmojiPreferences(emojiPreferences);
  }, [emojiPreferences]);

  // the variations and the default option
  const allVariations: Emoji[] = [];
  if (longClickedEmoji) allVariations.push(longClickedEmoji as Emoji);
  longClickedEmoji?.variations?.forEach(variation => allVariations.push(variation));

  return (
    <ReactModal
      className="emoji-tone-picker-modal"
      isOpen={isEmojiTonePickerOpen}
      onRequestClose={close}
    >
      <div>
        {allVariations.map(variation => {
          return (
            <button
              onClick={() => {
                copyEmojiToClipboard(variation.emoji);
                close();

                const isUnset = variation.description === longClickedEmoji?.description;

                const preference = emojiPreferences[longClickedEmoji!.description];
                const hasPreference = preference !== undefined;

                // Already has this preference set
                if (hasPreference && preference === variation.description) {
                  return;
                }

                // if unset is chosen and there's a preference set
                if (isUnset && hasPreference) {
                  dispatch(removeEmojiPreference(variation.description));
                } else {
                  const emojiPreferencePayload = {
                    emoji: longClickedEmoji!,
                    preference: variation.description
                  };

                  dispatch(setEmojiPreference(emojiPreferencePayload));
                }
              }}
              key={variation.description}
              title={variation.description}
            >
              {variation.emoji}
            </button>
          );
        })}
      </div>
    </ReactModal>
  );
};

export default EmojiTonePickerModal;