export function formatShortDate(d: Date): string {
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const yr = d.getFullYear();
  return `${mo}/${da}/${yr}`;
}
