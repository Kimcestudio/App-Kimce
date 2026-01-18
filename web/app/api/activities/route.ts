import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { firebaseReady, getDb } from "@/lib/firebase-admin";
import type { ExtraActivity } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<ExtraActivity>;
  const activity: ExtraActivity = {
    id: randomUUID(),
    userId: session.user.id,
    date: payload.date ?? new Date().toISOString().slice(0, 10),
    minutes: payload.minutes ?? 0,
    type: payload.type ?? "Actividad",
    description: payload.description ?? "",
    status: "PENDING",
    startAt: payload.startAt,
    endAt: payload.endAt,
    projectId: payload.projectId,
    evidenceUrl: payload.evidenceUrl
  };

  if (firebaseReady) {
    await getDb().collection("extraActivities").doc(activity.id).set(activity);
  }

  return NextResponse.json({ ok: true });
}
