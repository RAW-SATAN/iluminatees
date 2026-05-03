import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import LeaveActionButtons from "@/components/LeaveActionButtons";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function LeavesPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { status } = await searchParams;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  let query = supabase
    .from("leaves")
    .select("*, employees(name, profile_photo_url, department)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: leaves } = await query;

  const pendingCount = leaves?.filter((l) => l.status === "pending").length || 0;

  return (
    <div>
      <PageHeader
        title={`Leave Requests${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
        breadcrumbs={[{ label: company.name }, { label: "Leaves" }]}
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {["", "pending", "approved", "rejected"].map((s) => (
          <a
            key={s}
            href={s ? `?status=${s}` : "?"}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              status === s || (!status && !s)
                ? "bg-[#1A1A2E] text-white"
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-gray-50"
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </a>
        ))}
      </div>

      {!leaves || leaves.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <p className="text-[#64748B] text-sm">No leave requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((leave: any) => (
            <div key={leave.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={leave.employees?.name || "?"} photoUrl={leave.employees?.profile_photo_url} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{leave.employees?.name}</p>
                    <p className="text-xs text-[#64748B]">{leave.employees?.department || "—"}</p>
                  </div>
                </div>
                <Badge label={leave.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#64748B]">Type</p>
                  <p className="font-medium text-[#1A1A1A] capitalize">{leave.leave_type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">From</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.from_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">To</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.to_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Applied</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.created_at)}</p>
                </div>
              </div>
              {leave.reason && (
                <p className="mt-2 text-sm text-[#64748B] italic">"{leave.reason}"</p>
              )}
              {leave.status === "pending" && (
                <div className="mt-4">
                  <LeaveActionButtons leaveId={leave.id} employeeEmail={leave.employees?.email} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
