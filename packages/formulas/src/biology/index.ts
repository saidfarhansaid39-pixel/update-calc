export function calculateBSA(weightKg: number, heightCm: number): number {
  return Math.sqrt(weightKg * heightCm / 3600);
}

export function calculateHeartRateZones(maxHR: number): number[] {
  return [0.5, 0.6, 0.7, 0.8, 0.9].map(p => Math.round(maxHR * p));
}
