import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId, name, lat, lng, radiusMeters, isDefault } = await req.json();

  if (isDefault) {
    await supabase.from("office_locations").update({ is_default: false }).eq("company_id", companyId);
  }

  const { error } = await supabase.from("office_locations").insert({
    company_id: companyId,
    name,
    lat,
    lng,
    radius_meters: radiusMeters || 100,
    is_default: isDefault || false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
