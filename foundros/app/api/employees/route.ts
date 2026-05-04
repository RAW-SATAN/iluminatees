import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies, employees, inviteTokens } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { sendEmployeeInviteEmail } from "@/lib/email/sender";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { companyId, name, email, phone, role, department, dateOfJoining, baseSalary, salaryType, pfApplicable, esiApplicable } = body;

    const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    if (company.billingStatus === "suspended") {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    const [{ value: empCount }] = await db
      .select({ value: count() })
      .from(employees)
      .where(and(eq(employees.companyId, companyId), eq(employees.status, "active")));

    if (empCount >= company.employeeLimit) {
      return NextResponse.json(
        { error: `Employee limit of ${company.employeeLimit} reached. Please upgrade your plan.` },
        { status: 403 }
      );
    }

    const [employee] = await db
      .insert(employees)
      .values({
        companyId,
        name,
        email,
        phone,
        role,
        department,
        dateOfJoining: dateOfJoining || null,
        baseSalary: baseSalary?.toString() || "0",
        salaryType: salaryType || "monthly",
        pfApplicable: pfApplicable ?? true,
        esiApplicable: esiApplicable ?? true,
        status: "active",
      })
      .returning();

    // Create invite token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(inviteTokens).values({
      token,
      email,
      companyId,
      employeeId: employee.id,
      expiresAt,
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/invite?token=${token}`;
    sendEmployeeInviteEmail({
      to: email,
      employeeName: name,
      companyName: company.name,
      inviteLink,
    }).catch(console.error);

    return NextResponse.json({ employee });
  } catch (err) {
    console.error("Add employee error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
