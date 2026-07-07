import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r1: z.string().min(1, 'Required'), r2: z.string().min(1, 'Required'), r3: z.string().min(1, 'Required'), r4: z.string().min(1, 'Required') }),
  fields: [{ name: 'r1', label: 'Variable 1 (0/1, comma sep)', type: 'number', step: 'any' }, { name: 'r2', label: 'Variable 2 (0/1, comma sep)', type: 'number', step: 'any' }, { name: 'r3', label: 'Variable 3 (0/1, comma sep)', type: 'number', step: 'any' }, { name: 'r4', label: 'Variable 4 (0/1, comma sep)', type: 'number', step: 'any' }],
  compute: (v) => { const vars = [parseList(v.r1), parseList(v.r2), parseList(v.r3), parseList(v.r4)].filter(g => g.length > 0); if (vars.length < 3 || vars.some(g => g.length !== vars[0].length)) return { result: 'Need equal length ≥3 vars', label: '', unit: '', steps: [] }; const k = vars.length; const n = vars[0].length; const colSums = vars.map(g => g.reduce((a, b) => a + b, 0)); const rowSums = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < k; j++) rowSums[i] += vars[j][i]; const grandSum = colSums.reduce((a, b) => a + b, 0); const num = (k - 1) * (k * colSums.reduce((acc, g) => acc + g * g, 0) - grandSum * grandSum); const den = k * grandSum - rowSums.reduce((acc, r) => acc + r * r, 0); const Q = den > 0 ? num / den : 0; const df = k - 1; return { result: Q, label: "Cochran's Q", unit: '', steps: [{ label: 'k variables', value: `${k}` }, { label: 'n subjects', value: `${n}` }, { label: 'Q', value: `${Q.toFixed(4)}` }, { label: 'DF', value: `${df}` }] } },
  description: "Cochran's Q test extends McNemar's test to three or more matched binary outcomes.",
  formula: 'Q = (k-1)(kΣGⱼ² - G²) / (kG - ΣRᵢ²) ~ χ²(k-1)',
  interpretation: 'A significant Q indicates at least one variable differs in proportion. Post-hoc pairwise McNemar tests identify which pairs differ.'
}

export default calcDef
