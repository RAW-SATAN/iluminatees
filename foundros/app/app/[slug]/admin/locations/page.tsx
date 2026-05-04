import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { companies, officeLocations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import PageHeader from "@/components/ui/PageHeader";
import AddLocationButton from "@/components/AddLocationButton";
import DeleteLocationButton from "@/components/DeleteLocationButton";
import { MapPin } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LocationsPage({ params }: Props) {
  const { slug } = await params;

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  if (!company) redirect("/login");

  const locations = await db.select().from(officeLocations).where(eq(officeLocations.companyId, company.id)).orderBy(officeLocations.createdAt);

  return (
    <div>
      <PageHeader
        title="Office Locations"
        breadcrumbs={[{ label: company.name }, { label: "Locations" }]}
        actions={<AddLocationButton companyId={company.id} />}
      />

      <p className="text-sm text-[#64748B] mb-6">
        Set office locations for attendance verification. Employees must be within the radius to get location-verified check-in.
      </p>

      {locations.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-[#1A1A1A]">No office locations added</p>
          <p className="text-sm text-[#64748B] mt-1">Add your office location to enable GPS-verified attendance.</p>
          <div className="mt-4">
            <AddLocationButton companyId={company.id} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#E94560]/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#E94560]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1A1A1A]">{loc.name}</h3>
                    {loc.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-[#64748B] mt-1">
                    {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    Radius: <span className="font-medium text-[#1A1A1A]">{loc.radiusMeters}m</span>
                  </p>
                </div>
              </div>
              <DeleteLocationButton locationId={loc.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
