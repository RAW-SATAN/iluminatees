import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { companies, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendPaymentFailedEmail, sendAccountSuspendedEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const subscriptionId = event.payload?.subscription?.entity?.id;
  if (!subscriptionId) return NextResponse.json({ received: true });

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.razorpaySubscriptionId, subscriptionId))
    .limit(1);

  if (!company) return NextResponse.json({ received: true });

  switch (event.event) {
    case "subscription.charged": {
      await db.update(companies).set({ billingStatus: "active", graceEndsAt: null }).where(eq(companies.id, company.id));
      break;
    }

    case "subscription.halted": {
      const graceEnd = new Date();
      graceEnd.setDate(graceEnd.getDate() + 3);
      await db.update(companies).set({ billingStatus: "grace_period", graceEndsAt: graceEnd }).where(eq(companies.id, company.id));

      const [owner] = await db.select().from(users).where(eq(users.id, company.ownerId)).limit(1);
      if (owner?.email) {
        sendPaymentFailedEmail({
          to: owner.email,
          name: owner.name || "Founder",
          slug: company.slug,
        }).catch(console.error);
      }
      break;
    }

    case "subscription.cancelled": {
      await db.update(companies).set({ billingStatus: "suspended" }).where(eq(companies.id, company.id));

      const [owner] = await db.select().from(users).where(eq(users.id, company.ownerId)).limit(1);
      if (owner?.email) {
        sendAccountSuspendedEmail({
          to: owner.email,
          name: owner.name || "Founder",
          slug: company.slug,
        }).catch(console.error);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
