import { useAppSelector, useAppDispatch } from "../../../hooks";
import { themeList, Theme as ThemeType } from "../../../settings";
import { setTheme } from "../../../slices/userSettingsSlice";

const Theme = () => {
  const theme = useAppSelector(state => state.userSettings.value.theme);
  const dispatch = useAppDispatch();

  return (
    <select
      onChange={(event) => {
        const target = event.target as HTMLSelectElement;
        const theme = target.value as ThemeType;
        dispatch(setTheme(theme));
      }}
      value={theme}
    >
      {themeList.map((theme) => {
        return (
          <option
            key={theme}
            value={theme}
          >
            {theme}
          </option>
        );
      })}
    </select>
  );
};

export default Theme;