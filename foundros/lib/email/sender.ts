import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "noreply@foundros.io";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.foundros.io";

export async function sendWelcomeEmail({
  to, name, companyName, slug,
}: { to: string; name: string; companyName: string; slug: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to FoundrOS, ${name} — let's set up your team`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <div style="background:#1A1A2E;padding:24px;border-radius:12px;text-align:center;margin-bottom:32px">
          <h1 style="color:white;margin:0;font-size:28px">FoundrOS</h1>
        </div>
        <h2 style="color:#1A1A1A;font-size:22px">Welcome aboard, ${name}! 🎉</h2>
        <p style="color:#64748B;line-height:1.6">Your ${companyName} workspace is ready. Here's how to get started in 3 steps:</p>
        <div style="background:white;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:24px 0">
          <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <span style="background:#E94560;color:white;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">1</span>
            <span style="color:#1A1A1A;font-weight:500">Add your employees</span>
          </div>
          <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px">
            <span style="background:#E94560;color:white;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">2</span>
            <span style="color:#1A1A1A;font-weight:500">Set your office location for attendance</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <span style="background:#E94560;color:white;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">3</span>
            <span style="color:#1A1A1A;font-weight:500">Run your first payroll</span>
          </div>
        </div>
        <div style="text-align:center;margin:32px 0">
          <a href="${APP_URL}/app/${slug}/admin" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Go to Dashboard →</a>
        </div>
        <p style="color:#64748B;font-size:13px;text-align:center">Your 14-day free trial has started. No credit card required.</p>
      </div>
    `,
  });
}

export async function sendEmployeeInviteEmail({
  to, employeeName, companyName, inviteLink,
}: { to: string; employeeName: string; companyName: string; inviteLink: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${companyName} has invited you to join FoundrOS`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <div style="background:#1A1A2E;padding:24px;border-radius:12px;text-align:center;margin-bottom:32px">
          <h1 style="color:white;margin:0;font-size:28px">FoundrOS</h1>
        </div>
        <h2 style="color:#1A1A1A">Hi ${employeeName},</h2>
        <p style="color:#64748B;line-height:1.6"><strong>${companyName}</strong> has invited you to join FoundrOS — their HR & payroll platform. You'll be able to check in, view your salary slips, and apply for leaves.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${inviteLink}" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Set up your account →</a>
        </div>
        <p style="color:#64748B;font-size:13px;text-align:center">This link expires in 7 days. If you didn't expect this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendSalarySlipEmail({
  to, employeeName, companyName, month, year, netSalary, downloadUrl,
}: { to: string; employeeName: string; companyName: string; month: string; year: number; netSalary: number; downloadUrl: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your salary slip for ${month} ${year} is ready — ${companyName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <div style="background:#1A1A2E;padding:24px;border-radius:12px;text-align:center;margin-bottom:32px">
          <h1 style="color:white;margin:0;font-size:28px">FoundrOS</h1>
        </div>
        <h2 style="color:#1A1A1A">Hi ${employeeName},</h2>
        <p style="color:#64748B">Your salary slip for <strong>${month} ${year}</strong> from ${companyName} is ready.</p>
        <div style="background:white;border:1px solid #E2E8F0;border-radius:12px;padding:32px;text-align:center;margin:24px 0">
          <p style="color:#64748B;margin:0 0 8px">Net Salary</p>
          <p style="color:#1A1A2E;font-size:36px;font-weight:700;margin:0">₹${netSalary.toLocaleString("en-IN")}</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${downloadUrl}" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Download Salary Slip</a>
        </div>
      </div>
    `,
  });
}

export async function sendLeaveApprovedEmail({
  to, employeeName, fromDate, toDate, leaveType, remainingBalance,
}: { to: string; employeeName: string; fromDate: string; toDate: string; leaveType: string; remainingBalance: number }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your leave request has been approved",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <h2 style="color:#1A1A1A">Hi ${employeeName},</h2>
        <p style="color:#64748B">Great news! Your <strong>${leaveType}</strong> leave request has been <span style="color:#10B981;font-weight:600">approved</span>.</p>
        <div style="background:white;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:24px 0">
          <p style="margin:0 0 8px;color:#64748B;font-size:14px">Leave dates</p>
          <p style="margin:0;color:#1A1A1A;font-weight:600">${fromDate} to ${toDate}</p>
          <p style="margin:16px 0 8px;color:#64748B;font-size:14px">Remaining ${leaveType} balance</p>
          <p style="margin:0;color:#1A1A1A;font-weight:600">${remainingBalance} days</p>
        </div>
        <p style="color:#64748B;font-size:14px">Enjoy your time off!</p>
      </div>
    `,
  });
}

