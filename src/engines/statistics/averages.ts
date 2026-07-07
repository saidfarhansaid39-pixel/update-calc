export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const freq: Record<number, number> = {};
  let maxFreq = 0;
  for (const v of values) { freq[v] = (freq[v] || 0) + 1; if (freq[v] > maxFreq) maxFreq = freq[v]; }
  return Object.entries(freq).filter(([, c]) => c === maxFreq).map(([k]) => +k);
}

export function geometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.some(v => v <= 0)) return 0;
  return Math.pow(values.reduce((a, b) => a * b, 1), 1 / values.length);
}
