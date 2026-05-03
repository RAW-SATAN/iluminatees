"use client";

import { cn } from "@/lib/utils";

interface AttendanceDay {
  date: string;
  status: string;
}

interface Props {
  attendance: AttendanceDay[];
  year: number;
  month: number;
}

const statusColors: Record<string, string> = {
  present: "bg-green-500 text-white",
  absent: "bg-red-400 text-white",
  late: "bg-yellow-400 text-white",
  leave: "bg-gray-400 text-white",
  half_day: "bg-orange-400 text-white",
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendanceCalendar({ attendance, year, month }: Props) {
  const attendanceMap = new Map(attendance.map((a) => [a.date, a.status]));
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {[
          { label: "Present", color: "bg-green-500" },
          { label: "Absent", color: "bg-red-400" },
          { label: "Late", color: "bg-yellow-400" },
          { label: "Leave", color: "bg-gray-400" },
          { label: "Half Day", color: "bg-orange-400" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-[#64748B]">{label}</span>
          </div>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-[#64748B] py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const status = attendanceMap.get(dateStr);
          const isToday = dateStr === today;
          const isFuture = dateStr > today;

          return (
            <div
              key={dateStr}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-xs font-medium",
                status ? statusColors[status] : "",
                !status && !isFuture ? "bg-gray-100 text-[#64748B]" : "",
                !status && isFuture ? "text-[#64748B]" : "",
                isToday && !status ? "ring-2 ring-[#E94560] text-[#E94560]" : "",
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
