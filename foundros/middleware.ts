import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip if Supabase not configured yet (local dev without credentials)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need auth
  const publicRoutes = ["/", "/signup", "/login", "/auth/callback", "/api/webhooks"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Super admin route protection
  if (pathname.startsWith("/super")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // Protected app routes
  if (pathname.startsWith("/app/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Extract slug from URL
    const segments = pathname.split("/");
    const slug = segments[2];

    if (slug) {
      // Validate company slug exists
      const { data: company } = await supabase
        .from("companies")
        .select("id, billing_status, trial_ends_at, grace_ends_at")
        .eq("slug", slug)
        .single();

      if (!company) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Check trial expiry → redirect to billing
      if (company.billing_status === "trial" && company.trial_ends_at) {
        const trialEnd = new Date(company.trial_ends_at);
        if (new Date() > trialEnd && !pathname.includes("/billing")) {
          return NextResponse.redirect(
            new URL(`/app/${slug}/billing/subscribe`, request.url)
          );
        }
      }
    }
  }

  if (!isPublic && !pathname.startsWith("/app/") && !pathname.startsWith("/super")) {
    if (!user && !pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
