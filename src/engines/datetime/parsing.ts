export function parseDate(input: string): Date | null {
  const m = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, mo, da, yr] = m;
  const d = new Date(+yr, +mo - 1, +da);
  if (d.getMonth() !== +mo - 1 || d.getDate() !== +da) return null;
  return d;
}
