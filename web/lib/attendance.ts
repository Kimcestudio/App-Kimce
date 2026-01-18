import { randomUUID } from "crypto";
import { auth } from "./auth";
import { getDb, firebaseReady } from "./firebase-admin";
import type { AttendanceRecord } from "./types";

export async function getAttendanceForToday(userId: string) {
  if (!firebaseReady) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const snapshot = await getDb()
    .collection("attendance")
    .where("userId", "==", userId)
    .where("date", "==", today)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0]?.data() as AttendanceRecord;
}

export async function createOrUpdateAttendance(update: Partial<AttendanceRecord>) {
  if (!firebaseReady) {
    return;
  }

  const user = await auth();
  if (!user?.user?.id) {
    throw new Error("No autorizado");
  }

  const today = new Date().toISOString().slice(0, 10);
  const record = await getAttendanceForToday(user.user.id);
  const payload: AttendanceRecord = {
    id: record?.id ?? randomUUID(),
    userId: user.user.id,
    date: today,
    checkInAt: record?.checkInAt,
    checkOutAt: record?.checkOutAt ?? null,
    breaks: record?.breaks ?? [],
    notes: record?.notes,
    totalMinutes: record?.totalMinutes ?? 0,
    lateMinutes: record?.lateMinutes ?? 0,
    status: record?.status ?? "OPEN",
    ...update
  };

  await getDb().collection("attendance").doc(payload.id).set(payload, { merge: true });
}
