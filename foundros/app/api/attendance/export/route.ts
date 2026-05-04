import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance, employees } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!companyId || !from || !to) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const rows = await db
    .select({
      date: attendance.date,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      locationVerified: attendance.locationVerified,
      notes: attendance.notes,
      employeeName: employees.name,
      department: employees.department,
    })
    .from(attendance)
    .leftJoin(employees, eq(attendance.employeeId, employees.id))
    .where(
      and(
        eq(attendance.companyId, companyId),
        gte(attendance.date, from),
        lte(attendance.date, to)
      )
    )
    .orderBy(attendance.date);

  const sheetRows = rows.map((a) => ({
    Date: a.date,
    Employee: a.employeeName || "—",
    Department: a.department || "—",
    Status: a.status,
    "Check In": a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString("en-IN") : "—",
    "Check Out": a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString("en-IN") : "—",
    "Location Verified": a.locationVerified ? "Yes" : "No",
    Notes: a.notes || "",
  }));

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="attendance-${from}-to-${to}.xlsx"`,
    },
  });
}
