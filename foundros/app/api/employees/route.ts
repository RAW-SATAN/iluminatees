import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sendEmployeeInviteEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { companyId, name, email, phone, role, department, dateOfJoining, baseSalary, salaryType, pfApplicable, esiApplicable } = body;

    // Check employee limit
    const { data: company } = await supabase
      .from("companies")
      .select("employee_limit, billing_status")
      .eq("id", companyId)
      .single();

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    if (company.billing_status === "suspended") {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const { count } = await supabase
      .from("employees")
      .select("id", { count: "exact" })
      .eq("company_id", companyId)
      .eq("status", "active");

    if (count && count >= company.employee_limit) {
      return NextResponse.json(
        { error: `Employee limit of ${company.employee_limit} reached. Please upgrade your plan.` },
        { status: 403 }
      );
    }

    // Insert employee
    const { data: employee, error: empError } = await adminClient
      .from("employees")
      .insert({
        company_id: companyId,
        name,
        email,
        phone,
        role,
        department,
        date_of_joining: dateOfJoining || null,
        base_salary: baseSalary || 0,
        salary_type: salaryType || "monthly",
        pf_applicable: pfApplicable ?? true,
        esi_applicable: esiApplicable ?? true,
        status: "active",
      })
      .select()
      .single();

    if (empError) {
      return NextResponse.json({ error: empError.message }, { status: 500 });
    }

    // Send invite email via magic link
    const { data: { company: companyData } } = await supabase
      .from("companies")
      .select("name, slug")
      .eq("id", companyId)
      .single() as any;

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/invite?email=${encodeURIComponent(email)}&company=${companyData?.slug || ""}`;

    sendEmployeeInviteEmail({
      to: email,
      employeeName: name,
      companyName: companyData?.name || "Your Company",
      inviteLink,
    }).catch(console.error);

    return NextResponse.json({ employee });
  } catch (err) {
    console.error("Add employee error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
