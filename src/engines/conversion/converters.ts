export function convert(value: number, fromUnit: { toBase: (v: number) => number }, toUnit: { fromBase: (v: number) => number }): number {
  const base = fromUnit.toBase(value);
  return toUnit.fromBase(base);
}
