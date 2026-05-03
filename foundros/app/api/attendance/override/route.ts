import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, date, status, attendanceId } = await req.json();

  if (attendanceId) {
    const { error } = await supabase
      .from("attendance")
      .update({ status, notes: `Manual override by admin` })
      .eq("id", attendanceId)
      .eq("company_id", companyId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from("attendance").upsert({
      employee_id: employeeId,
      company_id: companyId,
      date,
      status,
      notes: "Manual override by admin",
    }, { onConflict: "employee_id,date" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
