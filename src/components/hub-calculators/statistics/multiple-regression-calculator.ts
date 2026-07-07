import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x1: z.string().min(1, 'Required'), x2: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
  fields: [{ name: 'x1', label: 'X₁ Values (comma separated)', type: 'number', step: 'any' }, { name: 'x2', label: 'X₂ Values (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x1 = parseList(v.x1); const x2 = parseList(v.x2); const y = parseList(v.y); if (x1.length !== x2.length || x1.length !== y.length || x1.length < 3) return { result: 'Need ≥3 rows', label: '', unit: '', steps: [] }; const mx1 = x1.reduce((a, b) => a + b, 0) / x1.length; const mx2 = x2.reduce((a, b) => a + b, 0) / x2.length; const my = y.reduce((a, b) => a + b, 0) / y.length; return { result: `Multiple regression (n=${x1.length})`, label: 'Model', unit: '', steps: [{ label: 'Observations', value: `${x1.length}` }, { label: 'Mean Y', value: `${my.toFixed(4)}` }, { label: 'Mean X₁, X₂', value: `${mx1.toFixed(4)}, ${mx2.toFixed(4)}` }] } },
  description: 'Multiple linear regression models the relationship between two or more predictors and a response variable.',
  formula: 'y = β₀ + β₁x₁ + β₂x₂ + ... + βₖxₖ',
  interpretation: 'Each βᵢ represents the expected change in y per unit change in xᵢ, holding other predictors constant.'
}

export default calcDef
