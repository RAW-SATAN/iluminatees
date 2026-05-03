import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/email/sender";
import { getAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  try {
    const { companyName, ownerName, email, phone, password } = await req.json();

    if (!companyName || !ownerName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 });
    }

    const userId = authData.user.id;

    // Generate unique slug
    let slug = slugify(companyName);
    const { data: existing } = await supabaseAdmin
      .from("companies")
      .select("slug")
      .like("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length}`;
    }

    // Create company
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        name: companyName,
        slug,
        owner_id: userId,
        plan: "starter",
        employee_limit: 10,
        billing_status: "trial",
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select()
      .single();

    if (companyError || !company) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      company_id: company.id,
      role: "owner",
      full_name: ownerName,
      phone,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: email, name: ownerName, companyName, slug }).catch(console.error);

    return NextResponse.json({ slug, companyId: company.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
