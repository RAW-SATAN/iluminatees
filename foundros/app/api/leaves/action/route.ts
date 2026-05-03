import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendLeaveApprovedEmail, sendLeaveRejectedEmail } from "@/lib/email/sender";
import { formatDate, getLeaveBalance } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leaveId, action, reason } = await req.json();

  const { data: leave } = await supabase
    .from("leaves")
    .select("*, employees(name, email, date_of_joining)")
    .eq("id", leaveId)
    .single() as any;

  if (!leave) return NextResponse.json({ error: "Leave not found" }, { status: 404 });

  const { error } = await supabase
    .from("leaves")
    .update({
      status: action === "approve" ? "approved" : "rejected",
      approved_by: user.id,
      rejection_reason: action === "reject" ? reason : null,
    })
    .eq("id", leaveId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const emp = leave.employees;
  if (emp?.email) {
    if (action === "approve") {
      const balance = emp.date_of_joining
        ? getLeaveBalance(emp.date_of_joining, leave.leave_type as any)
        : 0;
      sendLeaveApprovedEmail({
        to: emp.email,
        employeeName: emp.name,
        fromDate: formatDate(leave.from_date),
        toDate: formatDate(leave.to_date),
        leaveType: leave.leave_type,
        remainingBalance: balance,
      }).catch(console.error);
    } else {
      sendLeaveRejectedEmail({
        to: emp.email,
        employeeName: emp.name,
        fromDate: formatDate(leave.from_date),
        toDate: formatDate(leave.to_date),
        leaveType: leave.leave_type,
        reason,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
