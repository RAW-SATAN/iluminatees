import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/email/sender";
import { db } from "@/lib/db";
import { companies, users } from "@/lib/db/schema";
import { like, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { companyName, ownerName, email, phone, password } = await req.json();

    if (!companyName || !ownerName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Generate unique slug
    let slug = slugify(companyName);
    const existingSlugs = await db
      .select({ slug: companies.slug })
      .from(companies)
      .where(like(companies.slug, `${slug}%`));

    if (existingSlugs.length > 0) slug = `${slug}-${existingSlugs.length}`;

    // Create company first
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const [company] = await db
      .insert(companies)
      .values({
        name: companyName,
        slug,
        ownerId: "00000000-0000-0000-0000-000000000000", // placeholder; updated below
        plan: "starter",
        employeeLimit: 10,
        billingStatus: "trial",
        trialEndsAt,
      })
      .returning();

    // Hash password and create owner user
    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(users)
      .values({
        name: ownerName,
        email,
        password: hashedPassword,
        phone,
        role: "owner",
        companyId: company.id,
      })
      .returning();

    // Update company ownerId
    await db.update(companies).set({ ownerId: user.id }).where(eq(companies.id, company.id));

    sendWelcomeEmail({ to: email, name: ownerName, companyName, slug }).catch(console.error);

    return NextResponse.json({ slug, companyId: company.id });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
