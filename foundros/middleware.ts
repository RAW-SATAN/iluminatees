import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/", "/signup", "/login", "/api/webhooks", "/api/auth", "/demo"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (pathname.startsWith("/super")) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
    if (session.user?.email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/app/")) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));

    const segments = pathname.split("/");
    const slug = segments[2];

    if (slug) {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.slug, slug))
        .limit(1);

      if (!company) return NextResponse.redirect(new URL("/login", req.url));

      if (
        company.billingStatus === "trial" &&
        company.trialEndsAt &&
        new Date() > new Date(company.trialEndsAt) &&
        !pathname.includes("/billing")
      ) {
        return NextResponse.redirect(new URL(`/app/${slug}/billing/subscribe`, req.url));
      }
    }
    return NextResponse.next();
  }

  if (!isPublic && !pathname.startsWith("/api/")) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
