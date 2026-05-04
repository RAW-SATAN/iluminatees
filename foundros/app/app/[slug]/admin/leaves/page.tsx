import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, leaves, employees } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
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

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const allLeaves = await db
    .select({
      id: leaves.id,
      leaveType: leaves.leaveType,
      fromDate: leaves.fromDate,
      toDate: leaves.toDate,
      reason: leaves.reason,
      status: leaves.status,
      createdAt: leaves.createdAt,
      employeeName: employees.name,
      employeePhoto: employees.profilePhotoUrl,
      employeeDept: employees.department,
      employeeEmail: employees.email,
    })
    .from(leaves)
    .leftJoin(employees, eq(leaves.employeeId, employees.id))
    .where(eq(leaves.companyId, company.id))
    .orderBy(desc(leaves.createdAt));

  const filtered = status ? allLeaves.filter((l) => l.status === status) : allLeaves;
  const pendingCount = allLeaves.filter((l) => l.status === "pending").length;

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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <p className="text-[#64748B] text-sm">No leave requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((leave) => (
            <div key={leave.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={leave.employeeName || "?"} photoUrl={leave.employeePhoto} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{leave.employeeName}</p>
                    <p className="text-xs text-[#64748B]">{leave.employeeDept || "—"}</p>
                  </div>
                </div>
                <Badge label={leave.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#64748B]">Type</p>
                  <p className="font-medium text-[#1A1A1A] capitalize">{leave.leaveType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">From</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.fromDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">To</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.toDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Applied</p>
                  <p className="font-medium text-[#1A1A1A]">{formatDate(leave.createdAt.toISOString())}</p>
                </div>
              </div>
              {leave.reason && (
                <p className="mt-2 text-sm text-[#64748B] italic">"{leave.reason}"</p>
              )}
              {leave.status === "pending" && (
                <div className="mt-4">
                  <LeaveActionButtons leaveId={leave.id} employeeEmail={leave.employeeEmail || ""} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
