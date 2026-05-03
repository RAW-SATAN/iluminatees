"use client";

import { useState, useRef } from "react";
import { Camera, MapPin, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { haversineDistance } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OfficeLocation {
  id: string;
  lat: number;
  lng: number;
  radius_meters: number;
  name: string;
  is_default: boolean;
}

interface AttendanceRecord {
  id?: string;
  check_in_time?: string;
  check_out_time?: string;
  status?: string;
  location_verified?: boolean;
}

interface Props {
  employeeId: string;
  companyId: string;
  todayRecord: AttendanceRecord | null;
  officeLocations: OfficeLocation[];
}

export default function CheckInWidget({ employeeId, companyId, todayRecord, officeLocations }: Props) {
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [mode, setMode] = useState<"checkin" | "checkout">("checkin");
  const [locationStatus, setLocationStatus] = useState<"unknown" | "inside" | "outside">("unknown");
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  const checkedIn = !!todayRecord?.check_in_time;
  const checkedOut = !!todayRecord?.check_out_time;

  function formatTime(ts?: string) {
    if (!ts) return null;
    return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  async function startCamera(actionMode: "checkin" | "checkout") {
    setMode(actionMode);
    setError("");
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setError("Camera access denied. Please allow camera permission.");
      setShowCamera(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }

  async function captureAndSubmit() {
    if (!videoRef.current) return;
    setLoading(true);
    setError("");

    try {
      // Capture selfie
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);

      // Compress to max 400KB
      let quality = 0.8;
      let blob: Blob;
      do {
        blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", quality));
        quality -= 0.1;
      } while (blob.size > 400 * 1024 && quality > 0.1);

      // Get GPS
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Check office proximity
      const defaultLocation = officeLocations.find((l) => l.is_default) || officeLocations[0];
      let verified = false;
      if (defaultLocation) {
        const dist = haversineDistance(lat, lng, defaultLocation.lat, defaultLocation.lng);
        verified = dist <= defaultLocation.radius_meters;
        setLocationStatus(verified ? "inside" : "outside");
      }

      // Upload selfie
      const formData = new FormData();
      formData.append("file", blob, `selfie.jpg`);
      formData.append("employeeId", employeeId);
      formData.append("companyId", companyId);
      formData.append("type", mode);

      const uploadRes = await fetch("/api/attendance/checkin", {
        method: "POST",
        body: JSON.stringify({
          employeeId,
          companyId,
          mode,
          lat,
          lng,
          locationVerified: verified,
          selfieBase64: canvas.toDataURL("image/jpeg", quality),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        setError(data.error || "Check-in failed");
        return;
      }

      stopCamera();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
      {/* Status */}
      {checkedIn && (
        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Checked in at <strong>{formatTime(todayRecord?.check_in_time)}</strong></span>
            {todayRecord?.location_verified && (
              <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">Location ✓</span>
            )}
          </div>
          {checkedOut && (
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Checked out at <strong>{formatTime(todayRecord?.check_out_time)}</strong></span>
            </div>
          )}
        </div>
      )}

      {locationStatus === "outside" && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-4 text-sm text-orange-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          You&apos;re outside office radius — attendance flagged as unverified.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">{error}</div>
      )}

      {/* Camera View */}
      {showCamera ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-4 border-white/50" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={stopCamera} className="flex-1 border border-[#E2E8F0] text-[#64748B] py-3 rounded-xl text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={captureAndSubmit}
              disabled={loading}
              className="flex-1 bg-[#E94560] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {loading ? "Processing..." : "Capture"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {!checkedIn && (
            <button
              onClick={() => startCamera("checkin")}
              className="w-full bg-[#E94560] text-white py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 hover:bg-[#d63d57] active:scale-95 transition"
            >
              <Camera className="w-5 h-5" />
              CHECK IN
            </button>
          )}
          {checkedIn && !checkedOut && (
            <button
              onClick={() => startCamera("checkout")}
              className="w-full bg-[#1A1A2E] text-white py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 hover:bg-[#2d2d4e] active:scale-95 transition"
            >
              <Camera className="w-5 h-5" />
              CHECK OUT
            </button>
          )}
          {checkedIn && checkedOut && (
            <div className="text-center py-4 text-sm text-[#64748B]">
              You&apos;ve completed attendance for today. See you tomorrow!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
