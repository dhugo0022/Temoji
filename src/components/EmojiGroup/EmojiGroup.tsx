import { useEffect, useRef, useState } from "react";
import { BaseEmoji, Emoji } from "unicode-emoji";

import "./EmojiGroup.css";
import { getEmojisByGroup, copyEmojiToClipboard, EmojiGroupType, emojiGroupList } from "../../emoji";
import { useAppSelector } from "../../hooks";
import EmojiTonePickerModal from "./EmojiTonePickerModal/EmojiTonePickerModal";

const groupedEmojis = getEmojisByGroup();

const mapMapToArray = <K, V, T>(map: Map<K, V>, mapperFn: (key: K, value: V) => T): T[] => {
  const result: T[] = [];
  for (const [key, value] of map) {
    const mappedEntry = mapperFn(key, value);
    result.push(mappedEntry);
  }
  return result;
};

type EmojiObserver = {
  [group in EmojiGroupType]: number;
};

const createDefaultObserver = (): EmojiObserver => {
  const mappedArray = Object.keys(emojiGroupList).map(key => {
    const initialGroupValue = groupedEmojis.get(key as EmojiGroupType)!.emojis.length;
    return ({ [key]: initialGroupValue });
  });
  const mappedObject = Object.assign({}, ...mappedArray);
  return mappedObject;
};

function resetObserver(observer: EmojiObserver) {
  Object.keys(observer).forEach(key => observer[key as EmojiGroupType] = 0);
  return observer;
}

function getObserverFullCount(observer: EmojiObserver) {
  const fullCount = Object.values(observer).reduce((prev, curr) => prev + curr, 0);
  return fullCount;
}

const searchEmoji = (observer: EmojiObserver, emoji: BaseEmoji, searchInput: string): boolean => {
  let result = false;

  if (searchInput.length < 1) {
    result = true;
  } else {
    const searchParams = searchInput.trim().toLowerCase();
    result = emoji.description.toLowerCase().includes(searchParams);
  }

  if (result) {
    // Increases the group's found emoji count
    const emojiGroup = emoji.group as EmojiGroupType;
    observer[emojiGroup]++;
  }

  return result;
};

const defaultObserver = createDefaultObserver();

const EmojiGroup = () => {
  const searchInput = useAppSelector(state => state.searchInput.value);
  const emojiPreferences = useAppSelector(state => state.emojiPreferences.value);

  const observer = useRef<EmojiObserver>(defaultObserver);

  const [isEmojiTonePickerOpen, setIsEmojiTonePickerOpen] = useState(false);
  const [longClickedEmoji, setLongClickedEmoji] = useState<BaseEmoji>();

  useEffect(() => {
    resetObserver(observer.current);
  }, [searchInput]);

  return (
    <div className="emoji-group-container">
      <p className={getObserverFullCount(observer.current) < 1 ? "" : "hidden"}>
        No emojis were found
      </p>
      <EmojiTonePickerModal
        longClickedEmoji={longClickedEmoji}
        setLongClickedEmoji={setLongClickedEmoji}
        isEmojiTonePickerOpen={isEmojiTonePickerOpen}
        setIsEmojiTonePickerOpen={setIsEmojiTonePickerOpen}
      />
      {mapMapToArray(groupedEmojis, (groupName, group) => {
        return (
          <div
            key={groupName}
            id={groupName}
            className={`emoji-group${observer.current[groupName] > 0 ? "" : " hidden"}`}
          >
            <p className="emoji-group-title">{group.prettifiedName}</p>
            <div className="emoji-list">
              {group.emojis.map(emoji => {
                const hasVariations = emoji.variations !== undefined;
                const hasPassedSearch = searchEmoji(observer.current, emoji, searchInput);

                let displayedEmoji = emoji.emoji;

                const emojiPreference = emojiPreferences[emoji.description];

                if (hasVariations && emojiPreference !== undefined) {
                  const variations = emoji.variations!;
                  const variation = variations.find(variation => variation.description === emojiPreference);
                  if (variation) {
                    displayedEmoji = variation.emoji;
                  }
                }

                return (
                  <button
                    key={`${emoji.description}-button`}
                    className={
                      "emoji-list-item" +
                      (hasVariations ? " varied" : "") +
                      (hasPassedSearch ? "" : " hidden")

                    }
                    title={emoji.description}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      if (hasVariations) {
                        setLongClickedEmoji(emoji);
                        setIsEmojiTonePickerOpen(true);
                      }
                    }}
                    onClick={() => {
                      copyEmojiToClipboard(displayedEmoji);
                    }}
                  >
                    {displayedEmoji}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmojiGroup;