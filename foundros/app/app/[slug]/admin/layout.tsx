import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/AdminSidebar";
import SuspendedBanner from "@/components/SuspendedBanner";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function AdminLayout({ children, params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const user = session.user as any;
  if (!["owner", "hr_manager", "ca", "admin"].includes(user.role)) {
    redirect(`/app/${slug}/employee`);
  }

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);

  if (!company) redirect("/login");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar slug={slug} role={user.role} companyName={company.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {company.billingStatus === "suspended" && <SuspendedBanner slug={slug} />}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
