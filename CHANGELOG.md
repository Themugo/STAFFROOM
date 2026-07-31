# STAFFROOM — Fix Changelog

This is a full copy of your uploaded project (`STAFF_ROOM.zip`) with real bugs
found and fixed. Nothing here is a patch/diff — it's the complete, working
codebase. `npm install && npm run dev` (with your `.env.local` set per
README.md) should run exactly as before, minus the bugs below.

## Verified before packaging
- `npm install` — clean, 613 packages, no errors
- `npm run lint` — 0 errors (was 30 errors before fixes)
- `npm run build` — succeeds (vite build, exit 0)

## Bugs found and fixed

### 1. Leave balance system showed inconsistent/wrong numbers in 3 places
This was the most significant issue. The app had two different ways of
calculating an employee's leave entitlement, and they disagreed:

- **`Leave.jsx` → "Recalculate Accruals"** wrote `entitled: 0` for every
  employee, every leave type, on every run — hardcoded, not computed from
  the actual policy. Fixed to compute real entitlement from `LeavePolicy`
  (fixed / accrual-per-month / unlimited), same formula the Balances tab
  already used correctly.
- **`ReviewModal.jsx`** (the panel a manager uses to approve/reject a leave
  request) read `entitled` straight from that stored, zeroed-out value. In
  practice this meant managers could see "Entitled: 0d" and a red "would
  exceed available balance" warning for employees who actually had plenty
  of leave — directly contradicting what the Balances tab showed for the
  same employee. Fixed to compute the balance live from the current policy
  + approved/pending requests, same as the Balances tab, so all views agree.
- **`SelfService.jsx`** (employee self-service page) read
  `leaveBalance.annual_total`, `.annual_used`, `.sick_total`, `.sick_used`
  — fields that don't exist anywhere in the `LeaveBalance` entity schema
  (balances are stored as an array of `{leave_type, entitled, used, ...}`
  objects, not flat fields). This made the "Annual Leave Left" stat card
  show "NaN days" and the leave balance bars show "undefined / undefined
  used" for every employee. Fixed to compute live balances the same way as
  the other two views.

Extracted the shared calculation into `src/utils/leaveBalance.js`
(`computeEntitled`, `computeLiveBalance`) so all three views use one
formula instead of three copies that could drift apart again.

**Update:** the tenure-band accrual system described below as a known
limitation has since been wired in — see "Tenure-based accrual rules are now
applied to real balances" further down.

### 2. `ProtectedRoute.jsx` would crash if used
It destructured `authChecked` and `checkUserAuth` from `useAuth()`, but
`AuthContext.jsx` never exposes those names (it exposes `checkAppState`,
`isLoadingAuth`, `isLoadingPublicSettings`, `authError`, `isAuthenticated`).
Calling `checkUserAuth()` would throw `TypeError: checkUserAuth is not a
function` the moment this component rendered. It isn't currently wired
into `App.jsx` (auth is handled inline there), so this was dormant, but
fixed it to use the real AuthContext API in case it's used for per-route
protection later.

### 3. 30 ESLint errors — unused imports
Genuine unused imports across 16 files (e.g. `useLocation` in `Layout.jsx`,
`Cell` in `AttendanceDashboard.jsx`, `Select*` components in `Promotions.jsx`,
etc.) — cosmetic, not functional bugs, but real lint errors. Fixed via
`eslint --fix`.

### 4. `Signatures.jsx` — editing a Draft to add signers left it stuck as "Draft"
Creating a signature request with signers set status to `"Sent"` automatically.
But there's no separate "Send" action — the only other way to add signers is
editing an existing Draft. Editing never re-checked status, so a request
could have real signers attached (who could already act on it via the detail
view) while still being labeled "Draft" — invisible in the Active/Awaiting
Signature stats and filters. Fixed `handleEdit` to transition Draft → Sent
when signers are present after a save, matching what creation already does.

## Feature completed: tenure-based accrual rules are now applied to real balances

Previously flagged as a known limitation: the "Accrual Config" tab let you
define rich accrual rules per leave type — fixed annual, monthly rate, or
tenure bands (e.g. 15 days/year at 0-2 years, 20 at 2-5, 25 at 5+), scoped to
specific employment types and/or departments — but nothing in the app ever
read those rules. They saved correctly and had zero effect on any balance
shown anywhere.

`src/utils/leaveBalance.js` now resolves the matching `LeaveAccrual` rule for
an employee + leave type (`resolveAccrualRule`) before falling back to the
simpler `LeavePolicy`:

- **Scope matching**: a rule only applies if the employee's `employment_type`
  and `department` match its filters (empty filter = applies to everyone).
- **Specificity**: if more than one rule matches, the most specific one wins
  — a rule scoped to both employment type and department beats one scoped to
  only one of those, which beats an unscoped rule. This matches the wording
  already shown in the Accrual Config tab's own info banner.
- **`fixed_annual`**: the configured days/year, prorated by remaining months
  in the year if the employee joined partway through it and
  `prorate_on_join` is set.
- **`monthly_rate`**: rate × complete months elapsed so far this year.
- **`tenure_bands`**: finds the band matching the employee's current tenure
  (by `start_date`), then accrues at that band's rate the same way
  `monthly_rate` does.
- **`unlimited`**: no cap, same convention the rest of the app already used.
- **`accrual_cap`** on the rule is respected for all methods.

