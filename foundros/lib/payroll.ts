import { daysInMonth } from "./utils";

export interface PayrollInput {
  baseSalary: number;
  salaryType: "monthly" | "daily";
  pfApplicable: boolean;
  esiApplicable: boolean;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  month: number;
  year: number;
  state?: string; // for professional tax
}

export interface PayrollResult {
  grossSalary: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  professionalTax: number;
  tds: number;
  lopAmount: number;
  totalDeductions: number;
  netSalary: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
}

function getProfessionalTax(grossSalary: number, state: string): number {
  const ptStates = ["maharashtra", "karnataka"];
  if (!ptStates.includes(state.toLowerCase())) return 0;
  if (grossSalary > 10000) return 200;
  return 0;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const {
    baseSalary,
    salaryType,
    pfApplicable,
    esiApplicable,
    presentDays,
    leaveDays,
    absentDays,
    month,
    year,
    state = "other",
  } = input;

  const workingDays = daysInMonth(year, month);

  // LOP (Loss of Pay) deduction
  const dailyRate = baseSalary / workingDays;
  const lopAmount = Math.round(dailyRate * absentDays);

  // Gross after LOP
  const grossSalary = Math.max(0, baseSalary - lopAmount);

  // Earnings breakdown
  const basic = Math.round(grossSalary * 0.5);          // 50% of gross
  const hra = Math.round(grossSalary * 0.2);             // 20% of gross
  const specialAllowance = grossSalary - basic - hra;    // remainder

  // PF: 12% of basic (only if gross > 0)
  const pfEmployee = pfApplicable ? Math.round(basic * 0.12) : 0;
  const pfEmployer = pfApplicable ? Math.round(basic * 0.12) : 0;

  // ESI: only if gross <= 21000
  const esiEligible = esiApplicable && grossSalary <= 21000;
  const esiEmployee = esiEligible ? Math.round(grossSalary * 0.0075) : 0;
  const esiEmployer = esiEligible ? Math.round(grossSalary * 0.0325) : 0;

  // Professional Tax
  const professionalTax = getProfessionalTax(grossSalary, state);

  // TDS: 0 for MVP
  const tds = 0;

  const totalDeductions = pfEmployee + esiEmployee + professionalTax + tds;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    grossSalary,
    basic,
    hra,
    specialAllowance,
    pfEmployee,
    pfEmployer,
    esiEmployee,
    esiEmployer,
    professionalTax,
    tds,
    lopAmount,
    totalDeductions,
    netSalary,
    workingDays,
    presentDays,
    leaveDays,
    absentDays,
  };
}
