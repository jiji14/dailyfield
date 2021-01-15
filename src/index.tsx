import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Signup from "./components/Signup";
import Header from "./components/Header";
import MatchForm from "./components/AddMatch";

// Required for side-effects
require("firebase/firestore");
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAe49YgiJ8xkL43GPyhFuBXoB4bAzzkHms",
  authDomain: "dailyfield-a845d.firebaseapp.com",
  projectId: "dailyfield-a845d",
});
firebase.auth().languageCode = "ko";

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signup" component={Signup} />
        <Route path="/match/add" component={MatchForm} />
      </Switch>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
