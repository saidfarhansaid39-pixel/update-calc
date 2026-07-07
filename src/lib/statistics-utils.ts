export function n(v: string | number): number {
  return typeof v === 'number' ? v : parseFloat(v)
}

export function parseList(v: string): number[] {
  return v.split(',').map(s => parseFloat(s.trim())).filter(x => !isNaN(x))
}
