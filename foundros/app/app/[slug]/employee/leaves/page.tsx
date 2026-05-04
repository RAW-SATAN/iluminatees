import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees, leaves } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Badge from "@/components/ui/Badge";
import LeaveFormClient from "@/components/LeaveFormClient";
import { formatDate, getLeaveBalance } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

export default async function EmployeeLeavesPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [employee] = await db.select().from(employees).where(and(eq(employees.companyId, company.id), eq(employees.userId, (session.user as any).id))).limit(1);
  if (!employee) redirect("/login");

  const allLeaves = await db.select().from(leaves).where(eq(leaves.employeeId, employee.id)).orderBy(desc(leaves.createdAt));

  const doj = employee.dateOfJoining || new Date().toISOString().split("T")[0];
  const casualBalance = getLeaveBalance(doj, "casual");
  const sickBalance = getLeaveBalance(doj, "sick");
  const earnedBalance = getLeaveBalance(doj, "earned");

  return (
    <div className="p-4 space-y-4 pb-8">
      <h2 className="text-xl font-bold text-[#1A1A1A] pt-2">Leave Management</h2>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Casual", value: casualBalance, color: "bg-blue-50 text-blue-700" },
          { label: "Sick", value: sickBalance, color: "bg-yellow-50 text-yellow-700" },
          { label: "Earned", value: earnedBalance, color: "bg-green-50 text-green-700" },
        ].map((b) => (
          <div key={b.label} className={`rounded-2xl p-3 text-center ${b.color}`}>
            <p className="text-2xl font-bold">{b.value}</p>
            <p className="text-xs font-medium mt-0.5">{b.label}</p>
          </div>
        ))}
      </div>

      {/* Apply Leave */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Apply for Leave</h3>
        <LeaveFormClient employeeId={employee.id} companyId={company.id} />
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Leave History</h3>
        {allLeaves.length === 0 ? (
          <p className="text-sm text-[#94A3B8] text-center py-6">No leave requests yet</p>
        ) : (
          <div className="space-y-0">
            {allLeaves.map((leave) => (
              <div key={leave.id} className="flex items-start justify-between py-3 border-b border-[#E2E8F0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] capitalize">{leave.leaveType} Leave</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{formatDate(leave.fromDate)} – {formatDate(leave.toDate)}</p>
                  {leave.reason && <p className="text-xs text-[#94A3B8] mt-0.5 italic">"{leave.reason}"</p>}
                  {leave.rejectionReason && (
                    <p className="text-xs text-red-500 mt-0.5">Reason: {leave.rejectionReason}</p>
                  )}
                </div>
                <Badge label={leave.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
