import "../styles/GroupBar.css";
import { emojiGroup, prettifyName } from "../emoji";

interface GroupBarProps {
  chosenGroup: string;
  setChosenGroup: React.Dispatch<React.SetStateAction<string>>;
}

const GroupBar = (props: GroupBarProps) => {
  const { chosenGroup, setChosenGroup } = props;

  return (
    <div className="group-bar">
      {Object.entries(emojiGroup).map(([key, group]) => {
        return (
          <button
            key={key}
            className={`group-bar-item${chosenGroup === key ? " selected" : ""}`}
            title={prettifyName(key)}
            onClick={() => {
              if (chosenGroup !== key) {
                setChosenGroup(key);
              }
            }}>
            {group}
          </button>
        );
      })}
    </div>
  );
};

export default GroupBar;