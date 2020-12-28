import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import Header from "./components/Header";
import "./App.css";
import Signup from "./components/Signup";
import firebase from "firebase";
import { Player, Match } from "./types";

const player: Player = {
  name: "이지정",
  gender: "여성",
  phoneNumber: "010-9014-3492",
  birthDate: new Date("1992-01-14"),
  matchesPlayed: 0,
};
const match: Match = {
  dateTime: new Date(),
  place: "용산 더베이스",
  memberCount: 15,
  teamCount: 3,
  gender: "여성",
  level: "초급",
  link: "naver.com",
  gameType: "gx",
  fee: 20000,
  canPark: true,
  canRentShoes: false,
  manager: "배성진",
};
const addUser = () => {
  const db = firebase.firestore();
  db.collection("users")
    .add(player)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

const addMatch = () => {
  const db = firebase.firestore();
  db.collection("matches")
    .add(match)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

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
