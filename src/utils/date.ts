/**
 * Returns the current quarter label for a given date (defaults to now).
 * e.g. "Q2 2026", "Q4 2027"
 */
export function getCurrentQuarterLabel(date: Date = new Date()): string {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter} ${date.getFullYear()}`;
}
