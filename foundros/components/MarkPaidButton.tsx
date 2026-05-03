"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function MarkPaidButton({ runId }: { runId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMarkPaid() {
    if (!confirm("Mark this payroll as paid?")) return;
    setLoading(true);
    await fetch(`/api/payroll/${runId}/mark-paid`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkPaid}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60"
    >
      <CheckCircle2 className="w-4 h-4" />
      {loading ? "Updating..." : "Mark as Paid"}
    </button>
  );
}
