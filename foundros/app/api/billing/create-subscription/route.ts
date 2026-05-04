import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";

const PLAN_IDS: Record<string, string> = {
  starter: process.env.RAZORPAY_STARTER_PLAN_ID || "",
  growth: process.env.RAZORPAY_GROWTH_PLAN_ID || "",
  pro: process.env.RAZORPAY_PRO_PLAN_ID || "",
};

const EMPLOYEE_LIMITS: Record<string, number> = {
  starter: 10,
  growth: 25,
  pro: 50,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId, planId } = await req.json();

  const planRazorpayId = PLAN_IDS[planId];
  if (!planRazorpayId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planRazorpayId,
      total_count: 120, // 10 years
      quantity: 1,
    } as any);

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create subscription" }, { status: 500 });
  }
}
