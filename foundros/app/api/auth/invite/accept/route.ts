import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteTokens, users, employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, name, password } = await req.json();

    if (!token || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const [invite] = await db
      .select()
      .from(inviteTokens)
      .where(eq(inviteTokens.token, token))
      .limit(1);

    if (!invite) return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
    if (invite.usedAt) return NextResponse.json({ error: "Invite already used" }, { status: 400 });
    if (new Date(invite.expiresAt) < new Date()) return NextResponse.json({ error: "Invite has expired" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if user already exists with this email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, invite.email))
      .limit(1);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db.update(users).set({ name, password: hashedPassword, companyId: invite.companyId }).where(eq(users.id, existingUser.id));
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email: invite.email,
          password: hashedPassword,
          role: "employee",
          companyId: invite.companyId,
        })
        .returning();
      userId = newUser.id;
    }

    // Link employee record to user
    if (invite.employeeId) {
      await db.update(employees).set({ userId, name }).where(eq(employees.id, invite.employeeId));
    }

    // Mark invite as used
    await db.update(inviteTokens).set({ usedAt: new Date() }).where(eq(inviteTokens.id, invite.id));

    return NextResponse.json({ success: true, email: invite.email, companyId: invite.companyId });
  } catch (err) {
    console.error("Invite accept error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
