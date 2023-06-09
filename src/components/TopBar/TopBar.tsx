import { useState } from "react";

import "./TopBar.css";
import SearchBar from "../SearchBar/SearchBar";
import Settings from "../../windows/Settings/Settings";

const TopBar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="top-bar">
      <SearchBar />
      <button
        className="settings-button"
        onClick={() => {
          if (!isSettingsOpen) setIsSettingsOpen(true);
        }}
      >
      </button>
      <Settings isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
    </header>
  );
};

export default TopBar;