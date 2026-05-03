"use client";

import { Download } from "lucide-react";
import { formatCurrency, getMonthName } from "@/lib/utils";

interface Props {
  slip: any;
  company: any;
  month: number;
  year: number;
}

export default function SalarySlipPDF({ slip, company, month, year }: Props) {
  function handleDownload() {
    // Generate PDF via API route
    const url = `/api/payroll/slip-pdf?slipId=${slip.id}`;
    window.open(url, "_blank");
  }

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 text-xs font-medium text-[#E94560] border border-[#E94560] px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
    >
      <Download className="w-3.5 h-3.5" />
      Download Slip
    </button>
  );
}
