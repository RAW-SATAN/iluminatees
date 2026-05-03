import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { Users, Clock, DollarSign, CalendarX, Brain, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminDashboard({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Fetch all data in parallel
  const [
    { data: employees },
    { data: todayAttendance },
    { data: pendingLeaves },
    { data: insight },
  ] = await Promise.all([
    supabase.from("employees").select("id, base_salary, status").eq("company_id", company.id).eq("status", "active"),
    supabase.from("attendance").select("status").eq("company_id", company.id).eq("date", today),
    supabase.from("leaves").select("id").eq("company_id", company.id).eq("status", "pending"),
    supabase.from("daily_insights").select("insight, created_at").eq("company_id", company.id).eq("date", today).single(),
  ]);

  const totalEmployees = employees?.length || 0;
  const totalSalaryDue = employees?.reduce((sum, e) => sum + (e.base_salary || 0), 0) || 0;
  const pendingLeaveCount = pendingLeaves?.length || 0;

  const presentCount = todayAttendance?.filter((a) => a.status === "present").length || 0;
  const absentCount = todayAttendance?.filter((a) => a.status === "absent").length || 0;
  const lateCount = todayAttendance?.filter((a) => a.status === "late").length || 0;
  const onLeaveCount = todayAttendance?.filter((a) => a.status === "leave").length || 0;

  const trialEndsAt = company.trial_ends_at ? new Date(company.trial_ends_at) : null;
  const daysLeftInTrial = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: company.name }, { label: "Dashboard" }]}
      />

      {/* Trial Banner */}
      {company.billing_status === "trial" && daysLeftInTrial !== null && daysLeftInTrial <= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <p className="text-amber-800 text-sm font-medium">
            Trial ends in <strong>{daysLeftInTrial} day{daysLeftInTrial !== 1 ? "s" : ""}</strong>. Upgrade to keep your data.
          </p>
          <a
            href={`/app/${slug}/billing/subscribe`}
            className="text-xs font-semibold text-amber-900 bg-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-300 transition"
          >
            Upgrade
          </a>
        </div>
      )}

      {/* Today's Attendance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Present Today"
          value={presentCount}
          icon={Clock}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Absent Today"
          value={absentCount}
          icon={CalendarX}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
        <StatCard
          label="Late Today"
          value={lateCount}
          icon={Clock}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        <StatCard
          label="On Leave"
          value={onLeaveCount}
          icon={CalendarX}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Employees"
          value={totalEmployees}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          label="Salary Due This Month"
          value={formatCurrency(totalSalaryDue)}
          icon={DollarSign}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          label="Pending Leave Requests"
          value={pendingLeaveCount}
          icon={CalendarX}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-[#E94560]" />
          <h3 className="font-semibold">Today&apos;s AI Insight</h3>
          <span className="text-xs text-white/40 ml-auto">
            {insight?.created_at ? formatDate(insight.created_at) : "Updated daily at 11 PM"}
          </span>
        </div>
        {insight?.insight ? (
          <p className="text-white/80 text-sm leading-relaxed">{insight.insight}</p>
        ) : (
          <p className="text-white/40 text-sm">
            AI insights are generated nightly. Check back tomorrow for your first insight.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={`/app/${slug}/admin/employees`}
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#E94560] hover:shadow-sm transition group"
        >
          <Users className="w-6 h-6 text-[#E94560] mb-3" />
          <h4 className="font-semibold text-[#1A1A1A]">Manage Employees</h4>
          <p className="text-sm text-[#64748B] mt-1">{totalEmployees} active employees</p>
        </a>
        <a
          href={`/app/${slug}/admin/attendance`}
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#E94560] hover:shadow-sm transition group"
        >
          <Clock className="w-6 h-6 text-[#E94560] mb-3" />
          <h4 className="font-semibold text-[#1A1A1A]">Today&apos;s Attendance</h4>
          <p className="text-sm text-[#64748B] mt-1">{presentCount}/{totalEmployees} present</p>
        </a>
        <a
          href={`/app/${slug}/admin/payroll`}
          className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#E94560] hover:shadow-sm transition group"
        >
          <DollarSign className="w-6 h-6 text-[#E94560] mb-3" />
          <h4 className="font-semibold text-[#1A1A1A]">Run Payroll</h4>
          <p className="text-sm text-[#64748B] mt-1">Salary due: {formatCurrency(totalSalaryDue)}</p>
        </a>
      </div>
    </div>
  );
}
