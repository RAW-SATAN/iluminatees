import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, phone } = await req.json();
  if (!employeeId) return NextResponse.json({ error: "Missing employeeId" }, { status: 400 });

  const userId = (session.user as any).id;
  const [emp] = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);
  if (!emp || emp.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.update(employees).set({ phone: phone || null }).where(eq(employees.id, employeeId));

  return NextResponse.json({ success: true });
}
