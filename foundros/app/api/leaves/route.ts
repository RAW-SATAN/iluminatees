import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { employeeId, companyId, leaveType, fromDate, toDate, reason } = await req.json();

  const { error } = await supabase.from("leaves").insert({
    employee_id: employeeId,
    company_id: companyId,
    leave_type: leaveType,
    from_date: fromDate,
    to_date: toDate,
    reason,
    status: "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
