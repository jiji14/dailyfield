import MatchList from "./components/MatchList";
import PlayerList from "./components/PlayerList";
import "./App.css";
import firebase from "firebase";

// Required for side-effects
require("firebase/firestore");
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAe49YgiJ8xkL43GPyhFuBXoB4bAzzkHms",
  authDomain: "dailyfield-a845d.firebaseapp.com",
  projectId: "dailyfield-a845d",
});
const db = firebase.firestore();

function App(): JSX.Element {
  const addUser = () => {
    db.collection("users")
      .add({
        name: "이지정",
        gender: "여성",
        birthdate: "1992-01-14",
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  const addMatch = () => {
    db.collection("matches")
      .add({
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
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

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
