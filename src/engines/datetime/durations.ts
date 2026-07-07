export function diffToComponents(a: Date, b: Date): { years: number; months: number; days: number } {
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) { months--; const prev = new Date(b.getFullYear(), b.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

export function diffInDays(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}
