import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminClient } from "@/lib/supabase/admin";
import { sendPaymentFailedEmail, sendAccountSuspendedEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Verify webhook signature
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

  const { data: company } = await adminClient
    .from("companies")
    .select("id, name, owner_id")
    .eq("razorpay_subscription_id", subscriptionId)
    .single();

  if (!company) return NextResponse.json({ received: true });

  switch (event.event) {
    case "subscription.charged": {
      await adminClient.from("companies").update({ billing_status: "active", grace_ends_at: null }).eq("id", company.id);
      break;
    }

    case "subscription.halted": {
      const graceEnd = new Date();
      graceEnd.setDate(graceEnd.getDate() + 3);
      await adminClient.from("companies").update({
        billing_status: "grace_period",
        grace_ends_at: graceEnd.toISOString(),
      }).eq("id", company.id);

      // Get owner email to send payment failed email
      const { data: owner } = await adminClient.auth.admin.getUserById(company.owner_id);
      if (owner?.user?.email) {
        const { data: profile } = await adminClient.from("profiles").select("full_name, companies(slug)").eq("id", company.owner_id).single() as any;
        sendPaymentFailedEmail({
          to: owner.user.email,
          name: profile?.full_name || "Founder",
          slug: profile?.companies?.slug || "",
        }).catch(console.error);
      }
      break;
    }

    case "subscription.cancelled": {
      await adminClient.from("companies").update({ billing_status: "suspended" }).eq("id", company.id);

      const { data: owner } = await adminClient.auth.admin.getUserById(company.owner_id);
      if (owner?.user?.email) {
        const { data: profile } = await adminClient.from("profiles").select("full_name, companies(slug)").eq("id", company.owner_id).single() as any;
        sendAccountSuspendedEmail({
          to: owner.user.email,
          name: profile?.full_name || "Founder",
          slug: profile?.companies?.slug || "",
        }).catch(console.error);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