export async function sendLeaveRejectedEmail({
  to, employeeName, fromDate, toDate, leaveType, reason,
}: { to: string; employeeName: string; fromDate: string; toDate: string; leaveType: string; reason?: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Update on your leave request",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <h2 style="color:#1A1A1A">Hi ${employeeName},</h2>
        <p style="color:#64748B">We wanted to let you know that your <strong>${leaveType}</strong> leave request for <strong>${fromDate} to ${toDate}</strong> could not be approved at this time.</p>
        ${reason ? `<div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:20px 0"><p style="color:#92400E;margin:0;font-size:14px"><strong>Reason:</strong> ${reason}</p></div>` : ""}
        <p style="color:#64748B">Please feel free to apply again with different dates or reach out to your HR manager for more details.</p>
      </div>
    `,
  });
}

export async function sendTrialEndingSoonEmail({
  to, name, companyName, slug, employeeCount, daysLeft,
}: { to: string; name: string; companyName: string; slug: string; employeeCount: number; daysLeft: number }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your FoundrOS trial ends in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <h2 style="color:#1A1A1A">Hi ${name},</h2>
        <p style="color:#64748B">Your FoundrOS trial for <strong>${companyName}</strong> ends in <strong>${daysLeft} day${daysLeft > 1 ? "s" : ""}</strong>.</p>
        <div style="background:white;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin:24px 0">
          <p style="color:#64748B;margin:0 0 8px;font-size:14px">What you've set up</p>
          <p style="color:#1A1A1A;font-weight:600;margin:0">${employeeCount} employee${employeeCount !== 1 ? "s" : ""} added</p>
        </div>
        <p style="color:#EF4444;font-size:14px">After your trial, you'll lose the ability to add employees, run payroll, and track attendance until you subscribe.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/${slug}/billing/subscribe" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Upgrade now →</a>
        </div>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail({
  to, name, slug,
}: { to: string; name: string; slug: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Action needed: payment failed for your FoundrOS account",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <h2 style="color:#1A1A1A">Hi ${name},</h2>
        <p style="color:#64748B">We were unable to process your payment for FoundrOS. This happens sometimes — don't worry, your data is safe.</p>
        <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:20px 0">
          <p style="color:#92400E;margin:0;font-size:14px">You have a <strong>3-day grace period</strong> to update your payment method before your account is suspended.</p>
        </div>
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/${slug}/billing/reactivate" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Update payment method</a>
        </div>
      </div>
    `,
  });
}

export async function sendAccountSuspendedEmail({
  to, name, slug,
}: { to: string; name: string; slug: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your FoundrOS account has been suspended",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#F8FAFC">
        <h2 style="color:#1A1A1A">Hi ${name},</h2>
        <p style="color:#64748B">Your FoundrOS account has been suspended due to a failed payment. You can still log in and view your data.</p>
        <div style="background:#FEE2E2;border:1px solid #EF4444;border-radius:8px;padding:16px;margin:20px 0">
          <p style="color:#991B1B;margin:0;font-size:14px">New employees cannot be added, payroll cannot be run, and attendance cannot be tracked until you reactivate.</p>
        </div>
        <p style="color:#64748B;font-size:14px">Your data is safe and will be retained for 90 days.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/${slug}/billing/reactivate" style="background:#E94560;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Reactivate account</a>
        </div>
      </div>
    `,
  });
}
