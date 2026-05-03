import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!companyId || !from || !to) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const { data: attendance } = await supabase
    .from("attendance")
    .select("date, status, check_in_time, check_out_time, location_verified, notes, employees(name, department)")
    .eq("company_id", companyId)
    .gte("date", from)
    .lte("date", to)
    .order("date");

  const rows = (attendance || []).map((a: any) => ({
    Date: a.date,
    Employee: a.employees?.name || "—",
    Department: a.employees?.department || "—",
    Status: a.status,
    "Check In": a.check_in_time ? new Date(a.check_in_time).toLocaleTimeString("en-IN") : "—",
    "Check Out": a.check_out_time ? new Date(a.check_out_time).toLocaleTimeString("en-IN") : "—",
    "Location Verified": a.location_verified ? "Yes" : "No",
    Notes: a.notes || "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
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
