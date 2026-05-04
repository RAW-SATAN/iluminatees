import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, date, status, attendanceId } = await req.json();

  if (attendanceId) {
    await db
      .update(attendance)
      .set({ status, notes: "Manual override by admin" })
      .where(and(eq(attendance.id, attendanceId), eq(attendance.companyId, companyId)));
  } else {
    // Upsert: try insert, update on conflict
    const [existing] = await db
      .select({ id: attendance.id })
      .from(attendance)
      .where(and(eq(attendance.employeeId, employeeId), eq(attendance.date, date)))
      .limit(1);

    if (existing) {
      await db
        .update(attendance)
        .set({ status, notes: "Manual override by admin" })
        .where(eq(attendance.id, existing.id));
    } else {
      await db.insert(attendance).values({
        employeeId,
        companyId,
        date,
        status,
        notes: "Manual override by admin",
      });
    }
  }

  return NextResponse.json({ success: true });
}
