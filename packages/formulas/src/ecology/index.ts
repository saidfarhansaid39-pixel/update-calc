export function calculateShannonIndex(species: number[]): number {
  const total = species.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return -species.reduce((sum, count) => {
    const p = count / total;
    return sum + (p > 0 ? p * Math.log(p) : 0);
  }, 0);
}

export function calculatePopulationGrowth(initial: number, rate: number, years: number): number {
  return initial * Math.exp(rate * years);
}
