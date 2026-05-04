import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees, attendance, leaves, dailyInsights } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { Users, Clock, DollarSign, CalendarX, Brain } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminDashboard({ params }: Props) {
  const { slug } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [empRows, todayAttendance, pendingLeaves, [insight]] = await Promise.all([
    db.select({ id: employees.id, baseSalary: employees.baseSalary }).from(employees).where(and(eq(employees.companyId, company.id), eq(employees.status, "active"))),
    db.select({ status: attendance.status }).from(attendance).where(and(eq(attendance.companyId, company.id), eq(attendance.date, today))),
    db.select({ id: leaves.id }).from(leaves).where(and(eq(leaves.companyId, company.id), eq(leaves.status, "pending"))),
    db.select({ insight: dailyInsights.insight, createdAt: dailyInsights.createdAt }).from(dailyInsights).where(and(eq(dailyInsights.companyId, company.id), eq(dailyInsights.date, today))).limit(1),
  ]);

  const totalEmployees = empRows.length;
  const totalSalaryDue = empRows.reduce((sum, e) => sum + parseFloat(e.baseSalary || "0"), 0);
  const pendingLeaveCount = pendingLeaves.length;

  const presentCount = todayAttendance.filter((a) => a.status === "present").length;
  const absentCount = todayAttendance.filter((a) => a.status === "absent").length;
  const lateCount = todayAttendance.filter((a) => a.status === "late").length;
  const onLeaveCount = todayAttendance.filter((a) => a.status === "leave").length;

  const trialEndsAt = company.trialEndsAt ? new Date(company.trialEndsAt) : null;
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
      {company.billingStatus === "trial" && daysLeftInTrial !== null && daysLeftInTrial <= 5 && (
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
