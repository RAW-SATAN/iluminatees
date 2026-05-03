import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import AttendanceOverrideButton from "@/components/AttendanceOverrideButton";
import ExportAttendanceButton from "@/components/ExportAttendanceButton";
import { MapPin, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function AttendancePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { date } = await searchParams;
  const supabase = await createClient();

  const selectedDate = date || new Date().toISOString().split("T")[0];

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  const { data: employees } = await supabase
    .from("employees")
    .select("id, name, profile_photo_url, department")
    .eq("company_id", company.id)
    .eq("status", "active");

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("company_id", company.id)
    .eq("date", selectedDate);

  const attendanceMap = new Map(attendance?.map((a) => [a.employee_id, a]) || []);

  const formatTime = (ts: string | null) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        breadcrumbs={[{ label: company.name }, { label: "Attendance" }]}
        actions={
          <ExportAttendanceButton companyId={company.id} />
        }
      />

      {/* Date Picker */}
      <form className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-[#64748B]">Date:</label>
        <input
          type="date"
          name="date"
          defaultValue={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560]"
          onChange={(e) => (window.location.href = `?date=${e.target.value}`)}
        />
        <span className="text-sm text-[#64748B]">
          {attendance?.filter((a) => a.status === "present" || a.status === "late").length || 0}/{employees?.length || 0} present
        </span>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Check In</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Check Out</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {employees?.map((emp) => {
              const record = attendanceMap.get(emp.id);
              return (
                <tr key={emp.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} photoUrl={emp.profile_photo_url} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{emp.name}</p>
                        <p className="text-xs text-[#64748B]">{emp.department || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {formatTime(record?.check_in_time || null)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {formatTime(record?.check_out_time || null)}
                  </td>
                  <td className="px-4 py-3">
                    {record ? (
                      record.location_verified ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Outside
                        </div>
                      )
                    ) : (
                      <span className="text-[#64748B] text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={record?.status || "absent"} />
                  </td>
                  <td className="px-4 py-3">
                    <AttendanceOverrideButton
                      employeeId={emp.id}
                      companyId={company.id}
                      date={selectedDate}
                      currentStatus={record?.status || "absent"}
                      attendanceId={record?.id}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
