import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { firebaseReady, getDb } from "@/lib/firebase-admin";
import type { Request } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<Request>;
  const record: Request = {
    id: randomUUID(),
    userId: session.user.id,
    type: payload.type ?? "DAY_OFF",
    startDate: payload.startDate ?? new Date().toISOString().slice(0, 10),
    endDate: payload.endDate,
    startTime: payload.startTime,
    endTime: payload.endTime,
    reason: payload.reason ?? "",
    attachmentUrl: payload.attachmentUrl,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  if (firebaseReady) {
    await getDb().collection("requests").doc(record.id).set(record);
  }

  return NextResponse.json({ ok: true });
}
