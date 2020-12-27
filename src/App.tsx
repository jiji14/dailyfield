import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import "./App.css";
import firebase from "firebase";
import { Player, Match } from "./types";
// Required for side-effects
require("firebase/firestore");
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAe49YgiJ8xkL43GPyhFuBXoB4bAzzkHms",
  authDomain: "dailyfield-a845d.firebaseapp.com",
  projectId: "dailyfield-a845d",
});
const db = firebase.firestore();
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
      <MatchList />
      <PlayerList />
      <button onClick={addUser}>Add User</button>
      <button onClick={addMatch}>Add Match</button>
    </div>
  );
}

export default App;
