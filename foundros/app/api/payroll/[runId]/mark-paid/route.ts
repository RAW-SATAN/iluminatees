import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrollRuns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.update(payrollRuns).set({ status: "paid" }).where(eq(payrollRuns.id, runId));
  return NextResponse.json({ success: true });
}
