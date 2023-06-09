import "./GroupBar.css";
import { emojiGroupList, prettifyName } from "../../emoji";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setChosenGroup } from "../../slices/chosenGroupSlice";

const GroupBar = () => {

  const chosenGroup = useAppSelector(state => state.chosenGroup.value);
  const dispatch = useAppDispatch();

  return (
    <div className="group-bar">
      {Object.entries(emojiGroupList).map(([group, icon]) => {
        return (
          <button
            key={group}
            className={`group-bar-item${chosenGroup === group ? " selected" : ""}`}
            title={prettifyName(group)}
            onClick={() => {
              if (chosenGroup !== group) {
                window.location.href = `#${group}`;
                dispatch(setChosenGroup(group));
              }
            }}>
            {icon}
          </button>
        );
      })}
    </div>
  );
};

export default GroupBar;