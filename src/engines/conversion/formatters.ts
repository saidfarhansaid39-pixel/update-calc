export function formatConversionResult(value: number, unit: any, options?: any): string {
  const decimals = options?.profile?.maxDecimals ?? 4;
  return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}
