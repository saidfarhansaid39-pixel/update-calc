// Derives non-empty sample default values from a calculator definition's fields,
// so every calculator page opens with a populated, computable example result.
// Safe: compute functions use `|| 0` guards, never throw on these values.
// Deterministic: identical on server and client (no hydration mismatch).

interface SampleField {
  name?: string
  type?: string
  options?: { label?: string; value: string }[]
  min?: number
  max?: number
  default?: string | number
  sample?: string | number
  placeholder?: string
}

interface SampleDef {
  fields?: SampleField[]
}

export function deriveSampleDefaults(def: SampleDef | undefined | null): Record<string, string> {
  const out: Record<string, string> = {}
  const fields = def?.fields
  if (!fields) return out
  for (const f of fields) {
    const name = f?.name
    if (!name) continue
    if (f.type === 'select') {
      const opts = f.options
      out[name] = opts && opts.length ? String(opts[0].value) : ''
      continue
    }
    const cand = f.default ?? f.sample ?? f.placeholder
    if (cand !== undefined && cand !== null && String(cand).trim() !== '') {
      out[name] = String(cand)
      continue
    }
    if (typeof f.min === 'number' && f.min > 0) {
      out[name] = String(f.min)
      continue
    }
    out[name] = '1'
  }
  return out
}
