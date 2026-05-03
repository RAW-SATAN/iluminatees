// Static demo page — shows all UI components without Supabase
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Admin Layout Mockup */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1A2E] flex flex-col shrink-0">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-white font-bold text-xl">FoundrOS</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#E94560] text-xs">■</span>
              <span className="text-white/60 text-sm">Acme Pvt Ltd</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Dashboard", active: true },
              { label: "Employees", active: false },
              { label: "Attendance", active: false },
              { label: "Leaves", active: false },
              { label: "Payroll", active: false },
              { label: "Office Locations", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  item.active
                    ? "bg-[#E94560] text-white"
                    : "text-white/60"
                }`}
              >
                <span className="w-4 h-4 bg-current opacity-60 rounded-sm inline-block" />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60">
              <span className="w-4 h-4 bg-white/60 rounded-sm" />
              Sign out
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-[#64748B] mb-1">Acme Pvt Ltd › Dashboard</p>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Present Today", value: "18", color: "bg-green-50", dot: "bg-green-500" },
              { label: "Absent Today", value: "4", color: "bg-red-50", dot: "bg-red-400" },
              { label: "Late Today", value: "2", color: "bg-yellow-50", dot: "bg-yellow-400" },
              { label: "On Leave", value: "1", color: "bg-blue-50", dot: "bg-blue-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#64748B] font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <div className={`w-4 h-4 ${s.dot} rounded-full`} />
                </div>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Employees", value: "25", sub: "Active" },
              { label: "Salary Due This Month", value: "₹6,25,000", sub: "Gross" },
              { label: "Pending Leave Requests", value: "3", sub: "Awaiting approval" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <p className="text-sm text-[#64748B] font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{s.value}</p>
                <p className="text-xs text-[#64748B] mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#2d2d4e] rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#E94560] text-lg">✦</span>
              <h3 className="font-semibold">Today's AI Insight</h3>
              <span className="text-xs text-white/40 ml-auto">Updated 11:00 PM</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Attendance is strong at 90% today — well above last week's average of 82%. Ravi Kumar and Priya Sharma have missed 3+ days this month; a check-in would be worthwhile. Three leave requests are pending approval, including one that starts tomorrow.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "Manage Employees", sub: "25 active employees", icon: "👥" },
              { title: "Today's Attendance", sub: "18/25 present", icon: "🕐" },
              { title: "Run Payroll", sub: "Salary due: ₹6,25,000", icon: "💰" },
            ].map((a) => (
              <div key={a.title} className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#E94560] hover:shadow-sm transition cursor-pointer">
                <div className="text-2xl mb-3">{a.icon}</div>
                <h4 className="font-semibold text-[#1A1A1A]">{a.title}</h4>
                <p className="text-sm text-[#64748B] mt-1">{a.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
