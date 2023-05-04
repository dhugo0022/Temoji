import "../styles/SearchBar.css";
import { skinTone } from "../emoji";


interface SearchBarProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  skinToneOption: string;
  setSkinToneOption: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = (props: SearchBarProps) => {
  const {
    // seachInput
    searchInput,
    setSearchInput,
    // skinToneOption
    skinToneOption,
    setSkinToneOption
  } = props;

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          id="search-field"
          type="text"
          placeholder="🔍Search"
          value={searchInput}
          onChange={(event) => {
            const searchInput = event.target.value;
            setSearchInput(searchInput);
          }}
        >

        </input>
        <select
          id="skin-tone-selector"
          onChange={(event) => {
            const skinTone = event.target.options[event.target.selectedIndex].value;
            if (skinTone !== skinToneOption) {
              setSkinToneOption(skinTone);
            }
          }}
        >
          {Object.entries(skinTone).map(([tone, icon]) => {
            return (
              <option
                key={tone}
                value={tone}>
                {icon}
              </option>
            );
          })
          }
        </select>
      </div>
    </div>
  );
};

export default SearchBar;