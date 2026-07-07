export function calculatePace(minutes: number, distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return minutes / distanceKm;
}

export function calculateVO2max(restingHR: number, maxHR: number): number {
  return 15 * (maxHR / restingHR);
}
