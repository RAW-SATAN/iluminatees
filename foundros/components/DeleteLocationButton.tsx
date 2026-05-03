"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteLocationButton({ locationId }: { locationId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this office location?")) return;
    setLoading(true);
    await fetch(`/api/locations/${locationId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600 transition disabled:opacity-60"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
