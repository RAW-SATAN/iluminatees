"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  employeeId: string;
  companyId: string;
  date: string;
  currentStatus: string;
  attendanceId?: string;
}

const statuses = ["present", "absent", "half_day", "late", "leave"];

export default function AttendanceOverrideButton({ employeeId, companyId, date, currentStatus, attendanceId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus: string) {
    setLoading(true);
    await fetch("/api/attendance/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, companyId, date, status: newStatus, attendanceId }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] disabled:opacity-60 capitalize"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  );
}
