import "../styles/App.css";
import { useState } from "react";
import SearchBar from "./SearchBar";
import EmojiGroup from "./EmojiGroup";
import GroupBar from "./GroupBar";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [skinToneOption, setSkinToneOption] = useState("unset");
  const [chosenGroup, setChosenGroup] = useState("smileys-emotion");

  return (
    <div className="content">
      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        skinToneOption={skinToneOption}
        setSkinToneOption={setSkinToneOption}
      />
      <EmojiGroup
        chosenGroup={chosenGroup}
        searchInput={searchInput}
        skinToneOption={skinToneOption}
      />
      <GroupBar
        chosenGroup={chosenGroup}
        setChosenGroup={setChosenGroup}
      />
    </div>
  );
}

export default App;