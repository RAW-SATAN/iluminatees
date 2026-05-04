import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function EmployeeLayout({ children, params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const [company] = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);

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
