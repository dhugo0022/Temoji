import "../styles/EmojiGroup.css";
import { emojis, prettifyName, copyEmojiToClipboard } from "../emoji";
import { BaseEmoji } from "unicode-emoji";

interface EmojiGroupProps {
  chosenGroup: string;
  searchInput: string;
  skinToneOption: string;
}

const EmojiGroup = (props: EmojiGroupProps) => {
  const { chosenGroup, searchInput, skinToneOption } = props;

  let emojiList = emojis.filter(emoji => {
    return emoji.group === chosenGroup;
  });

  // skinTone filter
  if (skinToneOption !== "unset") {
    emojiList = emojiList.map(emoji => {
      const variations = emoji.variations;

      if (!variations) {
        return emoji;
      }

      const skinTonedEmoji = variations.find(variation => {
        const description = variation.description;

        // Name format used in keywords list for skin tones
        const formattedSkinToneName = `: ${skinToneOption} skin tone`;
        return description.indexOf(formattedSkinToneName) > -1;

      }) as BaseEmoji; /* The emoji type of map function is this type */

      return skinTonedEmoji ? skinTonedEmoji : emoji;
    });
  }

  // search by name filter
  if (searchInput.length > 0) {
    const searchParams = searchInput.trim().toLowerCase();

    emojiList = emojiList.filter(emoji => {
      return emoji.description.toLowerCase().includes(searchParams);
    });
  }

  return (
    <div className="emoji-group-container">
      <div className="emoji-group">
        <p className="emoji-group-title">{`${prettifyName(chosenGroup)}:`}</p>
        <div className="emoji-list">
          {emojiList.map(emoji => {
            return (
              <button
                key={emoji.description}
                className="emoji-list-item"
                title={emoji.description}
                onClick={(event) => {
                  const button = event.target as HTMLElement;
                  const text = button.innerText;
                  copyEmojiToClipboard(text);
                }}>
                {emoji.emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmojiGroup;