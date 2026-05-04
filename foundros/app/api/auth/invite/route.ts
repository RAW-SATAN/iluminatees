import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inviteTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/login?error=invalid_invite", req.url));

  const [invite] = await db
    .select()
    .from(inviteTokens)
    .where(eq(inviteTokens.token, token))
    .limit(1);

  if (!invite) return NextResponse.redirect(new URL("/login?error=invalid_invite", req.url));
  if (invite.usedAt) return NextResponse.redirect(new URL("/login?error=invite_used", req.url));
  if (new Date(invite.expiresAt) < new Date()) return NextResponse.redirect(new URL("/login?error=invite_expired", req.url));

  return NextResponse.redirect(new URL(`/invite/${token}`, req.url));
}
