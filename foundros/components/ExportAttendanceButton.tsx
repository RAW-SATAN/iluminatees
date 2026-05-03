"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface Props {
  companyId: string;
}

export default function ExportAttendanceButton({ companyId }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  async function handleExport() {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/attendance/export?companyId=${companyId}&from=${fromDate}&to=${toDate}`
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${fromDate}-to-${toDate}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setShowPicker(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 border border-[#E2E8F0] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
      >
        <Download className="w-4 h-4" />
        Export Excel
      </button>

      {showPicker && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-4 z-10 w-64">
          <p className="text-sm font-medium text-[#1A1A1A] mb-3">Select date range</p>
          <div className="space-y-2 mb-3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={loading || !fromDate || !toDate}
            className="w-full bg-[#E94560] text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Exporting..." : "Download"}
          </button>
        </div>
      )}
    </div>
  );
}
