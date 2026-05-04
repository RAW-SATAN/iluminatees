import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaves } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, leaveType, fromDate, toDate, reason } = await req.json();

  await db.insert(leaves).values({
    employeeId,
    companyId,
    leaveType,
    fromDate,
    toDate,
    reason,
    status: "pending",
  });

  return NextResponse.json({ success: true });
}
