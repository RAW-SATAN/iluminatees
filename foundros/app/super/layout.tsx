import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default async function SuperAdminLayout({ children }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="w-56 bg-[#1A1A2E] flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white font-bold text-xl">FoundrOS</h1>
          <p className="text-white/40 text-xs mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: "Dashboard", href: "/super/dashboard" },
            { label: "Companies", href: "/super/companies" },
            { label: "Revenue", href: "/super/revenue" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs">Logged in as super admin</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
