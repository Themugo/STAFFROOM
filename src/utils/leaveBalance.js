import { differenceInMonths, parseISO } from "date-fns";

/**
 * Finds the most specific active LeaveAccrual rule that applies to this
 * employee for this leave type, or null if none match (falls back to
 * LeavePolicy in that case). Mirrors the matching rule described in the
 * Accrual Config tab's own info banner: "Rules are matched per employee
 * based on their employment type and department. If multiple rules match,
 * the most specific one wins. Rules with no scope filters apply to everyone."
 */
export function resolveAccrualRule(accrualRules, leaveType, employee) {
  const candidates = (accrualRules || []).filter(r =>
    r.is_active !== false &&
    r.leave_type === leaveType &&
    (!r.applies_to_employment_types?.length || r.applies_to_employment_types.includes(employee?.employment_type)) &&
    (!r.applies_to_departments?.length || r.applies_to_departments.includes(employee?.department))
  );
  if (!candidates.length) return null;

  // Specificity: a rule scoped to both employment type AND department beats
  // one scoped to only one, which beats a rule with no scope (applies to all).
  const scored = candidates.map(rule => ({
    rule,
    score: (rule.applies_to_employment_types?.length ? 1 : 0) + (rule.applies_to_departments?.length ? 1 : 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].rule;
}

// Months accrued so far this calendar year (or since join date, if later).
// Shared definition so "how much has accrued so far" means the same thing
// everywhere it's computed.
function monthsAccruedThisYear(employee) {
  const startDate = employee?.start_date ? parseISO(employee.start_date) : new Date();
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const accrualFrom = startDate > yearStart ? startDate : yearStart;
  return Math.max(0, differenceInMonths(new Date(), accrualFrom));
}

function tenureYears(employee) {
  if (!employee?.start_date) return 0;
  const months = Math.max(0, differenceInMonths(new Date(), parseISO(employee.start_date)));
  return months / 12;
}

function findTenureBand(bands, years) {
  const sorted = [...(bands || [])].sort((a, b) => (a.min_years || 0) - (b.min_years || 0));
  return sorted.find(b => years >= (b.min_years || 0) && (b.max_years == null || years < b.max_years))
    || sorted[sorted.length - 1] // beyond the highest band's max_years: stay on the top band
    || null;
}

// Entitlement as defined by a LeaveAccrual rule (fixed_annual / monthly_rate /
// tenure_bands / unlimited), including proration for employees who joined
// partway through the year and the rule's accrual cap.
function computeEntitledFromRule(rule, employee) {
  if (rule.accrual_method === "unlimited") return 999;

  const cap = rule.accrual_cap || Infinity;

  if (rule.accrual_method === "fixed_annual") {
    let days = rule.fixed_days || 0;
    if (rule.prorate_on_join && employee?.start_date) {
      const startDate = parseISO(employee.start_date);
      const yearStart = new Date(new Date().getFullYear(), 0, 1);
      if (startDate > yearStart) {
        const monthsRemaining = Math.max(0, 12 - startDate.getMonth());
        days = days * (monthsRemaining / 12);
      }
    }
    return Math.min(days, cap);
  }

  if (rule.accrual_method === "monthly_rate") {
    const months = monthsAccruedThisYear(employee);
    return Math.min(months * (rule.monthly_rate || 0), cap);
  }

  if (rule.accrual_method === "tenure_bands") {
    const band = findTenureBand(rule.tenure_bands, tenureYears(employee));
    if (!band) return 0;
    const monthlyRate = (band.days_per_year || 0) / 12;
    const months = monthsAccruedThisYear(employee);
    return Math.min(months * monthlyRate, cap);
  }

  return 0;
}

/**
 * Computes how many days an employee is entitled to for a given leave type,
 * as of "now". This is the single source of truth for entitlement — used by
 * the Leave Balances tab, the Review modal, and Self-Service so all three
 * agree on the same number.
 *
 * If a matching, active LeaveAccrual rule exists for this employee + leave
 * type (via resolveAccrualRule), it takes priority — this is the richer
 * system (tenure bands, department/employment-type scoping, proration, caps)
 * configured in the "Accrual Config" tab. Otherwise falls back to the
 * simpler LeavePolicy (accrual_type: fixed | accrual | unlimited) configured
 * in "Policy Settings".
 */
export function computeEntitled(policy, employee, accrualRules = []) {
  const rule = resolveAccrualRule(accrualRules, policy?.leave_type, employee);
  if (rule) return computeEntitledFromRule(rule, employee);

  if (!policy || !policy.is_enabled) return 0;
  if (policy.accrual_type === "unlimited") return 999;
  if (policy.accrual_type === "fixed") return policy.fixed_days_per_year || 0;
  if (policy.accrual_type === "accrual") {
    const rate = policy.accrual_rate_per_month || 0;
    const accrued = monthsAccruedThisYear(employee) * rate;
    return policy.max_accrual_cap ? Math.min(accrued, policy.max_accrual_cap) : accrued;
  }
  return 0;
}

/**
 * Computes a live, authoritative balance for one employee + leave type,
 * combining:
 *  - entitled: derived from the matching LeaveAccrual rule, or LeavePolicy
 *    as a fallback (via computeEntitled)
 *  - carried_over: read from the stored LeaveBalance record, if any
 *  - used / pending: derived live from LeaveRequest records (Approved / Pending)
 *
 * This intentionally does NOT trust a stored `entitled` value, since that
 * field is only as fresh as the last "Recalculate Accruals" run and can
 * silently drift from the actual policy/rule configuration.
 */
export function computeLiveBalance({ policy, employee, requests, storedBalance, accrualRules = [] }) {
  const entitled = computeEntitled(policy, employee, accrualRules);
  const carried = storedBalance?.carried_over || 0;
  const used = (requests || [])
    .filter(r => r.employee_id === employee?.id && r.status === "Approved" && r.leave_type === policy?.leave_type)
    .reduce((s, r) => s + (r.days_requested || 0), 0);
  const pending = (requests || [])
    .filter(r => r.employee_id === employee?.id && r.status === "Pending" && r.leave_type === policy?.leave_type)
    .reduce((s, r) => s + (r.days_requested || 0), 0);
  const totalEntitled = entitled + carried;
  const isUnlimited = entitled >= 999;
  const remaining = isUnlimited ? Infinity : Math.max(0, totalEntitled - used - pending);

  return { entitled, carried, used, pending, totalEntitled, remaining, isUnlimited };
}
