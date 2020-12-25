import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import "./App.css";

function App(): JSX.Element {
  return (
    <div className="App">
      <MatchList />
      <PlayerList />
    </div>
  );
}

export default App;
