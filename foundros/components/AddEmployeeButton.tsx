"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SlideOver from "@/components/ui/SlideOver";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  companyId: string;
  disabled?: boolean;
}

export default function AddEmployeeButton({ slug, companyId, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      companyId,
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      role: form.get("role"),
      department: form.get("department"),
      dateOfJoining: form.get("dateOfJoining"),
      baseSalary: Number(form.get("baseSalary")),
      salaryType: form.get("salaryType"),
      pfApplicable: form.get("pfApplicable") === "true",
      esiApplicable: form.get("esiApplicable") === "true",
    };

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add employee");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className="flex items-center gap-2 bg-[#E94560] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Add Employee
      </button>

      <SlideOver open={open} onClose={() => setOpen(false)} title="Add Employee">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Full Name *</label>
              <input name="name" required className="input-field" placeholder="Ravi Kumar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email *</label>
              <input name="email" type="email" required className="input-field" placeholder="ravi@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone</label>
              <input name="phone" type="tel" className="input-field" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Role / Designation</label>
              <input name="role" className="input-field" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Department</label>
              <select name="department" className="input-field">
                <option value="">Select</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Date of Joining</label>
              <input name="dateOfJoining" type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Base Salary (₹) *</label>
              <input name="baseSalary" type="number" required min="0" className="input-field" placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Salary Type</label>
              <select name="salaryType" className="input-field">
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="pfApplicable" type="checkbox" value="true" defaultChecked className="rounded" />
                <span className="text-sm text-[#1A1A1A]">PF Applicable</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="esiApplicable" type="checkbox" value="true" defaultChecked className="rounded" />
                <span className="text-sm text-[#1A1A1A]">ESI Applicable (if salary ≤ ₹21,000)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-[#E2E8F0] text-[#64748B] py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#E94560] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d63d57] transition disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add & Send Invite"}
            </button>
          </div>
        </form>
      </SlideOver>

      <style jsx>{`
        .input-field {
          width: 100%;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }
        .input-field:focus {
          ring: 2px solid #E94560;
          border-color: #E94560;
        }
      `}</style>
    </>
  );
}
