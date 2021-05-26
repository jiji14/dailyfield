import { useState, useEffect } from "react";
import { Match, Status } from "../types";
import { getReservationStatus } from "../globalFunction";
import firebase from "firebase";

export function useReservationStatus(
  match: Match | null,
  user: firebase.User | null
): Status {
  const [reservationStatus, setReservationStatus] =
    useState<Status>("신청가능");

  useEffect(() => {
    (async () => {
      setReservationStatus(await getReservationStatus(match, user));
    })();
  }, [match, user]);

  return reservationStatus;
}
