import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import "./App.css";
import Header from "./components/Header";

function App(): JSX.Element {
  return (
    <div className="App">
      <Header />
      <MatchList />
      <PlayerList />
    </div>
  );
}

export default App;
