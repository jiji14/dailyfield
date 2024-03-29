import { Match, Status } from "./types";
import firebase from "firebase";
import { CollectionName } from "./collections";

export async function isMatchFull(match: Match): Promise<boolean> {
  const db = firebase.firestore();
  const matchDoc = await db
    .collection(CollectionName.matchesCollectionName)
    .doc(match.id)
    .collection(CollectionName.reservationsCollectionName)
    .where("status", "==", "확정")
    .get();

  return matchDoc?.size >= match.memberCount;
}

export async function getMatchStatusForUser(
  match: Match,
  uid: string
): Promise<Status | undefined> {
  const db = firebase.firestore();
  const reservationDoc = await db
    .collection(CollectionName.matchesCollectionName)
    .doc(match.id)
    .collection(CollectionName.reservationsCollectionName)
    .doc(uid)
    .get();

  if (!reservationDoc.exists) return;
  const data = reservationDoc.data();
  return data?.status;
}

export async function getReservationStatus(
  match: Match | null,
  user: firebase.User | null
): Promise<Status> {
  // 매치정보가 없으면 "신청가능" 리턴
  if (!match) return "신청가능";
  const reservationStatus = (await isMatchFull(match)) ? "마감" : "신청가능";
  // 유저정보가 없으면 매치가 full인지 아닌지 확인한 상태 리턴
  if (!user) return reservationStatus;
  const matchStatusForUser = await getMatchStatusForUser(match, user.uid);
  // 유저에 해당하는 매치 상태가 있으면 그 상태값 리턴하고 없으면 매치가 full인지 아닌지 확인한 상태 리턴
  return matchStatusForUser ?? reservationStatus;
}

export async function deleteReservationStatus(
  matchId: string,
  uid: string
): Promise<void> {
  const db = firebase.firestore();
  await db
    .collection(CollectionName.matchesCollectionName)
    .doc(matchId)
    .collection(CollectionName.reservationsCollectionName)
    .doc(uid)
    .delete();
}

export async function updateReservationStatus(
  matchId: string,
  uid: string,
  status: Status
): Promise<void> {
  const db = firebase.firestore();
  await db
    .collection(CollectionName.matchesCollectionName)
    .doc(matchId)
    .collection(CollectionName.reservationsCollectionName)
    .doc(uid)
    .set({ status: status });
}
