import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import AddEmployeeButton from "@/components/AddEmployeeButton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; department?: string; status?: string }>;
}

export default async function EmployeesPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { search, department, status } = await searchParams;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, billing_status")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  let query = supabase
    .from("employees")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("name", `%${search}%`);
  if (department) query = query.eq("department", department);
  if (status) query = query.eq("status", status);

  const { data: employees } = await query;

  const isSuspended = company.billing_status === "suspended";

  return (
    <div>
      <PageHeader
        title="Employees"
        breadcrumbs={[{ label: company.name }, { label: "Employees" }]}
        actions={
          <AddEmployeeButton slug={slug} companyId={company.id} disabled={isSuspended} />
        }
      />

      {/* Filters */}
      <form className="flex gap-3 mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name..."
          className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560] bg-white w-64"
        />
        <select
          name="department"
          defaultValue={department}
          className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560]"
        >
          <option value="">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
        <select
          name="status"
          defaultValue={status}
          className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          type="submit"
          className="bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d2d4e] transition"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      {!employees || employees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees yet"
          description="Add your first employee to get started with attendance and payroll."
          action={<AddEmployeeButton slug={slug} companyId={company.id} disabled={isSuspended} />}
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Role / Dept</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Joining Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Salary</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="px-4 py-3">
                    <Link href={`/app/${slug}/admin/employees/${emp.id}`} className="flex items-center gap-3 group">
                      <Avatar name={emp.name} photoUrl={emp.profile_photo_url} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#E94560] transition">{emp.name}</p>
                        <p className="text-xs text-[#64748B]">{emp.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#1A1A1A]">{emp.role || "—"}</p>
                    <p className="text-xs text-[#64748B]">{emp.department || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">
                    {emp.date_of_joining ? formatDate(emp.date_of_joining) : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">
                    {formatCurrency(emp.base_salary)}
                    <span className="text-xs text-[#64748B] font-normal">/{emp.salary_type === "daily" ? "day" : "mo"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={emp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
