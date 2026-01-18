import { NextResponse } from "next/server";
import { createOrUpdateAttendance, getAttendanceForToday } from "@/lib/attendance";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getAttendanceForToday(session.user.id);
  if (existing?.checkInAt) {
    return NextResponse.json({ error: "Already checked in" }, { status: 400 });
  }

  await createOrUpdateAttendance({
    checkInAt: new Date().toISOString(),
    status: "OPEN"
  });

  return NextResponse.json({ ok: true });
}
