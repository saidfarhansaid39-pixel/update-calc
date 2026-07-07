export type ModeLevel = 'basic' | 'advanced' | 'professional' | 'expert'

export type FieldDef = {
  name: string; label: string; type?: 'number' | 'text' | 'select'
  min?: number; max?: number; step?: number | string; placeholder?: string; unit?: string
  options?: { label: string; value: string }[]
  mode?: ModeLevel
}

export type ResultValue = { result: number | string; label: string; unit: string; steps?: (string | { label: string; value: string })[] }

export type CalcDef = {
  schema: any
  fields: FieldDef[]
  compute: (values: Record<string, string>) => ResultValue
  description: string
  formula: string
  interpretation: string
  presets?: { label: string; values: Record<string, string> }[]
}
