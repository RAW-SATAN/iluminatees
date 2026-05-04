import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import CompanySettingsForm from "@/components/CompanySettingsForm";
import PageHeader from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ slug: string }>;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry","other",
];

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const userId = (session.user as any).id;
  if (company.ownerId !== userId) redirect(`/app/${slug}/admin`);

  return (
    <div className="p-6 max-w-2xl">
      <PageHeader title="Company Settings" subtitle="Update your company profile and tax details" />

      <div className="mt-6 bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <CompanySettingsForm company={company} states={INDIAN_STATES} />
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h3 className="font-semibold text-[#1A1A1A] mb-1">Danger Zone</h3>
        <p className="text-sm text-[#64748B] mb-4">
          Contact support to delete your company account and all associated data.
        </p>
        <a
          href="mailto:support@foundros.io?subject=Delete Account Request"
          className="text-sm text-red-600 font-medium hover:underline"
        >
          Request account deletion →
        </a>
      </div>
    </div>
  );
}
