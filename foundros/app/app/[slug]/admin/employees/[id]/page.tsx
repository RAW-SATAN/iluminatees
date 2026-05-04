import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees, attendance, salarySlips, payrollRuns } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { formatCurrency, formatDate, getLeaveBalance } from "@/lib/utils";
import { Mail, Phone, Calendar, DollarSign, Building2 } from "lucide-react";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export default async function EmployeeProfilePage({ params }: Props) {
  const { slug, id } = await params;

  const [company] = await db.select({ id: companies.id, name: companies.name }).from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [employee] = await db.select().from(employees).where(and(eq(employees.id, id), eq(employees.companyId, company.id))).limit(1);
  if (!employee) redirect(`/app/${slug}/admin/employees`);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

  const [attendanceRows, slipRows] = await Promise.all([
    db.select({ date: attendance.date, status: attendance.status })
      .from(attendance)
      .where(and(eq(attendance.employeeId, id), eq(attendance.companyId, company.id), gte(attendance.date, monthStart), lte(attendance.date, monthEnd))),
    db.select({
      id: salarySlips.id,
      netSalary: salarySlips.netSalary,
      slipPdfUrl: salarySlips.slipPdfUrl,
      month: payrollRuns.month,
      year: payrollRuns.year,
    })
      .from(salarySlips)
      .leftJoin(payrollRuns, eq(salarySlips.payrollRunId, payrollRuns.id))
      .where(and(eq(salarySlips.employeeId, id), eq(salarySlips.companyId, company.id)))
      .orderBy(desc(salarySlips.createdAt))
      .limit(6),
  ]);

  const casualBalance = employee.dateOfJoining ? getLeaveBalance(employee.dateOfJoining, "casual") : 12;
  const sickBalance = employee.dateOfJoining ? getLeaveBalance(employee.dateOfJoining, "sick") : 12;
  const earnedBalance = employee.dateOfJoining ? getLeaveBalance(employee.dateOfJoining, "earned") : 15;

  return (
    <div>
      <PageHeader
        title={employee.name}
        breadcrumbs={[
          { label: company.name },
          { label: "Employees", href: `/app/${slug}/admin/employees` },
          { label: employee.name },
        ]}
        actions={
          <Link
            href={`/app/${slug}/admin/employees/${id}/edit`}
            className="border border-[#E2E8F0] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Edit Profile
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 text-center">
            <Avatar name={employee.name} photoUrl={employee.profilePhotoUrl} size="lg" />
            <h2 className="text-lg font-semibold text-[#1A1A1A] mt-3">{employee.name}</h2>
            <p className="text-sm text-[#64748B]">{employee.role || "—"}</p>
            <div className="mt-3">
              <Badge label={employee.status} />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
            <h3 className="font-semibold text-[#1A1A1A] text-sm">Contact & Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-sm text-[#1A1A1A] truncate">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#64748B] shrink-0" />
                  <span className="text-sm text-[#1A1A1A]">{employee.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-sm text-[#1A1A1A]">{employee.department || "—"}</span>
              </div>
              {employee.dateOfJoining && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
                  <span className="text-sm text-[#1A1A1A]">{formatDate(employee.dateOfJoining)}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-[#64748B] shrink-0" />
                <span className="text-sm text-[#1A1A1A] font-medium">
                  {formatCurrency(employee.baseSalary)}/{employee.salaryType === "daily" ? "day" : "mo"}
                </span>
              </div>
            </div>
          </div>

          {/* Leave Balance */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-semibold text-[#1A1A1A] text-sm mb-4">Leave Balance (Pro-rated)</h3>
            <div className="space-y-3">
              {[
                { type: "Casual", used: 0, total: casualBalance, color: "bg-blue-500" },
                { type: "Sick", used: 0, total: sickBalance, color: "bg-yellow-500" },
                { type: "Earned", used: 0, total: earnedBalance, color: "bg-green-500" },
              ].map(({ type, used, total, color }) => (
                <div key={type}>
                  <div className="flex justify-between text-xs text-[#64748B] mb-1">
                    <span>{type}</span>
                    <span>{used}/{total} days</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full`}
                      style={{ width: total > 0 ? `${((total - used) / total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Calendar */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Attendance — {new Date(year, month - 1).toLocaleString("en-IN", { month: "long", year: "numeric" })}</h3>
            <AttendanceCalendar attendance={attendanceRows} year={year} month={month} />
          </div>

          {/* Salary History */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Salary History</h3>
            {slipRows.length > 0 ? (
              <div className="space-y-2">
                {slipRows.map((slip) => (
                  <div key={slip.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {slip.month
                          ? `${new Date(2000, slip.month - 1).toLocaleString("en-IN", { month: "long" })} ${slip.year}`
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#1A1A1A]">{formatCurrency(slip.netSalary)}</span>
                      {slip.slipPdfUrl && (
                        <a
                          href={slip.slipPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#E94560] hover:underline"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">No salary slips yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
