import "./SearchBar.css";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setSearchInput } from "../../slices/searchInputSlice";
import { setChosenGroup } from "../../slices/chosenGroupSlice";

const SearchBar = () => {
  const searchInput = useAppSelector(state => state.searchInput.value);
  const chosenGroup = useAppSelector(state => state.chosenGroup.value);
  const dispatch = useAppDispatch();

  return (
    <input
      id="search-field"
      type="text"
      placeholder="🔍Search"
      value={searchInput}
      onChange={(event) => {
        const searchInput = event.target.value;
        dispatch(setSearchInput(searchInput));
        if (chosenGroup.length > 0) {
          dispatch(setChosenGroup(""));
        }
      }}
    >
    </input>
  );
};

export default SearchBar;