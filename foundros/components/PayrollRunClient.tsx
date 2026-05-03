"use client";

import { useState } from "react";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Calculation {
  employee: {
    id: string;
    name: string;
    department: string | null;
    role: string | null;
  };
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

interface Props {
  slug: string;
  companyId: string;
  month: number;
  year: number;
  calculations: Calculation[];
  existingRunId?: string;
}

export default function PayrollRunClient({ slug, companyId, month, year, calculations, existingRunId }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const totalGross = calculations.reduce((s, c) => s + c.grossSalary, 0);
  const totalDeductions = calculations.reduce((s, c) => s + c.totalDeductions, 0);
  const totalNet = calculations.reduce((s, c) => s + c.netSalary, 0);

  async function handleProcess() {
    if (!confirm(`Process payroll for ${getMonthName(month)} ${year}? This will generate salary slips and send emails.`)) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payroll/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, month, year, calculations }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to process payroll");
        return;
      }

      const data = await res.json();
      setDone(true);
      setTimeout(() => router.push(`/app/${slug}/admin/payroll/${data.runId}`), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#1A1A1A]">Payroll Processed!</h3>
        <p className="text-[#64748B] mt-2">Salary slips generated. Redirecting...</p>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
        <p className="text-[#64748B]">No active employees found. Add employees before running payroll.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Gross</p>
          <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(totalGross)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Total Deductions</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B]">Net Payout</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalNet)}</p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Employee</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">Days</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">Gross</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">PF (Emp)</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">ESI (Emp)</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">Prof Tax</th>
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#64748B] uppercase">LOP</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {calculations.map((c) => (
              <tr key={c.employee.id} className="hover:bg-[#F8FAFC] transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1A1A1A]">{c.employee.name}</p>
                  <p className="text-xs text-[#64748B]">{c.employee.department || c.employee.role || "—"}</p>
                </td>
                <td className="px-3 py-3 text-right text-[#64748B]">
                  {c.presentDays}P / {c.leaveDays}L / {c.absentDays}A
                </td>
                <td className="px-3 py-3 text-right font-medium text-[#1A1A1A]">{formatCurrency(c.grossSalary)}</td>
                <td className="px-3 py-3 text-right text-red-600">{c.pfEmployee > 0 ? formatCurrency(c.pfEmployee) : "—"}</td>
                <td className="px-3 py-3 text-right text-red-600">{c.esiEmployee > 0 ? formatCurrency(c.esiEmployee) : "—"}</td>
                <td className="px-3 py-3 text-right text-red-600">{c.professionalTax > 0 ? formatCurrency(c.professionalTax) : "—"}</td>
                <td className="px-3 py-3 text-right text-orange-600">{c.lopAmount > 0 ? formatCurrency(c.lopAmount) : "—"}</td>
                <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(c.netSalary)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC]">
              <td colSpan={2} className="px-4 py-3 font-semibold text-[#1A1A1A]">TOTAL ({calculations.length} employees)</td>
              <td className="px-3 py-3 text-right font-semibold">{formatCurrency(totalGross)}</td>
              <td colSpan={4} />
              <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(totalNet)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleProcess}
          disabled={loading}
          className="flex items-center gap-2 bg-[#E94560] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#d63d57] transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Processing..." : `Confirm & Process Payroll for ${getMonthName(month)} ${year}`}
        </button>
      </div>
    </div>
  );
}
