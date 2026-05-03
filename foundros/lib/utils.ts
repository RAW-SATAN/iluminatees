import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", { month: "long" });
}

// Haversine distance in meters between two lat/lng points
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getLeaveBalance(
  dateOfJoining: string,
  leaveType: "casual" | "sick" | "earned"
): number {
  const joining = new Date(dateOfJoining);
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const effectiveStart = joining > yearStart ? joining : yearStart;

  const totalDaysInYear = 365;
  const daysElapsed = Math.floor(
    (now.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  const annualAllotment = leaveType === "earned" ? 15 : 12;
  return Math.max(0, Math.round((daysElapsed / totalDaysInYear) * annualAllotment));
}
