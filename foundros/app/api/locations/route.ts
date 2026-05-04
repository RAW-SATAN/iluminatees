import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { officeLocations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId, name, lat, lng, radiusMeters, isDefault } = await req.json();

  if (isDefault) {
    await db
      .update(officeLocations)
      .set({ isDefault: false })
      .where(eq(officeLocations.companyId, companyId));
  }

  await db.insert(officeLocations).values({
    companyId,
    name,
    lat: lat.toString(),
    lng: lng.toString(),
    radiusMeters: radiusMeters || 100,
    isDefault: isDefault || false,
  });

  return NextResponse.json({ success: true });
}
