-- ============================================================
-- FoundrOS Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'pro')),
  employee_limit INT DEFAULT 10,
  razorpay_subscription_id TEXT,
  billing_status TEXT DEFAULT 'trial' CHECK (billing_status IN ('trial', 'active', 'grace_period', 'suspended')),
  trial_ends_at TIMESTAMPTZ,
  grace_ends_at TIMESTAMPTZ,
  logo_url TEXT,
  address TEXT,
  gstin TEXT,
  state TEXT DEFAULT 'other',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'owner', 'hr_manager', 'sales_exec', 'employee', 'ca')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  department TEXT,
  date_of_joining DATE,
  base_salary NUMERIC DEFAULT 0,
  salary_type TEXT DEFAULT 'monthly' CHECK (salary_type IN ('monthly', 'daily')),
  pf_applicable BOOLEAN DEFAULT TRUE,
  esi_applicable BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  profile_photo_url TEXT,
  pan TEXT,
  employee_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE office_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  radius_meters INT DEFAULT 100,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ,
  check_in_selfie_url TEXT,
  check_in_lat NUMERIC,
  check_in_lng NUMERIC,
  check_out_time TIMESTAMPTZ,
  check_out_selfie_url TEXT,
  check_out_lat NUMERIC,
  check_out_lng NUMERIC,
  status TEXT DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'half_day', 'late', 'leave')),
  location_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE TABLE leaves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'earned', 'unpaid')),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'paid')),
  total_gross NUMERIC DEFAULT 0,
  total_deductions NUMERIC DEFAULT 0,
  total_net NUMERIC DEFAULT 0,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, month, year)
);

CREATE TABLE salary_slips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  gross_salary NUMERIC DEFAULT 0,
  basic NUMERIC DEFAULT 0,
  hra NUMERIC DEFAULT 0,
  special_allowance NUMERIC DEFAULT 0,
  pf_employee NUMERIC DEFAULT 0,
  pf_employer NUMERIC DEFAULT 0,
  esi_employee NUMERIC DEFAULT 0,
  esi_employer NUMERIC DEFAULT 0,
  professional_tax NUMERIC DEFAULT 0,
  tds NUMERIC DEFAULT 0,
  lop_amount NUMERIC DEFAULT 0,
  total_deductions NUMERIC DEFAULT 0,
  net_salary NUMERIC DEFAULT 0,
  working_days INT DEFAULT 0,
  present_days INT DEFAULT 0,
  leave_days INT DEFAULT 0,
  absent_days INT DEFAULT 0,
  slip_pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE daily_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  insight TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, date)
);

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  feature TEXT NOT NULL,
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get company_id for current user
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: get role for current user
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- companies: owner and members of that company can see it
CREATE POLICY "company_select" ON companies
  FOR SELECT USING (
    id = get_my_company_id() OR owner_id = auth.uid()
  );

CREATE POLICY "company_insert" ON companies
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "company_update" ON companies
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    get_my_role() IN ('owner', 'hr_manager')
  );

-- profiles
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR company_id = get_my_company_id()
  );

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (
    id = auth.uid() OR
    (company_id = get_my_company_id() AND get_my_role() IN ('owner', 'hr_manager'))
  );

-- employees
CREATE POLICY "employees_select" ON employees
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "employees_insert" ON employees
  FOR INSERT WITH CHECK (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "employees_update" ON employees
  FOR UPDATE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "employees_delete" ON employees
  FOR DELETE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

-- office_locations
CREATE POLICY "office_locations_select" ON office_locations
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "office_locations_insert" ON office_locations
  FOR INSERT WITH CHECK (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "office_locations_update" ON office_locations
  FOR UPDATE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "office_locations_delete" ON office_locations
  FOR DELETE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

-- attendance
CREATE POLICY "attendance_select" ON attendance
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "attendance_insert" ON attendance
  FOR INSERT WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "attendance_update" ON attendance
  FOR UPDATE USING (company_id = get_my_company_id());

-- leaves
CREATE POLICY "leaves_select" ON leaves
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "leaves_insert" ON leaves
  FOR INSERT WITH CHECK (company_id = get_my_company_id());

CREATE POLICY "leaves_update" ON leaves
  FOR UPDATE USING (company_id = get_my_company_id());

-- payroll_runs
CREATE POLICY "payroll_runs_select" ON payroll_runs
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "payroll_runs_insert" ON payroll_runs
  FOR INSERT WITH CHECK (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "payroll_runs_update" ON payroll_runs
  FOR UPDATE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

-- salary_slips
CREATE POLICY "salary_slips_select" ON salary_slips
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "salary_slips_insert" ON salary_slips
  FOR INSERT WITH CHECK (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

CREATE POLICY "salary_slips_update" ON salary_slips
  FOR UPDATE USING (
    company_id = get_my_company_id() AND
    get_my_role() IN ('owner', 'hr_manager')
  );

-- daily_insights
CREATE POLICY "daily_insights_select" ON daily_insights
  FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "daily_insights_insert" ON daily_insights
  FOR INSERT WITH CHECK (true);  -- inserted by cron via service role

-- usage_logs: service role only for writes, owners can read their own
CREATE POLICY "usage_logs_select" ON usage_logs
  FOR SELECT USING (company_id = get_my_company_id());

-- ============================================================
-- STORAGE BUCKETS (run separately or via Supabase dashboard)
-- ============================================================
-- bucket: avatars        (public)
-- bucket: attendance     (private)
-- bucket: salary-slips   (private)
-- bucket: documents      (private)
-- bucket: company-assets (public)

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_attendance_company_date ON attendance(company_id, date);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_leaves_company ON leaves(company_id);
CREATE INDEX idx_leaves_employee ON leaves(employee_id);
CREATE INDEX idx_payroll_runs_company ON payroll_runs(company_id);
CREATE INDEX idx_salary_slips_payroll_run ON salary_slips(payroll_run_id);
CREATE INDEX idx_salary_slips_employee ON salary_slips(employee_id);
CREATE INDEX idx_daily_insights_company_date ON daily_insights(company_id, date);
CREATE INDEX idx_profiles_company ON profiles(company_id);
