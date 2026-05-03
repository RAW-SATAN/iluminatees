import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { formatCurrency, getMonthName } from "@/lib/utils";
import MarkPaidButton from "@/components/MarkPaidButton";
import SalarySlipPDF from "@/components/SalarySlipPDF";

interface Props {
  params: Promise<{ slug: string; runId: string }>;
}

export default async function PayrollRunDetailPage({ params }: Props) {
  const { slug, runId } = await params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, address, gstin, logo_url")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  const { data: run } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", runId)
    .eq("company_id", company.id)
    .single();

  if (!run) redirect(`/app/${slug}/admin/payroll`);

  const { data: slips } = await supabase
    .from("salary_slips")
    .select("*, employees(name, email, department, role, date_of_joining, employee_code, pan)")
    .eq("payroll_run_id", runId)
    .eq("company_id", company.id)
    .order("created_at");

  return (
    <div>
      <PageHeader
        title={`Payroll — ${getMonthName(run.month)} ${run.year}`}
        breadcrumbs={[
          { label: company.name },
          { label: "Payroll", href: `/app/${slug}/admin/payroll` },
          { label: `${getMonthName(run.month)} ${run.year}` },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {run.status !== "paid" && <MarkPaidButton runId={runId} />}
            <Badge label={run.status} />
          </div>
        }
      />

      {/* Run Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Gross</p>
          <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(run.total_gross)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Deductions</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(run.total_deductions)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Net Payout</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(run.total_net)}</p>
        </div>
      </div>

      {/* Salary Slips */}
      <div className="space-y-3">
        {slips?.map((slip: any) => (
          <div key={slip.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[#1A1A1A]">{slip.employees?.name}</p>
                <p className="text-sm text-[#64748B]">{slip.employees?.department || slip.employees?.role || "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Net Salary</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(slip.net_salary)}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-[#64748B]">Gross</p><p className="font-medium">{formatCurrency(slip.gross_salary)}</p></div>
              <div><p className="text-xs text-[#64748B]">PF (Employee)</p><p className="font-medium text-red-500">{formatCurrency(slip.pf_employee)}</p></div>
              <div><p className="text-xs text-[#64748B]">ESI (Employee)</p><p className="font-medium text-red-500">{formatCurrency(slip.esi_employee)}</p></div>
              <div><p className="text-xs text-[#64748B]">Prof Tax</p><p className="font-medium text-red-500">{formatCurrency(slip.professional_tax)}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
              <span>{slip.present_days}P</span>
              <span>·</span>
              <span>{slip.leave_days}L</span>
              <span>·</span>
              <span>{slip.absent_days}A</span>
              <span>·</span>
              <span>{slip.working_days} working days</span>
            </div>
            <div className="mt-3 flex justify-end">
              <SalarySlipPDF
                slip={slip}
                company={company}
                month={run.month}
                year={run.year}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
