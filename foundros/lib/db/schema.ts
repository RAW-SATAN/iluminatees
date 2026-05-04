import {
  pgTable, uuid, text, integer, numeric, boolean,
  timestamp, date, unique,
} from "drizzle-orm/pg-core";

// ─── companies ───────────────────────────────────────────────────────────────
export const companies = pgTable("companies", {
  id:                       uuid("id").primaryKey().defaultRandom(),
  name:                     text("name").notNull(),
  slug:                     text("slug").notNull().unique(),
  ownerId:                  uuid("owner_id").notNull(),
  plan:                     text("plan").default("starter").notNull(),
  employeeLimit:            integer("employee_limit").default(10).notNull(),
  razorpaySubscriptionId:   text("razorpay_subscription_id"),
  billingStatus:            text("billing_status").default("trial").notNull(),
  trialEndsAt:              timestamp("trial_ends_at", { withTimezone: true }),
  graceEndsAt:              timestamp("grace_ends_at", { withTimezone: true }),
  logoUrl:                  text("logo_url"),
  address:                  text("address"),
  gstin:                    text("gstin"),
  state:                    text("state").default("other").notNull(),
  createdAt:                timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name"),
  email:        text("email").notNull().unique(),
  password:     text("password"),          // bcrypt hash
  role:         text("role").default("employee").notNull(),
  companyId:    uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  phone:        text("phone"),
  avatarUrl:    text("avatar_url"),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// NextAuth tables ─────────────────────────────────────────────────────────────
export const accounts = pgTable("accounts", {
  userId:            uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type:              text("type").notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken:      text("refresh_token"),
  accessToken:       text("access_token"),
  expiresAt:         integer("expires_at"),
  tokenType:         text("token_type"),
  scope:             text("scope"),
  idToken:           text("id_token"),
  sessionState:      text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId:       uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires:      timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires", { withTimezone: true }).notNull(),
});

// ─── employees ────────────────────────────────────────────────────────────────
export const employees = pgTable("employees", {
  id:              uuid("id").primaryKey().defaultRandom(),
  companyId:       uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  userId:          uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name:            text("name").notNull(),
  email:           text("email").notNull(),
  phone:           text("phone"),
  role:            text("role"),
  department:      text("department"),
  dateOfJoining:   date("date_of_joining"),
  baseSalary:      numeric("base_salary", { precision: 12, scale: 2 }).default("0").notNull(),
  salaryType:      text("salary_type").default("monthly").notNull(),
  pfApplicable:    boolean("pf_applicable").default(true).notNull(),
  esiApplicable:   boolean("esi_applicable").default(true).notNull(),
  status:          text("status").default("active").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  pan:             text("pan"),
  employeeCode:    text("employee_code"),
  createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── office_locations ─────────────────────────────────────────────────────────
export const officeLocations = pgTable("office_locations", {
  id:            uuid("id").primaryKey().defaultRandom(),
  companyId:     uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name:          text("name").notNull(),
  lat:           numeric("lat", { precision: 10, scale: 6 }).notNull(),
  lng:           numeric("lng", { precision: 10, scale: 6 }).notNull(),
  radiusMeters:  integer("radius_meters").default(100).notNull(),
  isDefault:     boolean("is_default").default(false).notNull(),
  createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── attendance ───────────────────────────────────────────────────────────────
export const attendance = pgTable("attendance", {
  id:                uuid("id").primaryKey().defaultRandom(),
  employeeId:        uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  companyId:         uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date:              date("date").notNull(),
  checkInTime:       timestamp("check_in_time", { withTimezone: true }),
  checkInSelfieUrl:  text("check_in_selfie_url"),
  checkInLat:        numeric("check_in_lat", { precision: 10, scale: 6 }),
  checkInLng:        numeric("check_in_lng", { precision: 10, scale: 6 }),
  checkOutTime:      timestamp("check_out_time", { withTimezone: true }),
  checkOutSelfieUrl: text("check_out_selfie_url"),
  checkOutLat:       numeric("check_out_lat", { precision: 10, scale: 6 }),
  checkOutLng:       numeric("check_out_lng", { precision: 10, scale: 6 }),
  status:            text("status").default("absent").notNull(),
  locationVerified:  boolean("location_verified").default(false).notNull(),
  notes:             text("notes"),
  createdAt:         timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [unique().on(t.employeeId, t.date)]);

// ─── leaves ───────────────────────────────────────────────────────────────────
export const leaves = pgTable("leaves", {
  id:              uuid("id").primaryKey().defaultRandom(),
  employeeId:      uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  companyId:       uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  leaveType:       text("leave_type").notNull(),
  fromDate:        date("from_date").notNull(),
  toDate:          date("to_date").notNull(),
  reason:          text("reason"),
  status:          text("status").default("pending").notNull(),
  approvedBy:      uuid("approved_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── payroll_runs ─────────────────────────────────────────────────────────────
export const payrollRuns = pgTable("payroll_runs", {
  id:               uuid("id").primaryKey().defaultRandom(),
  companyId:        uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  month:            integer("month").notNull(),
  year:             integer("year").notNull(),
  status:           text("status").default("draft").notNull(),
  totalGross:       numeric("total_gross", { precision: 14, scale: 2 }).default("0").notNull(),
  totalDeductions:  numeric("total_deductions", { precision: 14, scale: 2 }).default("0").notNull(),
  totalNet:         numeric("total_net", { precision: 14, scale: 2 }).default("0").notNull(),
  processedAt:      timestamp("processed_at", { withTimezone: true }),
  processedBy:      uuid("processed_by").references(() => users.id),
  createdAt:        timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [unique().on(t.companyId, t.month, t.year)]);

// ─── salary_slips ─────────────────────────────────────────────────────────────
export const salarySlips = pgTable("salary_slips", {
  id:               uuid("id").primaryKey().defaultRandom(),
  payrollRunId:     uuid("payroll_run_id").notNull().references(() => payrollRuns.id, { onDelete: "cascade" }),
  employeeId:       uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  companyId:        uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  grossSalary:      numeric("gross_salary", { precision: 12, scale: 2 }).default("0").notNull(),
  basic:            numeric("basic", { precision: 12, scale: 2 }).default("0").notNull(),
  hra:              numeric("hra", { precision: 12, scale: 2 }).default("0").notNull(),
  specialAllowance: numeric("special_allowance", { precision: 12, scale: 2 }).default("0").notNull(),
  pfEmployee:       numeric("pf_employee", { precision: 10, scale: 2 }).default("0").notNull(),
  pfEmployer:       numeric("pf_employer", { precision: 10, scale: 2 }).default("0").notNull(),
  esiEmployee:      numeric("esi_employee", { precision: 10, scale: 2 }).default("0").notNull(),
  esiEmployer:      numeric("esi_employer", { precision: 10, scale: 2 }).default("0").notNull(),
  professionalTax:  numeric("professional_tax", { precision: 10, scale: 2 }).default("0").notNull(),
  tds:              numeric("tds", { precision: 10, scale: 2 }).default("0").notNull(),
  lopAmount:        numeric("lop_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  totalDeductions:  numeric("total_deductions", { precision: 12, scale: 2 }).default("0").notNull(),
  netSalary:        numeric("net_salary", { precision: 12, scale: 2 }).default("0").notNull(),
  workingDays:      integer("working_days").default(0).notNull(),
  presentDays:      integer("present_days").default(0).notNull(),
  leaveDays:        integer("leave_days").default(0).notNull(),
  absentDays:       integer("absent_days").default(0).notNull(),
  slipPdfUrl:       text("slip_pdf_url"),
  createdAt:        timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── daily_insights ───────────────────────────────────────────────────────────
export const dailyInsights = pgTable("daily_insights", {
  id:         uuid("id").primaryKey().defaultRandom(),
  companyId:  uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date:       date("date").notNull(),
  insight:    text("insight").notNull(),
  tokensUsed: integer("tokens_used").default(0).notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [unique().on(t.companyId, t.date)]);

// ─── usage_logs ───────────────────────────────────────────────────────────────
export const usageLogs = pgTable("usage_logs", {
  id:           uuid("id").primaryKey().defaultRandom(),
  companyId:    uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  feature:      text("feature").notNull(),
  tokensInput:  integer("tokens_input").default(0).notNull(),
  tokensOutput: integer("tokens_output").default(0).notNull(),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── invite_tokens ────────────────────────────────────────────────────────────
export const inviteTokens = pgTable("invite_tokens", {
  id:         uuid("id").primaryKey().defaultRandom(),
  token:      text("token").notNull().unique(),
  email:      text("email").notNull(),
  companyId:  uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }),
  expiresAt:  timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt:     timestamp("used_at", { withTimezone: true }),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
