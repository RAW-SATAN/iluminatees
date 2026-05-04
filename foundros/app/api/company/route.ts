import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId, name, address, gstin, state } = await req.json();
  if (!companyId || !name) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const userId = (session.user as any).id;
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  if (!company || company.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [updated] = await db
    .update(companies)
    .set({ name, address: address || null, gstin: gstin || null, state: state || "other" })
    .where(eq(companies.id, companyId))
    .returning();

  return NextResponse.json({ company: updated });
}
