import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import Header from "./components/Header";
import "./App.css";

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