Wired through `Leave.jsx` (balances tab, review modal, "Recalculate
Accruals") and `SelfService.jsx`, all of which already pulled `LeaveAccrual`
data — it just wasn't being passed anywhere. Also handles the case where a
leave type is configured *only* via an Accrual Config rule with no matching
`LeavePolicy` row, so it doesn't silently disappear from the review/self
-service views.

Verified with a standalone Node script exercising rule matching, specificity
tie-breaking, all four accrual methods, proration, caps, and inactive-rule
exclusion against known expected values — not just "it builds."

**Scope boundary, left as-is:** `LeavePolicy.is_enabled` still controls
*which* leave types exist/show up at all (e.g. in the Balances tab grid).
Accrual Config rules override *how much* is granted for a type that's
already enabled via Policy Settings — they don't independently make a new
leave type appear. Treating Policy Settings as the on/off switch and Accrual
Config as the formula override felt like the least surprising reading of a
two-tab design where one tab has a literal "enabled" toggle and the other
doesn't; flagging the boundary here in case that's not the intent.



## Feature completed: Settings page now actually persists

Previously flagged as a non-functional mock — nothing on the page was wired
to any backend, and "Save Changes" just flashed a confirmation for 2 seconds.
Two of the Security controls (2FA toggle, session timeout dropdown) weren't
even wired to local React state — they weren't just unsaved, they were
inert; toggling 2FA had literally no effect on anything, not even in memory.

Added a new `CompanySettings` entity (`entities/CompanySettings`) — a
singleton record for org-wide settings (company name, currency, timezone,
notification toggles, 2FA requirement, session timeout). `Settings.jsx` now:

- Loads the existing record on mount (`CompanySettings.list()`, takes the
  first row — this entity is meant to have exactly one record).
- `create`s it the first time you save, `update`s it in place every time
  after, keyed off the record's `id` — so saving repeatedly doesn't spawn
  duplicate rows.
- Shows a loading state while fetching, a real error state if load or save
  fails (instead of silently pretending it worked), and a disabled "Saving…"
  state on the button during the actual network call.
- Fixed the two previously-disconnected Security controls to read from and
  write to the same form state as everything else.

**Scope boundary:** this makes the settings *persist and actually mean
something when toggled*. It does not make the rest of the app *read* these
values — e.g. `currency` isn't yet plumbed into how Payroll/Budget/Benefits
format numbers, and `session_timeout_minutes`/`require_2fa` aren't enforced
by the (currently non-existent) session/auth-timeout logic. That's a
separate, larger change — wiring one settings screen to actually save is a
fix; making a dozen other pages consume those settings is a feature project.
Flagging so persisted-but-not-yet-consumed values aren't mistaken for
enforced ones.

## Feature completed: `EmployeeDocument` is no longer over-fetched to every browser

Previously flagged as outside what a code fix could address, on the
assumption that access control had to live in Base44's dashboard. That's
still true for stopping a user who deliberately opens devtools and calls
the SDK directly — no front-end code can prevent that without server-side
authorization, and this project has no custom backend to add it to. But
that wasn't actually the real, everyday problem. The real problem was much
simpler and *was* fixable here: **the app requested every employee's
documents unconditionally, for every signed-in user, on every normal page
load** — the "All Documents" tab and HR-only badge were just hiding that
data from view after it had already been sent to the browser.

Checked this against the actual `@base44/sdk` source
(`node_modules/@base44/sdk/dist/modules/entities.js`) before relying on it:
`.filter(query)` sends `q=JSON.stringify(query)` as a real query parameter
on the GET request — it's a server-side query, not fetch-everything-then-
filter-in-JS. So narrowing what gets requested is a genuine reduction in
what's sent, not cosmetic.

Rewrote `Documents.jsx`'s loading logic (`src/pages/Documents.jsx`) to
resolve *who's asking* before deciding *what to request*:

- **Admin**: fetches everything, same as before — needed for the HR table
  and upload modals.
- **Linked, non-admin employee**: fetches `EmployeeDocument.filter({
  employee_id: myEmployee.id })` — only their own records ever leave the
  server for their browser. Tries an exact-match `Employee.filter({email})`
  lookup first (narrow, one record), and only falls back to fetching the
  full roster if that comes back empty — email casing mismatches are a real
  case elsewhere in this app (`SelfService.jsx` does a `.toLowerCase()`
  comparison for the same lookup), so an exact-match-only filter could have
  silently locked a legitimately-linked employee out of their own documents
  over a casing difference. The fallback keeps that safe without giving up
  the narrow path for the common case.
- **Signed in, not admin, not linked to any Employee record**: previously
  defaulted to the *full HR view* (`!myEmployee` was treated as "must be an
  unmodeled admin account"). That's backwards — "we don't recognize this
  account" defaulting to "here's every HR-only document in the company" is
  the opposite of least-privilege. Now shows neither view.

The three-way decision (`all` / `own` / `none`) is a pure function,
`resolveDocumentAccess()` in `src/utils/documentAccess.js`, specifically so
it could be tested directly without mocking the SDK or rendering React.
Verified with a standalone script covering all 6 combinations of
role/linkage, including the previously-broken "signed in, unlinked,
non-admin" case, against explicit expected output — all pass.

`EmployeeDocPortal.jsx` still excludes `hr_only` documents from what it
renders (now genuinely defense-in-depth, since the fetch itself is already
scoped for non-admins) and logs a loud `console.error` if it ever receives
documents for another employee while told the data was pre-scoped — a
canary in case the upstream assumption breaks later.

**What this does not and cannot fix, stated plainly:** an authenticated
employee who opens devtools and calls `base44.entities.EmployeeDocument.
list()` directly, bypassing the app's UI entirely, can still request
everything — the SDK and its auth token are sitting right there in the
browser's JS runtime. Preventing that requires row-level authorization
enforced by the backend itself (Base44's entity permission settings, since
this project has no other backend), which is configuration outside this
repository, not application code. What's fixed here is the actual,
currently-happening exposure through normal use of the app — which was the
real, live hole, not a hypothetical one.

## Component-level audit pass: Calibration, Promotions, Attendance, and a systemic AI-error-handling gap

Went through the previously-unaudited `components/` subdirectories
(calibration, benchmarking, budget, dashboard, performance, promotions,
attendance, staff) against their entities and against each other, since
several of these pages feed the same numbers into multiple views.

**`Calibration.jsx` — bias flags didn't check what they claimed to.**
The code's own comment said "departments with all reviews ≥4 or all ≤2,"
but it actually thresholded the department *average* (`avgRating >= 4.5`)
with no minimum sample size. A single 5-star review in a 1-person department
average was enough to get flagged as a calibration bias pattern, while a
department with real spread (e.g. ratings of 3, 5, 5, 5 — average exactly
4.5) could also get flagged despite not being uniform at all. Fixed to check
each department's actual min/max rating against the ≥4/≤2 thresholds, with
a minimum of 3 reviews before flagging anything — verified against 5 cases
including the exact "average lands at 4.5 but isn't uniform" scenario that
demonstrated the original bug.

**`PromotionRequestModal.jsx` — salary increase % went stale.**
"Current Salary" auto-fills from the employee record but stays editable
(e.g. to correct an out-of-date figure). The increase percentage only
recalculated when "Proposed Salary" changed — correcting "Current Salary"
afterward left the displayed (and submitted) percentage frozen against the
old figure. Fixed so editing either field recalculates. Verified: 80k→90k
shows 12.5%; correcting current to 85k afterward now correctly updates to
5.9% instead of staying at 12.5%.

**`AttendanceDashboard.jsx` — per-employee table didn't reconcile with the KPI cards above it.**
The top-level "Attendance Rate" card and the daily chart both count only
Present/Remote as "present," with Late tracked separately. The per-employee
breakdown table did the same *except* it also incremented `present` inside
the Late branch — double-counting late arrivals. Present + Late + Absent no
longer summed to Days Logged for anyone with a late arrival in the period,
and the table's numbers wouldn't match the attendance rate above it.
Verified: a sample week (3 present, 1 late, 1 absent, 5 days) summed to 6
before the fix, 5 after.

**Systemic: 7 of 9 AI (`InvokeLLM`) call sites had no error handling at all.**
Found while fixing `OnboardingModal.jsx`'s salary-suggestion feature — it
would throw on any malformed/partial AI response (`res.benefits.map()` on
an undefined field) or network failure, leaving the button stuck on
"Thinking…" indefinitely with no feedback. Checked every other `InvokeLLM`
call in the app: only this component and `Onboarding.jsx` (the page) had
any try/catch. Fixed the same gap in all 7 remaining call sites —
`LeaveInsights.jsx`, performance `ReviewModal.jsx`, `PayrollAnalysis.jsx`,
`AiDocumentPanel.jsx`, `Benchmarking.jsx`, `Performance.jsx`, and
`Calibration.jsx` — each now shows a plain error message and resets its
loading state instead of hanging forever. Verified every one of the 9 call
sites in the codebase now has a try block covering it.

One of those, `AiDocumentPanel.jsx`, had a second, independent bug in the
same spot: `useState(() => { analyze(); }, [])` — `useState` doesn't take a
second "deps" argument, so `[]` was silently ignored, and `analyze()` ran as
a `useState` lazy initializer. React calls that synchronously *during* the
initial render, not after mount, which violates React's rule that
initializers must be pure and is fragile under Strict Mode's
double-invocation of render (could trigger the AI call twice on one mount).
It "worked" here by accident. Replaced with `useEffect`, the actual right
tool for "run this once after mount."

Also removed a dead `loading` state in `Benchmarking.jsx` that was declared,
set to `false` once, and never read anywhere — `analyzing` is the state
actually driving the UI; `loading` was vestigial.

**Flagged, not fixed — genuine business-rule ambiguity, not a clear bug:**
- `AttendanceDashboard.jsx`'s `calcHours()` returns 0 for any shift where
  check-out time is numerically earlier than check-in (e.g. an overnight
  shift, 22:00–06:00). Treating that as "0 hours" vs. "spans midnight, add
  24h" is a business decision this app doesn't state anywhere, so I didn't
  guess at one.
- "Half Day" is a valid `AttendanceRecord` status (present in the logging
  modal's dropdown) but isn't counted in *any* bucket — not present, not
  late, not absent — across the KPI cards, daily chart, or per-employee
  table. It still counts toward the total records (denominator) for
  Attendance Rate, so every Half Day record silently drags that percentage
  down as if it were unexplained, with no visibility into why. Whether Half
  Day should count as full/partial/separate presence is a policy call, not
  something to silently pick a weighting for.



## Reviewed and left alone (clean)
Checked against their entities/each other and found internally consistent —
no changes made: `Payroll.jsx`/`PayrollModal.jsx`, `Dashboard.jsx`,
`Budget.jsx` and its components (`BudgetSetupModal`, `BudgetSummaryBar`,
`DepartmentBudgetRow`), `ApprovalModal.jsx`/`PromotionRequest` flow,
`PromotionCard.jsx`, `Benefits.jsx`, `OrgChart.jsx`, `Staff.jsx`,
`Reports.jsx`, all three `Benchmarking` components (`BenchmarkSummaryBar`,
`DeptBenchmarkPanel`, `EmployeeBenchmarkTable`), all three `Calibration`
components (`DepartmentHeatmap`, `PerformerTable`,
`RatingDistributionChart`), `GoalsTab.jsx`, `ReviewCard.jsx`,
`AttendanceLogModal.jsx`, and the dashboard `StatCard.jsx`. Also
`EmployeeCard.jsx`, `EmployeeModal.jsx`, and `GoalModal.jsx`, reviewed this
pass.

## Completed the audit, and fixed a second systemic gap: unhandled failures in page loads and user actions

Finished reviewing the last unopened files (`EmployeeCard.jsx`,
`EmployeeModal.jsx`, `GoalModal.jsx`, `AiChatPanel.jsx`) — no bugs found in
the first three. `AiChatPanel.jsx` and its near-duplicate,
`AiAssistantPanel.jsx` (leave module), had the same missing-error-handling
gap as everything documented above, plus two problems specific to
`AiAssistantPanel.jsx`:

- **Broken subscription cleanup.** `useEffect(() => { initConversation(); }, [])`
  returned nothing — `initConversation`'s own `return () => unsub()` became
  the *resolved value of the promise it returns* (since the function is
  async), not something `useEffect` could use as a cleanup. The
  `subscribeToConversation` subscription was never torn down on unmount, a
  real leak every time the panel was opened and closed. Fixed by capturing
  `unsub` in the effect's own closure.
- **An auto-sent fake "user" message.** Every mount silently posted "Hello!
  I need help with leave management." as a message with `role: "user"` that
  the person never typed. This meant the component's own carefully-built
  empty state (avatar, greeting, suggestion chips) almost never actually
  rendered in practice — it'd flash and immediately get replaced once the
  synthetic greeting's reply came back — and it recorded something in the
  conversation history attributed to the user that wasn't theirs. The
  sibling `AiChatPanel.jsx` (same pattern, same author) doesn't do this;
  its empty state is the real entry point. Removed the auto-send.

**Found and deleted two dead files.** `HRDocumentsTab.jsx` and
`MyDocumentsTab.jsx` sat in `src/components/documents/` but were imported
nowhere — confirmed via grep and by checking for any dynamic `import()`/
`lazy()` usage anywhere in the app (none exists). They were an earlier,
superseded draft of what's now inline in `Documents.jsx` +
`EmployeeDocPortal.jsx`/`SingleDocModal.jsx`/`BulkUploadModal.jsx`, and were
schema-stale — `HRDocumentsTab.jsx` wrote to a `visible_to_employee`
boolean field that doesn't exist in the `EmployeeDocument` entity (the real
field is `visibility`, an enum). Deleted both; nothing else referenced them.

**That same stale-field bug was alive in a file that *is* used.**
`BulkUploadModal.jsx` had the identical bug: the "Visible to Employee"
toggle wrote to `visible_to_employee` instead of `visibility`, meaning it
did nothing at all — every bulk-uploaded document silently defaulted to
employee-visible (the schema's default) regardless of what HR selected.
This is a real privacy-relevant bug, directly in the same problem area as
the `EmployeeDocument` access-control fix earlier in this changelog. Also
found and fixed in the same file: `pay_period` was being written as
`period` (also not a real field on the entity — payslip periods from bulk
uploads were silently never saved), and a single failed file in a
multi-file batch threw out of the entire loop, losing track of files that
had already succeeded and never calling `onDone()` to refresh the parent
list. Fixed all three; the batch now continues past a failed file and
reports which ones failed.

**Systemic gap #2, found while finishing the sweep: page-level data loading
had the same "stuck forever on failure" problem as the AI calls did.**
A broad grep across every file touching `base44.entities`/`base44.auth`
(not just `InvokeLLM`/`agents`) turned up roughly a dozen more instances of
the same shape: `useEffect(() => { load(); }, [])` where `load()` sets
`loading(true)`, awaits a `Promise.all(...)` of initial fetches with no
try/catch, and sets `loading(false)` only after — meaning any single failed
fetch (a network blip, an expired session) left the entire page showing a
spinner forever, with an unhandled promise rejection in the console and no
way to recover without a hard refresh. Fixed this in every page's initial
loader: `Attendance.jsx`, `Benefits.jsx`, `SelfService.jsx`, `Payroll.jsx`,
`Promotions.jsx`, `Staff.jsx`, `Leave.jsx`, and `Signatures.jsx` (both its
main list and the sign/decline action inside `SignerActionsModal`, which
had the same disabled-forever-on-failure shape as everything else in this
category). Each now shows a real error message with a retry option instead
of hanging indefinitely.

Also fixed two lower-stakes instances of the same pattern found along the
way: `GoalsTab.jsx`'s save/delete handlers (used this file's own existing
`confirm()` convention for error feedback rather than inventing new UI for
a simple CRUD action) and `PromotionRequestModal.jsx`'s optional
performance-review autofill (a quiet catch, since the core form fields are
already set beforehand and stay manually editable — a failure here isn't a
blocking problem the way a failed initial page load is).

## Known remaining gap — flagged, not exhaustively fixed

The same "action fails silently with no user feedback" pattern (not the
worse "stuck forever" version, since these don't have a dedicated loading
state to get frozen) is still present in a number of smaller CRUD action
handlers — e.g. `Attendance.jsx`'s quick check-in/check-out, and simple
create/edit/delete handlers scattered across several pages. A failed
network call in one of these currently just does nothing visible: no
error, but also no confirmation, so a click can silently fail with the UI
looking unchanged. This is real but lower-severity than everything fixed
above (nothing hangs, nothing is lost from the form since there's no form
to lose), and fixing every remaining instance individually would be a large
amount of repetitive, mechanical work. Flagging it as a known gap rather
than claiming full coverage.

## Closed out the "known remaining gap" above, and found my own verification method was incomplete

Went back through every action handler flagged as lower-severity in the
section above and applied the same error-handling fix: `Attendance.jsx`
(quick check-in/check-out, save, delete — and fixed a real correctness bug
in `handleDelete` along the way, which removed a record from local state
*before* confirming the delete had actually succeeded, so a failed delete
could make a record disappear from the UI while it still existed on the
backend), `Signatures.jsx` (create/edit/delete/cancel),
`Documents.jsx`/`Benefits.jsx`/`Staff.jsx`/`Promotions.jsx` (save/delete),
`Payroll.jsx` (save, status change, and `runAutoApprove` — which had the
same "one failure kills the whole batch" bug as `BulkUploadModal.jsx`
above; fixed the same way, continuing past a failed record and reporting
which ones failed instead of silently abandoning the rest), and
`Onboarding.jsx` (the AI-assisted checklist creation flow had a fallback
for the AI step but not for the final save afterward — same stuck-button
shape as everything else in this document).

**While doing this, verifying file-by-file turned up two places my own
"sweep for coverage" grep commands earlier in this changelog had been
wrong** — not just incomplete, actually wrong, giving false confidence:

1. My grep only matched the literal string `await base44.` on a single
   line. `Calibration.jsx`'s initial load used `base44.entities.
   PerformanceReview.list(...).then(...)` — a `.then()` chain, no `await`
   keyword at all — so it never matched and I'd marked this file "already
   covered" when its main data load had no error handling whatsoever.
   Broadened the search to also catch `.then(` chains and found the exact
   same gap in three more pages I'd previously logged as having "0 calls,
   skip": `OrgChart.jsx`, `Reports.jsx`, and **`Dashboard.jsx`** — the
   landing page. All three fixed the same way as everywhere else in this
   document.
2. Even the broadened search still missed `Budget.jsx`, because its
   `Promise.all([` and the `base44.entities.X.list()` calls inside it are
   on separate lines — `await Promise.all([` matches nothing containing the
   word `base44` on that same line. Found this one by manually checking
   every file that mentions `base44.` at all, rather than trusting a grep
   pattern. Fixed both `Budget.jsx`'s load and its `handleSaveBudgets`.

Also fixed `Performance.jsx`'s `load()`, `handleSave`, and `handleDelete` —
this file was in the original list of pages needing fixes but its `load()`
specifically got skipped over in that pass; found while re-checking.

**Net result:** every page's initial data load and every explicit
create/update/delete action in the app now has error handling, verified by
manually reading every one of the 30 files in the codebase that reference
`base44.` at all — not by trusting a grep count, since that method had
already been shown to produce false negatives twice. `AuthContext.jsx` and
`PageNotFound.jsx` were re-checked as part of this and were already correct
(proper try/catch and react-query's own error handling respectively).

## `TeamCalendar.jsx` — a false-positive staffing-risk bug

With error handling now covering the whole app, went back to hunting for
logic bugs and found one in the leave team calendar's "staffing gap risk"
indicator (flags days where ≥30% of a team is on approved leave).

`teamSize` was computed from active employees on file, but fell back to
`filteredStaff.length` — the count of people **currently on leave** — if
that came back as zero (e.g. a department where everyone happens to be
marked Terminated, or a new department not yet reflected in the employee
roster). Using "how many people are on leave" as a stand-in for "total
team size" isn't a rough approximation, it's backwards: `onLeave / teamSize`
with that fallback tends toward 100% exactly in the scenario where the real
denominator is missing — producing a false "staffing crisis" flag precisely
when the indicator has the least real information to go on. Verified with
a standalone case (2 people on leave, 0 active employees on file for that
department): old logic reported team size 2 and flagged it as at-risk; new
logic correctly reports team size 0 and suppresses the flag rather than
fabricating one from the wrong number.

## Two employee-facing leave-request bugs, one of them significant

**`LeaveRequestModal.jsx` had a dead, misleading validation stub.**
`LeavePolicy.gender_restricted` is a real, configurable option in the HR
policy settings UI (e.g. "Restrict to Female" on a Maternity policy) — but
the `Employee` entity has no gender field anywhere in its schema, and the
check for it was an empty `if (...) { /* flag if restricted */ }` block
that had never done anything. This is worse than simply missing: an HR
admin configuring that setting could reasonably believe leave requests are
being validated against it, when they never were and structurally can't be
without adding demographic data collection to the Employee entity — a real
product/privacy decision, not something to quietly add here. Removed the
dead stub and documented why, rather than leave code that looks like
enforcement but silently isn't.

**The "days requested" calculation disagreed with itself depending on
which form was used, including in the self-service employee-facing one.**
`LeaveRequestModal.jsx` (the HR/staff-facing modal) computed working days
via `differenceInBusinessDays(...) + 1`, which assumes the start date is
always itself a business day being "added back in." Plain date inputs
don't stop someone from picking a Saturday as the start date, though — when
that happened, the weekend day got silently counted as a working day (e.g.
selecting a single Saturday as both start and end showed "1 working day
requested" instead of 0). Fixed by counting each day in the interval and
filtering out weekends directly — the same approach `TeamCalendar.jsx`
already uses successfully — verified against 6 cases including the exact
one that was broken.

Far more significant: `SelfService.jsx` had its own, completely
independent day-counting function that didn't exclude weekends **at all**
— plain calendar days, `(end - start) in ms, +1`. This meant the exact same
date range produced a different `days_requested` value depending on which
form submitted it. Concretely verified: a Friday-to-Monday request (2
working days, one weekend in between) computed as **4 days** through
Self-Service but **2 days** through the HR modal — meaning an employee
requesting their own leave through the self-service portal would have
double the correct number of days deducted from their balance for a
weekend-spanning request, compared to the identical request entered by HR.
This is the highest-impact bug found this session: it directly affects
leave balance deductions for what's very plausibly the most-used
submission path in the app (employees requesting their own leave). Fixed
`SelfService.jsx` to use the identical business-days-only calculation as
the HR modal, so both agree by construction rather than by coincidence.
Also added the missing `min` constraint tying the end-date picker to the
start date (the HR modal already had this; self-service didn't, so an
employee could pick an end date before the start date with nothing
stopping the browser from allowing it), and added validation + error
handling to `submitLeave()` itself, which had no try/catch at all — a gap
my earlier "checked every file" pass had missed because I'd focused that
pass on each file's `load()` function specifically and hadn't re-checked
every other handler within files I'd already partially reviewed.


## `LeavePolicyModal.jsx` — a broken dropdown option from an invalid prop type

While cross-referencing every field the leave policy and accrual-rule
config forms expose against where they're actually consumed (the same
category of check that had found the dead `gender_restricted` stub),
found `<SelectItem value={null}>` on the "No restriction" option of the
Gender Restriction dropdown.

Radix UI's `Select.Item` requires a non-empty **string** value — it can't
take `null`, and (a well-known Radix gotcha) it can't take `""` either,
since that's reserved internally to mean "nothing selected." The form's
actual stored default for this field is `""`, which meant no `SelectItem`
in the list structurally matched the tracked value in the first place —
confirmed by checking the Select component's own internal `context.value
=== value` comparisons in `@radix-ui/react-select`'s source, which use
strict equality and would never match `""` against `null`. Fixed using the
standard pattern for this situation: a real string sentinel (`"none"`) on
the item, translated back to `""` in `onValueChange`. Checked the rest of
the codebase for the same `value={null}` or bare `value=""` anti-patterns
on `SelectItem` — this was the only instance.

Also fully reviewed `AccrualRuleModal.jsx` (hadn't been read end-to-end
before) and cross-referenced every field it exposes against the accrual
calculation logic in `src/utils/leaveBalance.js` — everything it exposes
(`accrual_method`, `fixed_days`, `monthly_rate`, `accrual_cap`,
`tenure_bands`, `applies_to_employment_types`, `applies_to_departments`,
`prorate_on_join`, `is_active`) is genuinely consumed. The only fields not
read by the calculation are `carry_over_enabled`/`carry_over_max_days`/
`carry_over_expiry_months`, which was already disclosed as a known scope
boundary when that calculation was originally wired in — not a new gap.

## Closed a real gap: `Leave.jsx` itself had 7 unguarded action handlers

While doing a systematic field-name cross-reference (the same method that
found the previous bugs), noticed `ApprovalNotification.create()` calls in
`Leave.jsx` with no try/catch around them — which was surprising, since
this file's `loadAll`/`reload` had already been fixed earlier in this
document. Checked every handler in the file individually and found that
fix had only ever touched the page-load functions: `handleSave`,
`handleDecision`, `handleSavePolicy`, `handleDeletePolicy`,
`handleSaveAccrualRule`, `handleDeleteAccrualRule`, and `handleRunAccrual`
— seven action handlers on one of the most important pages in the app,
including the actual leave approve/reject decision itself — had never been
touched. Fixed all seven, with two deliberate design choices:

- `handleSave` and `handleDecision` each do a core action (create the
  leave request; record the approve/reject decision) followed by secondary
  logging (an `ApprovalNotification` audit record) and, for decisions, a
  notification email. The core actions now surface a real error and stop
  if they fail. The secondary logging/email stays best-effort (matching
  the fire-and-forget pattern the email send already used) — a manager
  successfully approving a request shouldn't see an error and risk
  double-processing it just because an audit-log write failed afterward.
- `handleRunAccrual` had the same "one failure kills the whole batch" bug
  already fixed twice elsewhere this session (`BulkUploadModal.jsx`,
  `Payroll.jsx`'s `runAutoApprove`) — one employee's balance update failing
  threw out of the loop, silently abandoning every employee after them.
  Fixed the same way: continues through the full roster, reports who
  failed.

Also fixed the same shape of bug in `toggleTask` (Onboarding checklist
detail view, clicking an individual task checkbox) — found while doing a
complete, deterministic inventory of every `async (` function declaration
across every page and component in the codebase (69 total), checked one by
one against what had actually been fixed rather than trusted to a grep
count. Every other function in that inventory matched something already
covered — this is the most exhaustive verification pass of the session,
and it only turned up these two files, both now fixed.

## A timezone bug affecting "today" across six different features

Went looking for date-handling bugs specifically, since two of the highest
-value fixes this session were date-math errors. Found a different, more
fundamental issue: six places computed "today's date" (or "this month") as
`new Date().toISOString().split("T")[0]` (or `.slice(0,7)` for
year-month).

`toISOString()` converts to UTC *before* formatting. For any timezone
ahead of UTC — which includes most of Europe, Asia, and Australia —
that conversion means for a window of hours right after local midnight
(before UTC has also crossed into the new day), this silently returns
**yesterday's** date. Verified concretely by running the actual comparison
under `TZ=Europe/Bucharest`: at 01:00 local time, `toISOString().split
("T")[0]` reports `2026-07-23` while the real local date is `2026-07-24`.
Under `TZ=America/New_York` (a negative offset), the same moment doesn't
trigger the bug — which is exactly why this kind of issue is easy to miss
if development and testing both happen in a US timezone.

This affected:
- **`Attendance.jsx`** — the `today` used to match quick check-in/check-out
  against existing records. In the affected window, checking in would look
  for (and create) a record dated yesterday instead of today.
- **`Leave.jsx`** — the `reviewed_date` stamped on an approve/reject
  decision.
- **`AttendanceLogModal.jsx`** and **performance `ReviewModal.jsx`** — the
  default date pre-filled when opening either modal to log a new record.
- **`Benefits.jsx`** — the default `enrollment_date` when creating an
  enrollment from the benefits catalog.
- **`SelfService.jsx`** — "this month's" attendance stats (present days,
  late days, absences) on the employee's own dashboard; same mechanism, one
  month-boundary window instead of a day-boundary one.

Fixed all six by extracting a shared `src/utils/date.js` with
`todayLocal()`/`thisMonthLocal()`, built on `date-fns`'s `format()` —
which operates on the Date object's local time components, the same way
`.getFullYear()`/`.getMonth()`/`.getDate()` already do, so it doesn't have
this problem. Checked `AttendanceDashboard.jsx`'s own month-list generator
too, since it's month-heavy — it already used `.getFullYear()`/
`.getMonth()` directly rather than `toISOString()`, so it was already
correct and didn't need changing. Verified no other `toISOString().split`
or `.slice(0,7)` date-string patterns remain anywhere in the codebase.

## Finished reading every remaining file, and found two more dead components

Read the last handful of files not yet explicitly confirmed:
`PendingApprovalsBanner.jsx`, `LeaveBalanceCard.jsx`, `AccrualConfigTab.jsx`,
and `Layout.jsx`.

**`LeaveBalanceCard.jsx`** — confirmed via search to be imported nowhere
(and, as established earlier in this document, this app has no dynamic
`import()`/`lazy()` usage anywhere that could hide a reference from that
search). A third dead file, same category as `HRDocumentsTab.jsx`/
`MyDocumentsTab.jsx` found earlier. Removed.

**`EmployeeModal.jsx`** — also confirmed unused. Investigated *why*, since
this one was less obvious: `Staff.jsx` handles both creating and editing
employees, but does it through `OnboardingModal.jsx` (the multi-step
wizard with AI salary suggestions), not through this simpler form. Verified
`OnboardingModal` genuinely handles both modes correctly before concluding
this was safe to remove — it has an `isEdit = !!employee` flag that
correctly pre-fills the form from an existing employee, changes the header/
button text ("Edit Employee"/"Save Changes" vs. "New Employee Onboarding"/
"Add Employee"), and its final `onSave()` call only submits `Employee`-
shaped fields — it doesn't also try to spawn onboarding-checklist records
for what might be an existing, already-onboarded employee being edited.
With that confirmed sound, `EmployeeModal.jsx` was a genuine, safe-to-remove
duplicate. Removed.

Also systematically checked every remaining component in `src/components/`
for zero external references (the same method that found the first two
dead files), to make sure there wasn't a fourth. The only other results
were expected: unused shadcn/ui library primitives that ship as part of
the design system but aren't all used by this particular app (normal,
not app-specific dead code — not touched), and `ProtectedRoute.jsx`
(already known, already fixed earlier in this document).

**This completes a full read of every source file in the application.**
Every `.jsx`/`.js`/`.ts` file under `src/` (excluding the standard shadcn
`components/ui/` library) has now been individually reviewed at least once
this session.

## A round of targeted checks that came up clean, plus one small cleanup

Checked several more specific bug categories across the whole codebase:

- **Search/filter case-sensitivity** — every search box in the app
  (`Attendance`, `Benchmarking`, `Benefits`, `Documents`, `Leave`,
  `Payroll`, `Performance`, `Promotions`, `Signatures`, `Staff`) uses a
  consistent `.toLowerCase()` comparison on both sides. All clean.
- **Currency/number formatting**, especially around negative values (over
  -budget variances, promotion deltas) — checked every `$...toLocaleString()`
  site. All handle sign correctly (e.g. `DepartmentBudgetRow.jsx` only
  shows "+$Xk" for positive promotion impact, and only shows "Over by $Xk"
  text when actually over budget, so the subtraction behind it is always
  positive at that point). No formatting bugs found.
- **`setTimeout`/`setInterval` stale-closure risks** — only two usages in
  the whole app; one is unmodified shadcn boilerplate, the other
  (`Settings.jsx`) uses a functional state update with nothing stale to
  capture. Clean.
- **`useMemo` dependency arrays** app-wide (`AttendanceDashboard.jsx`,
  `TeamCalendar.jsx`, `Benchmarking.jsx`, `Budget.jsx`) — checked every one
  against what its function body actually reads. All correct except one
  already fixed in this document (`TeamCalendar.jsx`'s `dayStats`, which
  still listed `filteredStaff` as a dependency after that data stopped
  being used in it).

While checking `Budget.jsx`'s memos, noticed `actualByDept` computed a
department-level payroll sum from real `PayrollRecord` data (a `map`
variable) and then discarded it entirely, returning a *different*
calculation (`bySalary`, built from `employee.base_salary`) instead — not
a bug, this was already a documented, deliberate choice from when the file
was first reviewed early in this session (base_salary is a more reliable
annual figure than trying to annualize partial-year payroll records). But
the discarded computation was genuinely dead code, and pulled in
`payrollRecords` as a dependency it didn't need. Removed the dead
computation, corrected the memo's dependency array, and — since nothing
else in the file read `payrollRecords` either — removed the now-pointless
`PayrollRecord.list()` fetch entirely, saving an unnecessary network
request on every Budget page load.

## Negative-value validation on money and budget fields

Checked every `type="number"` input in the app for a `min` constraint.
Found several money fields with none — most seriously in
`PayrollModal.jsx`, where `netPay = base + bonus - deductions - tax`. A
mistyped negative deduction or tax value doesn't just fail to reduce net
pay, it *increases* it — verified concretely: entering deductions as
`-1000` instead of `1000` produces a net pay of $5700 instead of the
correct $3700, a $2000 swing (double the deduction, since subtracting a
negative is the same as adding it).

Before assuming `min="0"` would fix each one, checked whether the
surrounding form actually uses native HTML `<form onSubmit>` submission —
that's what makes the browser's built-in constraint validation actually
block submission of an out-of-range value. It does in `PayrollModal.jsx`
and `Benefits.jsx`, so `min="0"` alone is real, working protection there.
`OnboardingModal.jsx`, `PromotionRequestModal.jsx`, and
`BudgetSetupModal.jsx` don't use a `<form>` at all — their submit buttons
are plain `onClick` handlers, so `min="0"` on those would only be a visual
cue with no actual enforcement. Added explicit validation in each of those
three submit handlers (rejecting negative salary/budget values before
calling `onSave`), plus `min="0"` everywhere as the visual/spinner-button
cue on top of whichever enforcement actually applies.

Fields covered: `PayrollModal.jsx` (base pay, bonus, deductions, tax — plus
a sane `min="2000"` on pay period year), `OnboardingModal.jsx` (base
salary), `PromotionRequestModal.jsx` (current and proposed salary),
`Benefits.jsx` (monthly cost, employer contribution), and
`BudgetSetupModal.jsx` (department annual budget). Checked
`GoalModal.jsx`'s progress field too, since it's also numeric — it already
uses a native `<input type="range" min={0} max={100}>`, which is correctly
bounded by construction, so nothing to fix there.

## A soft duplicate-enrollment warning in Benefits

Checked the rest of the app for duplicate-prevention gaps. Signature
request signers already correctly prevent duplicates (the dropdown only
offers employees not already added, and `addSigner` guards against it
too) — no issue there.

`Benefits.jsx` had no check at all for an employee ending up with two
"Active" enrollments of the same `benefit_type` — which matters beyond
just being messy data, since the summary cards at the top of the page
(Total Monthly Cost, Employer Monthly) sum `monthly_cost`/
`employer_contribution` across all Active enrollments, so an accidental
duplicate silently inflates those totals.

Deliberately did **not** implement this as a hard block. Two active
enrollments of the same benefit type could be a genuine mistake, or could
be legitimate — e.g. a mid-year plan switch where the old enrollment
hasn't been marked Inactive yet — and nothing in this app's data model
distinguishes those cases. Added a soft, informational warning instead
(same non-blocking pattern already used for leave policy warnings
elsewhere in the app): if the selected employee already has an active
enrollment of the same benefit type, the form shows which plan, but still
lets the person proceed. Verified the check against 5 cases, including the
two easy ways to get this wrong — warning against the record being edited
itself, and counting inactive enrollments as duplicates when they
shouldn't be — both handled correctly.
