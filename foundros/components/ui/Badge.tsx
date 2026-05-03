import { cn } from "@/lib/utils";

type Variant = "success" | "error" | "warning" | "info" | "neutral" | "primary";

const variants: Record<Variant, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-600",
  primary: "bg-[#1A1A2E]/10 text-[#1A1A2E]",
};

export function statusToBadge(status: string): Variant {
  const map: Record<string, Variant> = {
    active: "success", present: "success", approved: "success", paid: "success", processed: "success",
    inactive: "neutral", absent: "error", rejected: "error", suspended: "error",
    late: "warning", half_day: "warning", grace_period: "warning", pending: "warning",
    trial: "info", draft: "info", leave: "info",
  };
  return map[status] || "neutral";
}

export default function Badge({ label, variant }: { label: string; variant?: Variant }) {
  const v = variant || statusToBadge(label.toLowerCase());
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", variants[v])}>
      {label.replace(/_/g, " ")}
    </span>
  );
}
