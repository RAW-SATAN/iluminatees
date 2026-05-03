import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import PayrollRunClient from "@/components/PayrollRunClient";
import { daysInMonth, getMonthName } from "@/lib/utils";
import { calculatePayroll } from "@/lib/payroll";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function RunPayrollPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { month: mParam, year: yParam } = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  const month = mParam ? parseInt(mParam) : now.getMonth() + 1;
  const year = yParam ? parseInt(yParam) : now.getFullYear();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, state")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  // Check if already run
  const { data: existing } = await supabase
    .from("payroll_runs")
    .select("id, status")
    .eq("company_id", company.id)
    .eq("month", month)
    .eq("year", year)
    .single();

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", company.id)
    .eq("status", "active");

  // Get attendance for the month
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${daysInMonth(year, month)}`;

  const { data: attendance } = await supabase
    .from("attendance")
    .select("employee_id, status")
    .eq("company_id", company.id)
    .gte("date", monthStart)
    .lte("date", monthEnd);

  // Calculate payroll for each employee
  const calculations = (employees || []).map((emp) => {
    const empAttendance = attendance?.filter((a) => a.employee_id === emp.id) || [];
    const presentDays = empAttendance.filter((a) => ["present", "late"].includes(a.status)).length;
    const leaveDays = empAttendance.filter((a) => a.status === "leave").length;
    const absentDays = daysInMonth(year, month) - presentDays - leaveDays;

    const result = calculatePayroll({
      baseSalary: emp.base_salary,
      salaryType: emp.salary_type as "monthly" | "daily",
      pfApplicable: emp.pf_applicable,
      esiApplicable: emp.esi_applicable,
      presentDays,
      leaveDays,
      absentDays: Math.max(0, absentDays),
      month,
      year,
      state: company.state || "other",
    });

    return { employee: emp, ...result };
  });

  return (
    <div>
      <PageHeader
        title={`Run Payroll — ${getMonthName(month)} ${year}`}
        breadcrumbs={[
          { label: company.name },
          { label: "Payroll", href: `/app/${slug}/admin/payroll` },
          { label: "Run Payroll" },
        ]}
      />

      {existing && existing.status !== "draft" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 font-medium">
            Payroll for {getMonthName(month)} {year} has already been {existing.status}.
          </p>
          <a href={`/app/${slug}/admin/payroll/${existing.id}`} className="text-sm text-amber-700 underline mt-1 inline-block">
            View payroll run →
          </a>
        </div>
      ) : null}

      <PayrollRunClient
        slug={slug}
        companyId={company.id}
        month={month}
        year={year}
        calculations={calculations}
        existingRunId={existing?.id}
      />
    </div>
  );
}
