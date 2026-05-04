"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmployeeBottomNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/app/${slug}/employee`;

  const items = [
    { label: "Home", icon: Home, href: base },
    { label: "Leaves", icon: Calendar, href: `${base}/leaves` },
    { label: "Payslips", icon: FileText, href: `${base}/payslips` },
    { label: "Profile", icon: User, href: `${base}/profile` },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E2E8F0] z-20">
      <div className="flex">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isActive ? "text-[#E94560]" : "text-[#94A3B8] hover:text-[#1A1A2E]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
