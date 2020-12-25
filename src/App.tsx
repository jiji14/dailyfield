import MatchList from "./components/MatchList";
import "./App.css";
import Header from "./components/Header";

function App(): JSX.Element {
  return (
    <div className="App">
      <Header />
      <MatchList />
    </div>
  );
}

export default App;
