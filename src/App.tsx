import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import "./App.css";
import Signup from "./components/Signup";

function App(): JSX.Element {
  return (
    <div className="App">
      <MatchList />
      <PlayerList />
      <Signup />
    </div>
  );
}

export default App;
