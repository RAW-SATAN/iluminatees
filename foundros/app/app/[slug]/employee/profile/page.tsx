import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, employees } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import EmployeeProfileForm from "@/components/EmployeeProfileForm";
import { formatDate } from "@/lib/utils";
import { User, Briefcase, Calendar, Phone, Mail, Hash } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export default async function EmployeeProfilePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const [employee] = await db.select().from(employees).where(and(eq(employees.companyId, company.id), eq(employees.userId, (session.user as any).id))).limit(1);
  if (!employee) redirect("/login");

  const infoItems = [
    { icon: Mail, label: "Email", value: employee.email },
    { icon: Phone, label: "Phone", value: employee.phone || "—" },
    { icon: Briefcase, label: "Role", value: employee.role || "—" },
    { icon: User, label: "Department", value: employee.department || "—" },
    { icon: Calendar, label: "Date of Joining", value: employee.dateOfJoining ? formatDate(employee.dateOfJoining) : "—" },
    { icon: Hash, label: "Employee ID", value: employee.employeeCode || employee.id.slice(0, 8).toUpperCase() },
  ];

  return (
    <div className="p-4 space-y-4 pb-8">
      {/* Avatar + Name */}
      <div className="pt-2 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center text-white text-xl font-bold shrink-0">
          {employee.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">{employee.name}</h2>
          <p className="text-sm text-[#64748B]">{employee.role || "Employee"}</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3">
            <item.icon className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-[#94A3B8]">{item.label}</p>
              <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Phone */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Update Phone Number</h3>
        <EmployeeProfileForm employeeId={employee.id} currentPhone={employee.phone || ""} />
      </div>
    </div>
  );
}
