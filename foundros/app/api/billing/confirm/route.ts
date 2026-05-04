import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const EMPLOYEE_LIMITS: Record<string, number> = {
  starter: 10,
  growth: 25,
  pro: 50,
};

export async function POST(req: NextRequest) {
  const { companyId, planId, razorpay_subscription_id } = await req.json();

  await db
    .update(companies)
    .set({
      plan: planId,
      billingStatus: "active",
      razorpaySubscriptionId: razorpay_subscription_id,
      employeeLimit: EMPLOYEE_LIMITS[planId] || 10,
    })
    .where(eq(companies.id, companyId));

  return NextResponse.json({ success: true });
}
