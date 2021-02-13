import { Match, Status } from "./types";
import firebase from "firebase";

export async function checkIfMatchIsDone(match: Match): Promise<Status> {
  const db = firebase.firestore();
  const matchDoc = await db
    .collection("matches")
    .doc(match.id)
    .collection("reservation")
    .where("status", "==", "확정")
    .get();

  if (matchDoc?.size >= match.memberCount) {
    return "마감";
  }
  return "신청가능";
}

export async function checkMatchStatusForUser(
  match: Match,
  uid: string
): Promise<Status | undefined> {
  const db = firebase.firestore();
  const reservationDoc = await db
    .collection("matches")
    .doc(match.id)
    .collection("reservation")
    .doc(uid)
    .get();

  if (!reservationDoc.exists) return;
  const data = reservationDoc.data();
  if (data?.status) return data.status;
}
