import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { getMonthName } from "@/lib/utils";
import { sendSalarySlipEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { companyId, month, year, calculations } = await req.json();

  const totalGross = calculations.reduce((s: number, c: any) => s + c.grossSalary, 0);
  const totalDeductions = calculations.reduce((s: number, c: any) => s + c.totalDeductions, 0);
  const totalNet = calculations.reduce((s: number, c: any) => s + c.netSalary, 0);

  // Create payroll run
  const { data: run, error: runError } = await adminClient
    .from("payroll_runs")
    .upsert({
      company_id: companyId,
      month,
      year,
      status: "processed",
      total_gross: totalGross,
      total_deductions: totalDeductions,
      total_net: totalNet,
      processed_at: new Date().toISOString(),
      processed_by: user.id,
    }, { onConflict: "company_id,month,year" })
    .select()
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: runError?.message || "Failed to create payroll run" }, { status: 500 });
  }

  // Create salary slips for each employee
  const slipInserts = calculations.map((c: any) => ({
    payroll_run_id: run.id,
    employee_id: c.employee.id,
    company_id: companyId,
    gross_salary: c.grossSalary,
    basic: c.basic,
    hra: c.hra,
    special_allowance: c.specialAllowance,
    pf_employee: c.pfEmployee,
    pf_employer: c.pfEmployer,
    esi_employee: c.esiEmployee,
    esi_employer: c.esiEmployer,
    professional_tax: c.professionalTax,
    tds: c.tds,
    lop_amount: c.lopAmount,
    total_deductions: c.totalDeductions,
    net_salary: c.netSalary,
    working_days: c.workingDays,
    present_days: c.presentDays,
    leave_days: c.leaveDays,
    absent_days: c.absentDays,
  }));

  const { error: slipError } = await adminClient.from("salary_slips").insert(slipInserts);
  if (slipError) {
    console.error("Slip insert error:", slipError);
  }

  // Send salary slip emails (non-blocking)
  const monthName = getMonthName(month);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  for (const c of calculations) {
    sendSalarySlipEmail({
      to: c.employee.email,
      employeeName: c.employee.name,
      companyName: "",
      month: monthName,
      year,
      netSalary: c.netSalary,
      downloadUrl: `${appUrl}/app/employee`,
    }).catch(console.error);
  }

  return NextResponse.json({ runId: run.id });
}
