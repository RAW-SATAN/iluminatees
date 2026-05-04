import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaves, employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendLeaveApprovedEmail, sendLeaveRejectedEmail } from "@/lib/email/sender";
import { formatDate, getLeaveBalance } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leaveId, action, reason } = await req.json();
  const userId = (session.user as any).id;

  const [leave] = await db.select().from(leaves).where(eq(leaves.id, leaveId)).limit(1);
  if (!leave) return NextResponse.json({ error: "Leave not found" }, { status: 404 });

  await db
    .update(leaves)
    .set({
      status: action === "approve" ? "approved" : "rejected",
      approvedBy: userId,
      rejectionReason: action === "reject" ? reason : null,
    })
    .where(eq(leaves.id, leaveId));

  const [emp] = await db
    .select({ name: employees.name, email: employees.email, dateOfJoining: employees.dateOfJoining })
    .from(employees)
    .where(eq(employees.id, leave.employeeId))
    .limit(1);

  if (emp?.email) {
    if (action === "approve") {
      const balance = emp.dateOfJoining
        ? getLeaveBalance(emp.dateOfJoining, leave.leaveType as any)
        : 0;
      sendLeaveApprovedEmail({
        to: emp.email,
        employeeName: emp.name,
        fromDate: formatDate(leave.fromDate),
        toDate: formatDate(leave.toDate),
        leaveType: leave.leaveType,
        remainingBalance: balance,
      }).catch(console.error);
    } else {
      sendLeaveRejectedEmail({
        to: emp.email,
        employeeName: emp.name,
        fromDate: formatDate(leave.fromDate),
        toDate: formatDate(leave.toDate),
        leaveType: leave.leaveType,
        reason,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
