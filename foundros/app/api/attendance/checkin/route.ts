import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, mode, lat, lng, locationVerified, selfieBase64 } = await req.json();

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString();

  // Upload selfie to Supabase Storage
  const base64Data = selfieBase64.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const path = `attendance/${companyId}/${employeeId}/${today}-${mode}.jpg`;

  const { data: uploadData, error: uploadError } = await adminClient.storage
    .from("attendance")
    .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

  let selfieUrl: string | null = null;
  if (!uploadError && uploadData) {
    const { data: { publicUrl } } = adminClient.storage.from("attendance").getPublicUrl(path);
    selfieUrl = publicUrl;
  }

  if (mode === "checkin") {
    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("attendance")
        .update({
          check_in_time: now,
          check_in_selfie_url: selfieUrl,
          check_in_lat: lat,
          check_in_lng: lng,
          location_verified: locationVerified,
          status: "present",
        })
        .eq("id", existing.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const checkInHour = new Date().getHours();
      const checkInMin = new Date().getMinutes();
      const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMin > 30);

      const { error } = await supabase.from("attendance").insert({
        employee_id: employeeId,
        company_id: companyId,
        date: today,
        check_in_time: now,
        check_in_selfie_url: selfieUrl,
        check_in_lat: lat,
        check_in_lng: lng,
        location_verified: locationVerified,
        status: isLate ? "late" : "present",
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("attendance")
      .update({
        check_out_time: now,
        check_out_selfie_url: selfieUrl,
        check_out_lat: lat,
        check_out_lng: lng,
      })
      .eq("employee_id", employeeId)
      .eq("date", today);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
