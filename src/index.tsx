import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Signup from "./components/Signup";
import Header from "./components/Header";
import MatchForm from "./components/AddMatch";
import MatchList from "./components/MatchList";
import MatchDetail from "./components/MatchDetail";
import Admin from "./components/Admin";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";

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
      <div className="wrapper">
        <Switch>
          <Route path="/match/add" component={MatchForm} />
          <Route path="/match/:id/admin" component={Admin} />
          <Route path="/match/:id" component={MatchDetail} />
          <Route path="/signup" component={Signup} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/termsofservice" component={TermsOfService} />
          <Route path="/specialclasses">
            <MatchList specialClasses />
          </Route>
          <Route path="/matches">
            <MatchList />
          </Route>
          <Redirect exact from="/" to="/matches" />
        </Switch>
      </div>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
