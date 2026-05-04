import { db } from "@/lib/db";
import { companies, employees, users } from "@/lib/db/schema";
import { eq, ilike, count } from "drizzle-orm";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import SuperCompanyActions from "@/components/SuperCompanyActions";

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function SuperCompaniesPage({ searchParams }: Props) {
  const { search, status } = await searchParams;

  let query = db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      plan: companies.plan,
      billingStatus: companies.billingStatus,
      employeeLimit: companies.employeeLimit,
      trialEndsAt: companies.trialEndsAt,
      createdAt: companies.createdAt,
      ownerId: companies.ownerId,
    })
    .from(companies)
    .orderBy(companies.createdAt)
    .$dynamic();

  const allCompanies = await query;

  const filtered = allCompanies.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (status && c.billingStatus !== status) return false;
    return true;
  });

  const empCounts = await db.select({ companyId: employees.companyId, count: count() }).from(employees).groupBy(employees.companyId);
  const empMap = empCounts.reduce((acc: any, e) => { acc[e.companyId] = Number(e.count); return acc; }, {});

  const ownerIds = [...new Set(filtered.map((c) => c.ownerId))];
  const owners = ownerIds.length > 0
    ? await db.select({ id: users.id, name: users.name }).from(users)
    : [];
  const ownerMap = owners.reduce((acc: any, u) => { acc[u.id] = u.name; return acc; }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Companies</h1>

      <form className="flex gap-3 mb-6">
        <input name="search" defaultValue={search} placeholder="Search companies..." className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white w-64 focus:outline-none focus:ring-2 focus:ring-[#E94560]" />
        <select name="status" defaultValue={status} className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">All Status</option>
          <option value="trial">Trial</option>
          <option value="active">Active</option>
          <option value="grace_period">Grace Period</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" className="bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d2d4e]">Filter</button>
      </form>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Owner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Employees</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((company) => (
              <tr key={company.id} className="hover:bg-[#F8FAFC] transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1A1A1A]">{company.name}</p>
                  <p className="text-xs text-[#64748B]">{company.slug}</p>
                </td>
                <td className="px-4 py-3 text-[#64748B]">{ownerMap[company.ownerId] || "—"}</td>
                <td className="px-4 py-3 capitalize text-[#1A1A1A]">{company.plan}</td>
                <td className="px-4 py-3 text-[#1A1A1A]">{empMap[company.id] || 0} / {company.employeeLimit}</td>
                <td className="px-4 py-3"><Badge label={company.billingStatus} /></td>
                <td className="px-4 py-3 text-[#64748B]">{formatDate(company.createdAt.toISOString())}</td>
                <td className="px-4 py-3">
                  <SuperCompanyActions companyId={company.id} currentStatus={company.billingStatus} trialEndsAt={company.trialEndsAt?.toISOString() || null} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
