import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, mode, lat, lng, locationVerified, selfieBase64 } = await req.json();

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  // Upload selfie to Vercel Blob
  let selfieUrl: string | null = null;
  if (selfieBase64) {
    try {
      const base64Data = selfieBase64.replace(/^data:image\/jpeg;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const blobPath = `attendance/${companyId}/${employeeId}/${today}-${mode}.jpg`;
      const blob = await put(blobPath, buffer, { access: "public", contentType: "image/jpeg" });
      selfieUrl = blob.url;
    } catch (err) {
      console.error("Selfie upload failed:", err);
    }
  }

  if (mode === "checkin") {
    const [existing] = await db
      .select({ id: attendance.id })
      .from(attendance)
      .where(and(eq(attendance.employeeId, employeeId), eq(attendance.date, today)))
      .limit(1);

    const checkInHour = now.getHours();
    const checkInMin = now.getMinutes();
    const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMin > 30);

    if (existing) {
      await db
        .update(attendance)
        .set({
          checkInTime: now,
          checkInSelfieUrl: selfieUrl,
          checkInLat: lat?.toString(),
          checkInLng: lng?.toString(),
          locationVerified,
          status: "present",
        })
        .where(eq(attendance.id, existing.id));
    } else {
      await db.insert(attendance).values({
        employeeId,
        companyId,
        date: today,
        checkInTime: now,
        checkInSelfieUrl: selfieUrl,
        checkInLat: lat?.toString(),
        checkInLng: lng?.toString(),
        locationVerified,
        status: isLate ? "late" : "present",
      });
    }
  } else {
    await db
      .update(attendance)
      .set({
        checkOutTime: now,
        checkOutSelfieUrl: selfieUrl,
        checkOutLat: lat?.toString(),
        checkOutLng: lng?.toString(),
      })
      .where(and(eq(attendance.employeeId, employeeId), eq(attendance.date, today)));
  }

  return NextResponse.json({ success: true });
}
