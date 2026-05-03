import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId, action } = await req.json();

  switch (action) {
    case "extend_trial": {
      const { data: company } = await adminClient.from("companies").select("trial_ends_at").eq("id", companyId).single();
      const current = company?.trial_ends_at ? new Date(company.trial_ends_at) : new Date();
      const extended = new Date(current);
      extended.setDate(extended.getDate() + 7);
      await adminClient.from("companies").update({ trial_ends_at: extended.toISOString() }).eq("id", companyId);
      break;
    }
    case "suspend":
      await adminClient.from("companies").update({ billing_status: "suspended" }).eq("id", companyId);
      break;
    case "unsuspend":
      await adminClient.from("companies").update({ billing_status: "active" }).eq("id", companyId);
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
