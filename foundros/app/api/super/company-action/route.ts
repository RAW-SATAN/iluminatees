import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId, action } = await req.json();

  switch (action) {
    case "extend_trial": {
      const [company] = await db.select({ trialEndsAt: companies.trialEndsAt }).from(companies).where(eq(companies.id, companyId)).limit(1);
      const current = company?.trialEndsAt ? new Date(company.trialEndsAt) : new Date();
      const extended = new Date(current);
      extended.setDate(extended.getDate() + 7);
      await db.update(companies).set({ trialEndsAt: extended }).where(eq(companies.id, companyId));
      break;
    }
    case "suspend":
      await db.update(companies).set({ billingStatus: "suspended" }).where(eq(companies.id, companyId));
      break;
    case "unsuspend":
      await db.update(companies).set({ billingStatus: "active" }).where(eq(companies.id, companyId));
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
