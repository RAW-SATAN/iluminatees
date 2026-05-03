import { createClient } from "@/lib/supabase/server";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import SuperCompanyActions from "@/components/SuperCompanyActions";

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function SuperCompaniesPage({ searchParams }: Props) {
  const { search, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("companies")
    .select("*, profiles!companies_owner_id_fkey(full_name, phone)")
    .order("created_at", { ascending: false });

  if (search) query = query.ilike("name", `%${search}%`);
  if (status) query = query.eq("billing_status", status);

  const { data: companies } = await query;

  // Get employee counts
  const { data: empCounts } = await supabase.from("employees").select("company_id, id");
  const empMap = (empCounts || []).reduce((acc: any, e) => {
    acc[e.company_id] = (acc[e.company_id] || 0) + 1;
    return acc;
  }, {});

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
            {companies?.map((company: any) => (
              <tr key={company.id} className="hover:bg-[#F8FAFC] transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1A1A1A]">{company.name}</p>
                  <p className="text-xs text-[#64748B]">{company.slug}</p>
                </td>
                <td className="px-4 py-3 text-[#64748B]">{company.profiles?.full_name || "—"}</td>
                <td className="px-4 py-3 capitalize text-[#1A1A1A]">{company.plan}</td>
                <td className="px-4 py-3 text-[#1A1A1A]">{empMap[company.id] || 0} / {company.employee_limit}</td>
                <td className="px-4 py-3"><Badge label={company.billing_status} /></td>
                <td className="px-4 py-3 text-[#64748B]">{formatDate(company.created_at)}</td>
                <td className="px-4 py-3">
                  <SuperCompanyActions companyId={company.id} currentStatus={company.billing_status} trialEndsAt={company.trial_ends_at} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
