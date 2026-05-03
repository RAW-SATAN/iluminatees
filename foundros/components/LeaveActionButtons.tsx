"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface Props {
  leaveId: string;
  employeeEmail?: string;
}

export default function LeaveActionButtons({ leaveId, employeeEmail }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    await fetch("/api/leaves/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, action, reason: action === "reject" ? reason : undefined }),
    });
    setLoading(null);
    setShowRejectInput(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction("approve")}
        disabled={!!loading}
        className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100 transition disabled:opacity-60"
      >
        <Check className="w-4 h-4" />
        {loading === "approve" ? "Approving..." : "Approve"}
      </button>

      {showRejectInput ? (
        <div className="flex items-center gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm w-64"
          />
          <button
            onClick={() => handleAction("reject")}
            disabled={!!loading}
            className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-60"
          >
            {loading === "reject" ? "Rejecting..." : "Confirm"}
          </button>
          <button onClick={() => setShowRejectInput(false)} className="text-[#64748B] text-sm">Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => setShowRejectInput(true)}
          className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
      )}
    </div>
  );
}
