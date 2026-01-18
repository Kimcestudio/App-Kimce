import { NextResponse } from "next/server";
import { createOrUpdateAttendance, getAttendanceForToday } from "@/lib/attendance";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getAttendanceForToday(session.user.id);
  if (!existing?.checkInAt || existing.checkOutAt) {
    return NextResponse.json({ error: "Shift not open" }, { status: 400 });
  }

  const breaks = existing.breaks ?? [];
  const lastBreak = breaks.at(-1);
  if (!lastBreak || lastBreak.endAt) {
    return NextResponse.json({ error: "No open break" }, { status: 400 });
  }

  lastBreak.endAt = new Date().toISOString();
  await createOrUpdateAttendance({ breaks });

  return NextResponse.json({ ok: true });
}
