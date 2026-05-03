import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function EmployeeLayout({ children, params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, billing_status")
    .eq("slug", slug)
    .single();

  if (!company) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F8FAFC] max-w-md mx-auto">
      {/* Mobile top bar */}
      <div className="bg-[#1A1A2E] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-lg">FoundrOS</h1>
          <p className="text-white/60 text-xs">{company.name}</p>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
