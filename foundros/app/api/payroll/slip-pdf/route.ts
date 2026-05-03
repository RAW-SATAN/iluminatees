import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getMonthName, formatCurrency } from "@/lib/utils";

// Generates a minimal HTML-based payslip and returns it as a downloadable HTML file
// For production, swap with puppeteer or @react-pdf/renderer
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const slipId = searchParams.get("slipId");

  if (!slipId) return NextResponse.json({ error: "Missing slipId" }, { status: 400 });

  const { data: slip } = await supabase
    .from("salary_slips")
    .select("*, employees(name, email, department, role, date_of_joining, employee_code, pan), payroll_runs(month, year), companies(name, address, gstin, logo_url)")
    .eq("id", slipId)
    .single() as any;

  if (!slip) return NextResponse.json({ error: "Slip not found" }, { status: 404 });

  const emp = slip.employees;
  const company = slip.companies;
  const run = slip.payroll_runs;
  const monthName = getMonthName(run.month);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Payslip - ${emp.name} - ${monthName} ${run.year}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; font-size: 13px; color: #1A1A1A; background: white; padding: 40px; }
  .header { text-align: center; border-bottom: 2px solid #1A1A2E; padding-bottom: 16px; margin-bottom: 20px; }
  .company-name { font-size: 22px; font-weight: bold; color: #1A1A2E; }
  .company-address { font-size: 12px; color: #64748B; margin-top: 4px; }
  .slip-title { font-size: 16px; font-weight: bold; color: #E94560; margin: 16px 0 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background: #F8FAFC; padding: 16px; border-radius: 8px; }
  .info-item label { font-size: 11px; color: #64748B; display: block; }
  .info-item span { font-weight: 500; font-size: 13px; }
  .salary-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .salary-table th { background: #1A1A2E; color: white; padding: 10px 12px; text-align: left; font-size: 12px; }
  .salary-table td { padding: 8px 12px; border-bottom: 1px solid #E2E8F0; }
  .salary-table tr:last-child td { border-bottom: none; font-weight: bold; background: #F8FAFC; }
  .net-salary { text-align: center; padding: 20px; background: #1A1A2E; color: white; border-radius: 8px; margin: 20px 0; }
  .net-salary .label { font-size: 14px; color: rgba(255,255,255,0.7); }
  .net-salary .amount { font-size: 32px; font-weight: bold; color: white; }
  .attendance-row { display: flex; gap: 24px; background: #F8FAFC; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; }
  .att-item label { font-size: 11px; color: #64748B; display: block; }
  .att-item span { font-weight: 600; font-size: 15px; }
  .footer { text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 16px; margin-top: 20px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div class="company-name">${company.name}</div>
  ${company.address ? `<div class="company-address">${company.address}</div>` : ""}
  ${company.gstin ? `<div class="company-address">GSTIN: ${company.gstin}</div>` : ""}
</div>

<div class="slip-title">Payslip for ${monthName} ${run.year}</div>

<div class="info-grid">
  <div class="info-item"><label>Employee Name</label><span>${emp.name}</span></div>
  <div class="info-item"><label>Employee ID</label><span>${emp.employee_code || slipId.slice(0, 8).toUpperCase()}</span></div>
  <div class="info-item"><label>Department</label><span>${emp.department || "—"}</span></div>
  <div class="info-item"><label>Designation</label><span>${emp.role || "—"}</span></div>
  <div class="info-item"><label>Date of Joining</label><span>${emp.date_of_joining || "—"}</span></div>
  <div class="info-item"><label>PAN</label><span>${emp.pan || "—"}</span></div>
</div>

<table class="salary-table">
  <thead>
    <tr>
      <th style="width:50%">Earnings</th>
      <th style="width:25%;text-align:right">Amount (₹)</th>
      <th style="width:25%;text-align:right"></th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border-right:1px solid #E2E8F0">Basic</td><td style="text-align:right;border-right:1px solid #E2E8F0">${formatCurrency(slip.basic)}</td><td></td></tr>
    <tr><td style="border-right:1px solid #E2E8F0">HRA</td><td style="text-align:right;border-right:1px solid #E2E8F0">${formatCurrency(slip.hra)}</td><td></td></tr>
    <tr><td style="border-right:1px solid #E2E8F0">Special Allowance</td><td style="text-align:right;border-right:1px solid #E2E8F0">${formatCurrency(slip.special_allowance)}</td><td></td></tr>
    <tr><td style="border-right:1px solid #E2E8F0"><strong>Gross Total</strong></td><td style="text-align:right;border-right:1px solid #E2E8F0"><strong>${formatCurrency(slip.gross_salary)}</strong></td><td></td></tr>
  </tbody>
</table>

<table class="salary-table">
  <thead>
    <tr>
      <th style="width:50%">Deductions</th>
      <th style="width:50%;text-align:right">Amount (₹)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>PF (Employee)</td><td style="text-align:right">${formatCurrency(slip.pf_employee)}</td></tr>
    <tr><td>PF (Employer)</td><td style="text-align:right">${formatCurrency(slip.pf_employer)}</td></tr>
    <tr><td>ESI (Employee)</td><td style="text-align:right">${formatCurrency(slip.esi_employee)}</td></tr>
    <tr><td>Professional Tax</td><td style="text-align:right">${formatCurrency(slip.professional_tax)}</td></tr>
    <tr><td>TDS</td><td style="text-align:right">${formatCurrency(slip.tds)}</td></tr>
    ${slip.lop_amount > 0 ? `<tr><td>Loss of Pay (LOP)</td><td style="text-align:right">${formatCurrency(slip.lop_amount)}</td></tr>` : ""}
    <tr><td><strong>Total Deductions</strong></td><td style="text-align:right"><strong>${formatCurrency(slip.total_deductions)}</strong></td></tr>
  </tbody>
</table>

<div class="net-salary">
  <div class="label">Net Salary</div>
  <div class="amount">${formatCurrency(slip.net_salary)}</div>
</div>

<div class="attendance-row">
  <div class="att-item"><label>Working Days</label><span>${slip.working_days}</span></div>
  <div class="att-item"><label>Present</label><span>${slip.present_days}</span></div>
  <div class="att-item"><label>Absent</label><span>${slip.absent_days}</span></div>
  <div class="att-item"><label>Leave</label><span>${slip.leave_days}</span></div>
</div>

<div class="footer">
  This is a computer-generated payslip and does not require a signature.<br>
  Generated by FoundrOS &bull; ${new Date().toLocaleDateString("en-IN")}
</div>

<script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `inline; filename="payslip-${emp.name.replace(/\s+/g, "-")}-${monthName}-${run.year}.html"`,
    },
  });
}
