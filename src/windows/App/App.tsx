import "./App.css";
import TopBar from "../../components/TopBar/TopBar";
import EmojiGroup from "../../components/EmojiGroup/EmojiGroup";
import GroupBar from "../../components/GroupBar/GroupBar";
import Settings from "../Settings/Settings";

function App() {
  return (
    <>
      <div className="content">
        <TopBar />
        <EmojiGroup />
        <GroupBar />
      </div>
    </>
  );
}

export default App;