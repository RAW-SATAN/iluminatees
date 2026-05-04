import { NextRequest, NextResponse } from "next/server";

// Legacy Supabase auth callback — no longer used with NextAuth
export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/login`);
}
