import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMPLOYEE_LIMITS: Record<string, number> = {
  starter: 10,
  growth: 25,
  pro: 50,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { companyId, planId, razorpay_subscription_id } = await req.json();

  const { error } = await supabase
    .from("companies")
    .update({
      plan: planId,
      billing_status: "active",
      razorpay_subscription_id,
      employee_limit: EMPLOYEE_LIMITS[planId] || 10,
    })
    .eq("id", companyId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
