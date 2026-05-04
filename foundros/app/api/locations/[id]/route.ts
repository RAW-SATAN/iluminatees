import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { officeLocations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(officeLocations).where(eq(officeLocations.id, id));
  return NextResponse.json({ success: true });
}
