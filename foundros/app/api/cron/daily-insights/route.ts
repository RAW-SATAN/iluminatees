import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import Anthropic from "@anthropic-ai/sdk";
import { sendTrialEndingSoonEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const adminClient = getAdminClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Get all active companies
  const { data: companies } = await adminClient
    .from("companies")
    .select("id, owner_id, trial_ends_at, billing_status")
    .in("billing_status", ["active", "trial"]);

  if (!companies) return NextResponse.json({ processed: 0 });

  let processed = 0;

  for (const company of companies) {
    try {
      // Send trial ending emails (day 11 and day 13)
      if (company.billing_status === "trial" && company.trial_ends_at) {
        const trialEnd = new Date(company.trial_ends_at);
        const daysLeft = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (daysLeft === 3 || daysLeft === 1) {
          const { data: owner } = await adminClient.auth.admin.getUserById(company.owner_id);
          const { data: profile } = await adminClient.from("profiles").select("full_name, companies(slug)").eq("id", company.owner_id).single() as any;
          const { count: empCount } = await adminClient.from("employees").select("id", { count: "exact" }).eq("company_id", company.id).eq("status", "active");

          if (owner?.user?.email && profile?.companies?.slug) {
            await sendTrialEndingSoonEmail({
              to: owner.user.email,
              name: profile.full_name || "Founder",
              companyName: profile.companies.name || "",
              slug: profile.companies.slug,
              employeeCount: empCount || 0,
              daysLeft,
            });
          }
        }
      }

      // Check if insight already exists for today
      const { data: existingInsight } = await adminClient
        .from("daily_insights")
        .select("id")
        .eq("company_id", company.id)
        .eq("date", today)
        .single();

      if (existingInsight) continue;

      // Gather attendance data
      const { data: attendance } = await adminClient
        .from("attendance")
        .select("status")
        .eq("company_id", company.id)
        .eq("date", today);

      const { count: totalEmployees } = await adminClient
        .from("employees")
        .select("id", { count: "exact" })
        .eq("company_id", company.id)
        .eq("status", "active");

      const { data: pendingLeaves } = await adminClient
        .from("leaves")
        .select("id")
        .eq("company_id", company.id)
        .eq("status", "pending");

      // Find employees with 3+ absences this month
      const monthStart = today.slice(0, 7) + "-01";
      const { data: absences } = await adminClient
        .from("attendance")
        .select("employee_id, employees(name)")
        .eq("company_id", company.id)
        .eq("status", "absent")
        .gte("date", monthStart) as any;

      const absentCounts: Record<string, { name: string; count: number }> = {};
      for (const a of absences || []) {
        const id = a.employee_id;
        if (!absentCounts[id]) absentCounts[id] = { name: a.employees?.name || "Unknown", count: 0 };
        absentCounts[id].count++;
      }
      const highAbsence = Object.values(absentCounts)
        .filter((e) => e.count >= 3)
        .map((e) => e.name);

      const presentCount = attendance?.filter((a) => ["present", "late"].includes(a.status)).length || 0;
      const absentCount = attendance?.filter((a) => a.status === "absent").length || 0;
      const lateCount = attendance?.filter((a) => a.status === "late").length || 0;
      const presentPct = totalEmployees ? Math.round((presentCount / totalEmployees) * 100) : 0;

      const prompt = `You are an HR assistant for an Indian company. Based on this data, give 3 short insights in plain English (not bullet points, just 3 sentences):
Attendance today: ${presentPct}% present, ${lateCount} late, ${absentCount} absent.
Pending leave requests: ${pendingLeaves?.length || 0}.
Employees with 3+ absences this month: ${highAbsence.length > 0 ? highAbsence.join(", ") : "None"}.
Keep it under 60 words total. Be direct, practical, no fluff.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      });

      const insight = (response.content[0] as any).text;
      const tokensUsed = (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);

      await adminClient.from("daily_insights").insert({
        company_id: company.id,
        date: today,
        insight,
        tokens_used: tokensUsed,
      });

      // Log usage
      await adminClient.from("usage_logs").insert({
        company_id: company.id,
        feature: "daily_insight",
        tokens_input: response.usage.input_tokens,
        tokens_output: response.usage.output_tokens,
      });

      processed++;
    } catch (err) {
      console.error(`Failed to generate insight for company ${company.id}:`, err);
    }
  }

  // Check grace period expiry → suspend
  const { data: graceCompanies } = await adminClient
    .from("companies")
    .select("id")
    .eq("billing_status", "grace_period")
    .lt("grace_ends_at", new Date().toISOString());

  for (const c of graceCompanies || []) {
    await adminClient.from("companies").update({ billing_status: "suspended" }).eq("id", c.id);
  }

  return NextResponse.json({ processed, graceExpired: graceCompanies?.length || 0 });
}
