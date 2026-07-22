import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: string[] = [];
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const weekFromNow = new Date(today.getTime() + 7 * 86400000).toISOString().split("T")[0];
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 86400000).toISOString().split("T")[0];
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 86400000).toISOString().split("T")[0];

    // 1. Birthday reminders (7 days ahead)
    // Join employees to profiles via email to get the correct auth user ID for notifications
    const { data: employees } = await supabase
      .from("employees")
      .select("id, full_name, email, date_of_birth, organization_id, hire_date")
      .not("date_of_birth", "is", null);

    // Build a lookup from email to profile ID
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .not("email", "is", null);
    const emailToProfileId = new Map<string, string>();
    if (profiles) {
      for (const p of profiles) {
        if (p.email) emailToProfileId.set(p.email.toLowerCase(), p.id);
      }
    }

    if (employees) {
      for (const emp of employees) {
        const profileId = emp.email ? emailToProfileId.get(emp.email.toLowerCase()) : null;
        if (!profileId) continue; // Skip if no matching profile
        const dob = new Date(emp.date_of_birth);
        const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86400000);
        if (daysUntil <= 7 && daysUntil >= 0) {
          await supabase.from("notifications").insert({
            user_id: profileId,
            organization_id: emp.organization_id,
            title: "Upcoming Birthday",
            message: `${emp.full_name}'s birthday is in ${daysUntil} day(s) on ${nextBirthday.toLocaleDateString()}`,
            type: "BIRTHDAY",
          });
          results.push(`Birthday reminder for ${emp.full_name}`);
        }
      }
    }

    // 2. Work anniversary reminders (7 days ahead)
    if (employees) {
      for (const emp of employees) {
        if (!emp.hire_date) continue;
        const profileId = emp.email ? emailToProfileId.get(emp.email.toLowerCase()) : null;
        if (!profileId) continue;
        const hireDate = new Date(emp.hire_date);
        const nextAnniv = new Date(today.getFullYear(), hireDate.getMonth(), hireDate.getDate());
        if (nextAnniv < today) nextAnniv.setFullYear(today.getFullYear() + 1);
        const daysUntil = Math.ceil((nextAnniv.getTime() - today.getTime()) / 86400000);
        if (daysUntil <= 7 && daysUntil >= 0) {
          const years = nextAnniv.getFullYear() - hireDate.getFullYear();
          await supabase.from("notifications").insert({
            user_id: profileId,
            organization_id: emp.organization_id,
            title: "Work Anniversary",
            message: `${emp.full_name}'s ${years}year anniversary is in ${daysUntil} day(s)`,
            type: "ANNIVERSARY",
          });
          results.push(`Anniversary reminder for ${emp.full_name}`);
        }
      }
    }

    // 3. Contract expiry alerts (30 days)
    const { data: expiringContracts } = await supabase
      .from("contracts")
      .select("id, employee_id, end_date, employee:employees(full_name, organization_id)")
      .lte("end_date", thirtyDaysFromNow)
      .gte("end_date", todayStr);

    if (expiringContracts) {
      for (const contract of expiringContracts) {
        await supabase.from("notifications").insert({
          user_id: contract.employee_id,
          organization_id: contract.employee?.organization_id,
          title: "Contract Expiry Alert",
          message: `${contract.employee?.full_name}'s contract expires on ${contract.end_date}`,
          type: "CONTRACT_EXPIRY",
        });
        results.push(`Contract expiry alert for ${contract.employee?.full_name}`);
      }
    }

    // 4. Probation reminders (90+ days on probation)
    const { data: probationEmployees } = await supabase
      .from("employees")
      .select("id, full_name, hire_date, organization_id, email")
      .eq("status", "PROBATION")
      .lte("hire_date", ninetyDaysAgo);

    if (probationEmployees) {
      for (const emp of probationEmployees) {
        const profileId = emp.email ? emailToProfileId.get(emp.email.toLowerCase()) : null;
        if (!profileId) continue;
        await supabase.from("notifications").insert({
          user_id: profileId,
          organization_id: emp.organization_id,
          title: "Probation Review Due",
          message: `${emp.full_name} has been on probation for 90+ days. Review their performance.`,
          type: "PROBATION_REVIEW",
        });
        results.push(`Probation reminder for ${emp.full_name}`);
      }
    }

    // 5. Pending leave approval reminders
    const { data: pendingLeaves } = await supabase
      .from("leave_requests")
      .select("id, employee_id, start_date, employee:employees(full_name, organization_id, email)")
      .eq("status", "PENDING")
      .gte("start_date", todayStr);

    if (pendingLeaves) {
      for (const leave of pendingLeaves) {
        const profileId = leave.employee?.email ? emailToProfileId.get(leave.employee.email.toLowerCase()) : null;
        if (!profileId) continue;
        await supabase.from("notifications").insert({
          user_id: profileId,
          organization_id: leave.employee?.organization_id,
          title: "Leave Approval Pending",
          message: `${leave.employee?.full_name}'s leave request for ${leave.start_date} is awaiting approval.`,
          type: "LEAVE_REMINDER",
        });
        results.push(`Leave approval reminder for ${leave.employee?.full_name}`);
      }
    }

    // 6. Certificate/license expiry alerts (30 days)
    const { data: expiringCerts } = await supabase
      .from("training_records")
      .select("id, employee_id, certificate_expiry, employee:employees(full_name, organization_id, email)")
      .not("certificate_expiry", "is", null)
      .lte("certificate_expiry", thirtyDaysFromNow)
      .gte("certificate_expiry", todayStr);

    if (expiringCerts) {
      for (const cert of expiringCerts) {
        const profileId = cert.employee?.email ? emailToProfileId.get(cert.employee.email.toLowerCase()) : null;
        if (!profileId) continue;
        await supabase.from("notifications").insert({
          user_id: profileId,
          organization_id: cert.employee?.organization_id,
          title: "Certificate Expiry Alert",
          message: `${cert.employee?.full_name}'s certificate expires on ${cert.certificate_expiry}`,
          type: "CERTIFICATE_EXPIRY",
        });
        results.push(`Certificate expiry for ${cert.employee?.full_name}`);
      }
    }

    // 7. Pending expense claim reminders
    const { data: pendingExpenses } = await supabase
      .from("expense_claims")
      .select("id, employee_id, title, total_amount, employee:employees(full_name, organization_id, email)")
      .eq("status", "PENDING");

    if (pendingExpenses) {
      for (const claim of pendingExpenses) {
        const profileId = claim.employee?.email ? emailToProfileId.get(claim.employee.email.toLowerCase()) : null;
        if (!profileId) continue;
        await supabase.from("notifications").insert({
          user_id: profileId,
          organization_id: claim.employee?.organization_id,
          title: "Expense Claim Pending",
          message: `Expense claim "${claim.title}" for ${claim.total_amount} is awaiting approval.`,
          type: "EXPENSE_REMINDER",
        });
        results.push(`Expense claim reminder for ${claim.employee?.full_name}`);
      }
    }

    // 8. Payroll reminder (if no payroll run in last 30 days)
    const { data: orgs } = await supabase
      .from("organizations")
      .select("id, name");

    if (orgs) {
      for (const org of orgs) {
        const { data: recentPayroll } = await supabase
          .from("payroll_runs")
          .select("id, created_at")
          .eq("organization_id", org.id)
          .gte("created_at", new Date(today.getTime() - 30 * 86400000).toISOString())
          .limit(1);

        if (!recentPayroll || recentPayroll.length === 0) {
          const { data: orgAdmins } = await supabase
            .from("profiles")
            .select("id")
            .eq("organization_id", org.id)
            .in("role", ["ADMIN", "SYSTEM_OWNER"]);

          if (orgAdmins) {
            for (const admin of orgAdmins) {
              await supabase.from("notifications").insert({
                user_id: admin.id,
                organization_id: org.id,
                title: "Payroll Reminder",
                message: `No payroll run has been processed for ${org.name} in the last 30 days.`,
                type: "PAYROLL_REMINDER",
              });
              results.push(`Payroll reminder for ${org.name}`);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, details: results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
