import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckInWidget from "@/components/CheckInWidget";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmployeeSelfServicePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", company.id)
    .eq("user_id", user.id)
    .single();

  if (!employee) redirect("/login");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

  const [
    { data: todayAttendance },
    { data: monthAttendance },
    { data: officeLocations },
    { data: leaveHistory },
    { data: salarySlips },
  ] = await Promise.all([
    supabase.from("attendance").select("*").eq("employee_id", employee.id).eq("date", today).single(),
    supabase.from("attendance").select("date, status").eq("employee_id", employee.id).gte("date", monthStart).lte("date", monthEnd),
    supabase.from("office_locations").select("*").eq("company_id", company.id),
    supabase.from("leaves").select("*").eq("employee_id", employee.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("salary_slips").select("*, payroll_runs(month, year, status)").eq("employee_id", employee.id).order("created_at", { ascending: false }).limit(6),
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
        officeLocations={officeLocations || []}
      />

      {/* Attendance Calendar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">My Attendance</h3>
        <AttendanceCalendar attendance={monthAttendance || []} year={year} month={month} />
      </div>

      {/* Apply Leave */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Apply for Leave</h3>
        <ApplyLeaveForm employeeId={employee.id} companyId={company.id} />
      </div>

      {/* Leave History */}
      {leaveHistory && leaveHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3">Leave History</h3>
          <div className="space-y-2">
            {leaveHistory.map((leave: any) => (
              <div key={leave.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] capitalize">{leave.leave_type}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(leave.from_date)} – {formatDate(leave.to_date)}</p>
                </div>
                <Badge label={leave.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Slips */}
      {salarySlips && salarySlips.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3">My Salary Slips</h3>
          <div className="space-y-2">
            {salarySlips.map((slip: any) => (
              <div key={slip.id} className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {slip.payroll_runs
                      ? `${new Date(2000, slip.payroll_runs.month - 1).toLocaleString("en-IN", { month: "long" })} ${slip.payroll_runs.year}`
                      : "—"}
                  </p>
                  <p className="text-xs text-[#64748B]">Net: {formatCurrency(slip.net_salary)}</p>
                </div>
                {slip.slip_pdf_url && (
                  <a
                    href={slip.slip_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#E94560] border border-[#E94560] px-2.5 py-1 rounded-lg hover:bg-red-50 transition"
                  >
                    Download
                  </a>
                )}
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
