import { useState, useEffect } from "react";
import firebase from "firebase";

export function useUser(): firebase.User | null {
  const [user, setUser] = useState(firebase.auth().currentUser);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return user;
}
