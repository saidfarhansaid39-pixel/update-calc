/** Convert a form field value to a number. Returns NaN for non-numeric input. */
export function n(value: string | number): number {
  return Number(value)
}

/** Parse a comma-separated string into an array of numbers, filtering out NaN values. */
export function parseList(value: string): number[] {
  return value
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(Number)
    .filter(v => !Number.isNaN(v))
}
