import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies, attendance, employees, leaves, dailyInsights, usageLogs, users } from "@/lib/db/schema";
import { eq, and, inArray, lt, gte, count } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { sendTrialEndingSoonEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const activeCompanies = await db
    .select()
    .from(companies)
    .where(inArray(companies.billingStatus, ["active", "trial"]));

  let processed = 0;

  for (const company of activeCompanies) {
    try {
      // Trial ending emails
      if (company.billingStatus === "trial" && company.trialEndsAt) {
        const trialEnd = new Date(company.trialEndsAt);
        const daysLeft = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

        if (daysLeft === 3 || daysLeft === 1) {
          const [owner] = await db.select().from(users).where(eq(users.id, company.ownerId)).limit(1);
          const [{ value: empCount }] = await db
            .select({ value: count() })
            .from(employees)
            .where(and(eq(employees.companyId, company.id), eq(employees.status, "active")));

          if (owner?.email) {
            await sendTrialEndingSoonEmail({
              to: owner.email,
              name: owner.name || "Founder",
              companyName: company.name,
              slug: company.slug,
              employeeCount: Number(empCount) || 0,
              daysLeft,
            });
          }
        }
      }

      // Check if insight already exists
      const [existingInsight] = await db
        .select({ id: dailyInsights.id })
        .from(dailyInsights)
        .where(and(eq(dailyInsights.companyId, company.id), eq(dailyInsights.date, today)))
        .limit(1);

      if (existingInsight) continue;

      // Gather attendance data
      const todayAttendance = await db
        .select({ status: attendance.status })
        .from(attendance)
        .where(and(eq(attendance.companyId, company.id), eq(attendance.date, today)));

      const [{ value: totalEmployees }] = await db
        .select({ value: count() })
        .from(employees)
        .where(and(eq(employees.companyId, company.id), eq(employees.status, "active")));

      const pendingLeavesRows = await db
        .select({ id: leaves.id })
        .from(leaves)
        .where(and(eq(leaves.companyId, company.id), eq(leaves.status, "pending")));

      // Find employees with 3+ absences this month
      const monthStart = today.slice(0, 7) + "-01";
      const absences = await db
        .select({ employeeId: attendance.employeeId, name: employees.name })
        .from(attendance)
        .leftJoin(employees, eq(attendance.employeeId, employees.id))
        .where(
          and(
            eq(attendance.companyId, company.id),
            eq(attendance.status, "absent"),
            gte(attendance.date, monthStart)
          )
        );

      const absentCounts: Record<string, { name: string; count: number }> = {};
      for (const a of absences) {
        const id = a.employeeId;
        if (!absentCounts[id]) absentCounts[id] = { name: a.name || "Unknown", count: 0 };
        absentCounts[id].count++;
      }
      const highAbsence = Object.values(absentCounts)
        .filter((e) => e.count >= 3)
        .map((e) => e.name);

      const presentCount = todayAttendance.filter((a) => ["present", "late"].includes(a.status)).length;
      const absentCount = todayAttendance.filter((a) => a.status === "absent").length;
      const lateCount = todayAttendance.filter((a) => a.status === "late").length;
      const total = Number(totalEmployees) || 1;
      const presentPct = Math.round((presentCount / total) * 100);

      const prompt = `You are an HR assistant for an Indian company. Based on this data, give 3 short insights in plain English (not bullet points, just 3 sentences):
Attendance today: ${presentPct}% present, ${lateCount} late, ${absentCount} absent.
Pending leave requests: ${pendingLeavesRows.length}.
Employees with 3+ absences this month: ${highAbsence.length > 0 ? highAbsence.join(", ") : "None"}.
Keep it under 60 words total. Be direct, practical, no fluff.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      });

      const insight = (response.content[0] as any).text;
      const tokensUsed = (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0);

      await db.insert(dailyInsights).values({
        companyId: company.id,
        date: today,
        insight,
        tokensUsed,
      });

      await db.insert(usageLogs).values({
        companyId: company.id,
        feature: "daily_insight",
        tokensInput: response.usage.input_tokens,
        tokensOutput: response.usage.output_tokens,
      });

      processed++;
    } catch (err) {
      console.error(`Failed to generate insight for company ${company.id}:`, err);
    }
  }

  // Expire grace period → suspend
  const graceExpired = await db
    .select({ id: companies.id })
    .from(companies)
    .where(and(eq(companies.billingStatus, "grace_period"), lt(companies.graceEndsAt, new Date())));

  for (const c of graceExpired) {
    await db.update(companies).set({ billingStatus: "suspended" }).where(eq(companies.id, c.id));
  }

  return NextResponse.json({ processed, graceExpired: graceExpired.length });
}
