import { ReactNode } from "react";


type SettingsOptionProps = {
  label: string;
  handler: ReactNode;
};

const SettingsOption = (props: SettingsOptionProps) => {
  return (
    <div className="settings-option">
      <label className="settings-option-label">
        {`${props.label}:`}
      </label>
      {props.handler}
    </div>
  );
};

export default SettingsOption;