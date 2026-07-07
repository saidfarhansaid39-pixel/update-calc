export function calculateMolarity(moles: number, volumeLiters: number): number {
  if (volumeLiters === 0) return 0;
  return moles / volumeLiters;
}

export function calculateDilution(c1: number, v1: number, v2: number): number {
  if (v2 === 0) return 0;
  return (c1 * v1) / v2;
}

export function calculatePH(h3oConcentration: number): number {
  if (h3oConcentration <= 0) return 7;
  return -Math.log10(h3oConcentration);
}
