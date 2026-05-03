"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MapPin, Crosshair } from "lucide-react";
import SlideOver from "@/components/ui/SlideOver";
import { useRouter } from "next/navigation";

interface Props {
  companyId: string;
}

export default function AddLocationButton({ companyId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function getCurrentLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setError("Could not get location. Please enter coordinates manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      companyId,
      name: form.get("name"),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radiusMeters: parseInt(form.get("radius") as string),
      isDefault: form.get("isDefault") === "on",
    };

    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add location");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#E94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition"
      >
        <Plus className="w-4 h-4" />
        Add Location
      </button>

      <SlideOver open={open} onClose={() => setOpen(false)} title="Add Office Location">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Location Name *</label>
            <input name="name" required placeholder="HQ Office, Andheri West" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-[#1A1A1A]">Coordinates *</label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locating}
                className="flex items-center gap-1 text-xs text-[#E94560] hover:underline disabled:opacity-60"
              >
                <Crosshair className="w-3.5 h-3.5" />
                {locating ? "Getting location..." : "Use my location"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                placeholder="Latitude (e.g. 19.0760)"
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]"
              />
              <input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                placeholder="Longitude (e.g. 72.8777)"
                className="border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Check-in Radius (meters)</label>
            <input name="radius" type="number" defaultValue={100} min={50} max={1000} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]" />
            <p className="text-xs text-[#64748B] mt-1">Employees must be within this radius for verified check-in.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input name="isDefault" type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-[#1A1A1A]">Set as default location</span>
          </label>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-[#E2E8F0] text-[#64748B] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#E94560] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-60">
              {loading ? "Saving..." : "Save Location"}
            </button>
          </div>
        </form>
      </SlideOver>
    </>
  );
}
