import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees, attendance, officeLocations, leaves, salarySlips, payrollRuns } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import CheckInWidget from "@/components/CheckInWidget";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmployeeSelfServicePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [company] = await db.select({ id: companies.id, name: companies.name }).from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [employee] = await db.select().from(employees).where(and(eq(employees.companyId, company.id), eq(employees.userId, userId))).limit(1);
  if (!employee) redirect("/login");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

  const [[todayAttendance], monthAttendanceRows, officeLocationRows, leaveHistory, slipRows] = await Promise.all([
    db.select().from(attendance).where(and(eq(attendance.employeeId, employee.id), eq(attendance.date, today))).limit(1),
    db.select({ date: attendance.date, status: attendance.status }).from(attendance).where(and(eq(attendance.employeeId, employee.id), gte(attendance.date, monthStart), lte(attendance.date, monthEnd))),
    db.select().from(officeLocations).where(eq(officeLocations.companyId, company.id)),
    db.select().from(leaves).where(eq(leaves.employeeId, employee.id)).orderBy(desc(leaves.createdAt)).limit(5),
    db.select({
      id: salarySlips.id,
      netSalary: salarySlips.netSalary,
      slipPdfUrl: salarySlips.slipPdfUrl,
      month: payrollRuns.month,
      year: payrollRuns.year,
      runStatus: payrollRuns.status,
    }).from(salarySlips).leftJoin(payrollRuns, eq(salarySlips.payrollRunId, payrollRuns.id)).where(eq(salarySlips.employeeId, employee.id)).orderBy(desc(salarySlips.createdAt)).limit(6),
  ]);

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Greeting */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-[#1A1A1A]">
          Hello, {employee.name.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-[#64748B]">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Check In/Out Widget */}
      <CheckInWidget
        employeeId={employee.id}
        companyId={company.id}
        todayRecord={todayAttendance as any}
        officeLocations={officeLocationRows}
      />

      {/* Attendance Calendar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">My Attendance</h3>
        <AttendanceCalendar attendance={monthAttendanceRows} year={year} month={month} />
      </div>

      {/* Apply Leave */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Apply for Leave</h3>
        <ApplyLeaveForm employeeId={employee.id} companyId={company.id} />
      </div>

      {/* Leave History */}
      {leaveHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3">Leave History</h3>
          <div className="space-y-2">
            {leaveHistory.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] capitalize">{leave.leaveType}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(leave.fromDate)} – {formatDate(leave.toDate)}</p>
                </div>
                <Badge label={leave.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Slips */}
      {slipRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3">My Salary Slips</h3>
          <div className="space-y-2">
            {slipRows.map((slip) => (
              <div key={slip.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {slip.month
                      ? `${new Date(2000, slip.month - 1).toLocaleString("en-IN", { month: "long" })} ${slip.year}`
                      : "—"}
                  </p>
                  <p className="text-xs text-[#64748B]">Net: {formatCurrency(slip.netSalary)}</p>
                </div>
                <a
                  href={`/api/payroll/slip-pdf?slipId=${slip.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#E94560] border border-[#E94560] px-2.5 py-1 rounded-lg hover:bg-red-50 transition"
                >
                  View Slip
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Apply Leave Form (client-side)
function ApplyLeaveForm({ employeeId, companyId }: { employeeId: string; companyId: string }) {
  return (
    <LeaveFormClient employeeId={employeeId} companyId={companyId} />
  );
}

import LeaveFormClient from "@/components/LeaveFormClient";
