import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function SuspendedBanner({ slug }: { slug: string }) {
  return (
    <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Your account is suspended. You can view data but cannot add employees, run payroll, or track attendance.</span>
      </div>
      <Link
        href={`/app/${slug}/billing/reactivate`}
        className="ml-4 shrink-0 bg-white text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
      >
        Update Payment
      </Link>
    </div>
  );
}
