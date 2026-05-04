import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrollRuns, salarySlips } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getMonthName } from "@/lib/utils";
import { sendSalarySlipEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { companyId, month, year, calculations } = await req.json();

  const totalGross = calculations.reduce((s: number, c: any) => s + c.grossSalary, 0);
  const totalDeductions = calculations.reduce((s: number, c: any) => s + c.totalDeductions, 0);
  const totalNet = calculations.reduce((s: number, c: any) => s + c.netSalary, 0);

  const [existing] = await db
    .select({ id: payrollRuns.id })
    .from(payrollRuns)
    .where(and(eq(payrollRuns.companyId, companyId), eq(payrollRuns.month, month), eq(payrollRuns.year, year)))
    .limit(1);

  let runId: string;

  if (existing) {
    await db
      .update(payrollRuns)
      .set({
        status: "processed",
        totalGross: totalGross.toString(),
        totalDeductions: totalDeductions.toString(),
        totalNet: totalNet.toString(),
        processedAt: new Date(),
        processedBy: userId,
      })
      .where(eq(payrollRuns.id, existing.id));
    runId = existing.id;
  } else {
    const [run] = await db
      .insert(payrollRuns)
      .values({
        companyId,
        month,
        year,
        status: "processed",
        totalGross: totalGross.toString(),
        totalDeductions: totalDeductions.toString(),
        totalNet: totalNet.toString(),
        processedAt: new Date(),
        processedBy: userId,
      })
      .returning({ id: payrollRuns.id });
    runId = run.id;
  }

  const slipValues = calculations.map((c: any) => ({
    payrollRunId: runId,
    employeeId: c.employee.id,
    companyId,
    grossSalary: c.grossSalary.toString(),
    basic: c.basic.toString(),
    hra: c.hra.toString(),
    specialAllowance: c.specialAllowance.toString(),
    pfEmployee: c.pfEmployee.toString(),
    pfEmployer: c.pfEmployer.toString(),
    esiEmployee: c.esiEmployee.toString(),
    esiEmployer: c.esiEmployer.toString(),
    professionalTax: c.professionalTax.toString(),
    tds: c.tds.toString(),
    lopAmount: c.lopAmount.toString(),
    totalDeductions: c.totalDeductions.toString(),
    netSalary: c.netSalary.toString(),
    workingDays: c.workingDays,
    presentDays: c.presentDays,
    leaveDays: c.leaveDays,
    absentDays: c.absentDays,
  }));

  await db.insert(salarySlips).values(slipValues).onConflictDoNothing();

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

  return NextResponse.json({ runId });
}
