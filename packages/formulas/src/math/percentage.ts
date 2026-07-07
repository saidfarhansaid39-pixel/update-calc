export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 10000) / 100;
}

export function percentageOf(percent: number, of: number): number {
  return (percent / 100) * of;
}

export function percentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return Math.round(((newValue - oldValue) / oldValue) * 10000) / 100;
}

export function whatPercentIs(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

export function percentageIncrease(initial: number, final: number): number {
  if (initial === 0) return 0;
  return ((final - initial) / initial) * 100;
}
