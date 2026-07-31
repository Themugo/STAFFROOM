import { format } from "date-fns";

/**
 * Today's date as "yyyy-MM-dd", in the browser's local timezone.
 *
 * `new Date().toISOString().split("T")[0]` looks equivalent but isn't —
 * toISOString() converts to UTC first. For any positive-UTC-offset
 * timezone (most of Europe, Asia, Australia), that means for a window of
 * hours right after local midnight — before UTC has also crossed into the
 * new day — it silently returns *yesterday's* date. E.g. at 01:00 local
 * time in Bucharest (UTC+3), toISOString() reports the previous day.
 * `date-fns`'s `format` operates on the Date object's local time
 * components (the same way `.getFullYear()`/`.getMonth()`/`.getDate()`
 * do), so it doesn't have this problem.
 */
export function todayLocal() {
  return format(new Date(), "yyyy-MM-dd");
}

/** This month as "yyyy-MM", in the browser's local timezone — same
 * UTC-conversion pitfall as todayLocal(), same fix. */
export function thisMonthLocal() {
  return format(new Date(), "yyyy-MM");
}
