export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          plan: "starter" | "growth" | "pro";
          employee_limit: number;
          razorpay_subscription_id: string | null;
          billing_status: "trial" | "active" | "grace_period" | "suspended";
          trial_ends_at: string | null;
          grace_ends_at: string | null;
          logo_url: string | null;
          address: string | null;
          gstin: string | null;
          state: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["companies"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          company_id: string;
          role: "super_admin" | "owner" | "hr_manager" | "sales_exec" | "employee" | "ca";
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      employees: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          role: string | null;
          department: string | null;
          date_of_joining: string | null;
          base_salary: number;
          salary_type: "monthly" | "daily";
          pf_applicable: boolean;
          esi_applicable: boolean;
          status: "active" | "inactive";
          profile_photo_url: string | null;
          pan: string | null;
          employee_code: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["employees"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["employees"]["Insert"]>;
      };
      office_locations: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          lat: number;
          lng: number;
          radius_meters: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["office_locations"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["office_locations"]["Insert"]>;
      };
      attendance: {
        Row: {
          id: string;
          employee_id: string;
          company_id: string;
          date: string;
          check_in_time: string | null;
          check_in_selfie_url: string | null;
          check_in_lat: number | null;
          check_in_lng: number | null;
          check_out_time: string | null;
          check_out_selfie_url: string | null;
          check_out_lat: number | null;
          check_out_lng: number | null;
          status: "present" | "absent" | "half_day" | "late" | "leave";
          location_verified: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendance"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
      };
      leaves: {
        Row: {
          id: string;
          employee_id: string;
          company_id: string;
          leave_type: "sick" | "casual" | "earned" | "unpaid";
          from_date: string;
          to_date: string;
          reason: string | null;
          status: "pending" | "approved" | "rejected";
          approved_by: string | null;
          rejection_reason: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leaves"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leaves"]["Insert"]>;
      };
      payroll_runs: {
        Row: {
          id: string;
          company_id: string;
          month: number;
          year: number;
          status: "draft" | "processed" | "paid";
          total_gross: number;
          total_deductions: number;
          total_net: number;
          processed_at: string | null;
          processed_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payroll_runs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payroll_runs"]["Insert"]>;
      };
      salary_slips: {
        Row: {
          id: string;
          payroll_run_id: string;
          employee_id: string;
          company_id: string;
          gross_salary: number;
          basic: number;
          hra: number;
          special_allowance: number;
          pf_employee: number;
          pf_employer: number;
          esi_employee: number;
          esi_employer: number;
          professional_tax: number;
          tds: number;
          lop_amount: number;
          total_deductions: number;
          net_salary: number;
          working_days: number;
          present_days: number;
          leave_days: number;
          absent_days: number;
          slip_pdf_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["salary_slips"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["salary_slips"]["Insert"]>;
      };
      daily_insights: {
        Row: {
          id: string;
          company_id: string;
          date: string;
          insight: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_insights"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_insights"]["Insert"]>;
      };
      usage_logs: {
        Row: {
          id: string;
          company_id: string | null;
          feature: string;
          tokens_input: number;
          tokens_output: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["usage_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage_logs"]["Insert"]>;
      };
    };
    Functions: {
      get_my_company_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_my_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
  };
}

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Employee = Database["public"]["Tables"]["employees"]["Row"];
export type OfficeLocation = Database["public"]["Tables"]["office_locations"]["Row"];
export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
export type Leave = Database["public"]["Tables"]["leaves"]["Row"];
export type PayrollRun = Database["public"]["Tables"]["payroll_runs"]["Row"];
export type SalarySlip = Database["public"]["Tables"]["salary_slips"]["Row"];
export type DailyInsight = Database["public"]["Tables"]["daily_insights"]["Row"];
