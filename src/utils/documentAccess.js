/**
 * Pure decision function for what document scope a user gets. Kept separate
 * from Documents.jsx so it can be exercised directly without mocking the
 * base44 client or rendering React.
 *
 * - HR (admin role): sees everything.
 * - Linked, non-admin employee: sees only their own documents.
 * - Signed in but not linked to any Employee record, and not admin: sees
 *   nothing (previously this case defaulted to the HR view, which was
 *   backwards — "we don't recognize you" should not mean "so here's every
 *   HR-only document in the company").
 */
export function resolveDocumentAccess(user, myEmployee) {
  const isHR = user?.role === "admin";
  if (isHR) return { isHR: true, canView: true, scope: "all" };
  if (myEmployee) return { isHR: false, canView: true, scope: "own" };
  return { isHR: false, canView: false, scope: "none" };
}
