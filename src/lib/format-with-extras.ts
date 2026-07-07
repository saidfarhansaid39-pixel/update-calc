export function formatWithExtras(
  value: number | string,
  extraFields: Record<string, string>,
  defaults?: { decimals?: number }
): string {
  if (typeof value === 'string') return value
  const decimals = extraFields.extra_decimal_places || extraFields.extra_decimals
  const dp = decimals ? parseInt(decimals) : (defaults?.decimals ?? 4)
  if (isNaN(dp)) return String(value)
  return value.toFixed(dp)
}

export function applyRoundingMode(
  value: number,
  mode: string | undefined
): number {
  if (!mode || mode === 'standard') return value
  switch (mode) {
    case 'ceil': return Math.ceil(value)
    case 'floor': return Math.floor(value)
    case 'trunc': return Math.trunc(value)
    default: return value
  }
}
