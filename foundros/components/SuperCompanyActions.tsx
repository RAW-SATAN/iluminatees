"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  companyId: string;
  currentStatus: string;
  trialEndsAt: string | null;
}

export default function SuperCompanyActions({ companyId, currentStatus, trialEndsAt }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function action(type: string, body?: object) {
    setLoading(type);
    await fetch("/api/super/company-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, action: type, ...body }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      {trialEndsAt && (
        <button
          onClick={() => action("extend_trial")}
          disabled={!!loading}
          className="text-xs text-blue-600 border border-blue-200 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-60"
        >
          {loading === "extend_trial" ? "..." : "+7 days"}
        </button>
      )}
      {currentStatus === "suspended" ? (
        <button
          onClick={() => action("unsuspend")}
          disabled={!!loading}
          className="text-xs text-green-600 border border-green-200 bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100 disabled:opacity-60"
        >
          {loading === "unsuspend" ? "..." : "Unsuspend"}
        </button>
      ) : (
        <button
          onClick={() => action("suspend")}
          disabled={!!loading}
          className="text-xs text-red-600 border border-red-200 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 disabled:opacity-60"
        >
          {loading === "suspend" ? "..." : "Suspend"}
        </button>
      )}
    </div>
  );
}
