import { z } from 'zod'

export interface FieldDef {
  name: string; label: string; type: 'number' | 'select' | 'text'
  min?: number; max?: number; step?: string
  options?: { label: string; value: string }[]
  unit?: string; units?: { value: string; label: string }[]; defaultUnit?: string
  placeholder?: string; mode?: 'basic' | 'advanced' | 'professional' | 'expert'
}

export interface CalcDef {
  schema?: z.ZodObject<any>
  fields: FieldDef[]
  defaults?: Record<string, string>
  presets?: { label: string; values: Record<string, string> }[]
  formulaVariables?: { name: string; value: number; min: number; max: number }[]
  example?: { label: string; value: string } | { label: string; value: string }[]
  compute: (vals: Record<string, any>) => { result: number | string; label: string; unit?: string; steps?: { label: string; value: string }[] }
  description?: string
  formula?: string
  interpretation?: string
}

export function buildGenericDef(calculator: { slug: string; title: string; description: string; keywords?: string[] }): Record<string, unknown> {
  const label = calculator.title.replace(/Calculator|Converter|Tool|Free/i, '').replace(/\s*\|\s*.*$/, '').trim() || calculator.title

  return {
    schema: z.object({ value: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Must be a number') }),
    fields: [{ name: 'value', label, step: '0.01', min: 0 }],
    defaults: {},
    compute: (v: Record<string, string>) => {
      const val = parseFloat(v.value || '0')
      return { result: val, label, unit: '', steps: [{ label: 'Result', value: String(val) }] }
    },
    description: calculator.description || `${label} calculator`,
    formula: calculator.description || `${label} calculator`,
    interpretation: calculator.description || `${label} calculator`,
  }
}
