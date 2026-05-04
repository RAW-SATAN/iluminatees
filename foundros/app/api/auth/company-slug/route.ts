import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  if (!companyId) return NextResponse.json({ slug: null });

  const [company] = await db
    .select({ slug: companies.slug })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return NextResponse.json({ slug: company?.slug ?? null });
}
