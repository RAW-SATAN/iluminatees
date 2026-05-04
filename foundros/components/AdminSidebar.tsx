"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign,
  MapPin, LogOut, ChevronRight, Building2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  role: string;
  companyName: string;
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "admin" },
  { label: "Employees", icon: Users, href: "admin/employees" },
  { label: "Attendance", icon: Clock, href: "admin/attendance" },
  { label: "Leaves", icon: Calendar, href: "admin/leaves" },
  { label: "Payroll", icon: DollarSign, href: "admin/payroll" },
  { label: "Office Locations", icon: MapPin, href: "admin/locations" },
];

export default function AdminSidebar({ slug, role, companyName }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <aside className="w-64 bg-[#1A1A2E] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-white font-bold text-xl">FoundrOS</h1>
        <div className="flex items-center gap-2 mt-2">
          <Building2 className="text-[#E94560] w-4 h-4" />
          <span className="text-white/60 text-sm truncate">{companyName}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const href = `/app/${slug}/${item.href}`;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#E94560] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
