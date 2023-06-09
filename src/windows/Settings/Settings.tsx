import ReactModal from "react-modal";
import deep_equal from "react-fast-compare";
import { useState } from "react";

import "./Settings.css";
import SettingsOption from "../../components/Settings/SettingsOption/SettingsOption";
import Shortcut from "../../components/Settings/Shortcut/Shortcut";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { saveAppSettings } from "../../settings";
import { setSettings, UserSettingsType } from "../../slices/userSettingsSlice";
import Theme from "../../components/Settings/Theme/Theme";

type SettingsProps = {
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Settings = (props: SettingsProps) => {
  const { isSettingsOpen, setIsSettingsOpen } = props;

  const userSettings = useAppSelector(state => state.userSettings.value);
  const dispatch = useAppDispatch();

  const [settingsCache, setSettingsCache] = useState<UserSettingsType>(userSettings);

  const hasChanges = () => !deep_equal(settingsCache, userSettings);

  const closeModal = () => {
    setIsSettingsOpen(false);
  };

  const close = () => {
    // If the changes aren't saved, set userSettings
    // state back to what it was before
    if (hasChanges()) {
      dispatch(setSettings(settingsCache));
    }

    closeModal();
  };

  const save = () => {
    setSettingsCache(userSettings);
    saveAppSettings(userSettings);

    closeModal();
  };

  return (
    <ReactModal
      className="settings-modal"
      isOpen={isSettingsOpen}
      onRequestClose={close}
    >
      <div className="settings">
        <SettingsOption label="Theme" handler={<Theme />} />
        <SettingsOption label="Shortcut" handler={<Shortcut />} />
      </div>
      <div className="settings-options">
        <button
          className={`button save${!hasChanges() ? " disabled" : ""}`}
          onClick={() => {
            if (!hasChanges()) return;
            save();
          }}
        >
          Save
        </button>
        <button
          className="button cancel"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </ReactModal>

  );
};

export default Settings;