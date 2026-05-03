"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  employeeId: string;
  companyId: string;
}

export default function LeaveFormClient({ employeeId, companyId }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      employeeId,
      companyId,
      leaveType: form.get("leaveType"),
      fromDate: form.get("fromDate"),
      toDate: form.get("toDate"),
      reason: form.get("reason"),
    };

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to apply for leave");
        return;
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => { setSuccess(false); router.refresh(); }, 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-semibold">Leave request submitted! ✓</p>
        <p className="text-sm text-[#64748B] mt-1">Your manager will review and respond.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Leave Type</label>
        <select name="leaveType" required className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm bg-white">
          <option value="casual">Casual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="earned">Earned Leave</option>
          <option value="unpaid">Unpaid Leave</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">From</label>
          <input name="fromDate" type="date" required className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">To</label>
          <input name="toDate" type="date" required className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Reason</label>
        <textarea name="reason" rows={2} placeholder="Brief reason..." className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm resize-none" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E94560] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Apply for Leave"}
      </button>
    </form>
  );
}
