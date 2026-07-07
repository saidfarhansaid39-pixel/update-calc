import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rowVar: z.string().min(1, 'Required'), colVar: z.string().min(1, 'Required') }),
  fields: [{ name: 'rowVar', label: 'Row Values (comma separated)', type: 'number', step: 'any' }, { name: 'colVar', label: 'Column Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const rows = parseList(v.rowVar); const cols = parseList(v.colVar); if (rows.length !== cols.length || rows.length < 2) return { result: 'Need ≥2 pairs', label: '', unit: '', steps: [] }; const rLabels = Array.from(new Set(rows)).sort(); const cLabels = Array.from(new Set(cols)).sort(); const table: Record<string, Record<string, number>> = {}; rLabels.forEach(r => { table[r] = {}; cLabels.forEach(c => { table[r][c] = 0 }) }); rows.forEach((r, i) => { table[r][cols[i]]++ }); const total = rows.length; const result = rLabels.map(r => `${r}:` + cLabels.map(c => `${c}=${table[r][c]}`).join(',')).join('; '); return { result, label: 'Cross-Tabulation', unit: '', steps: [{ label: 'Rows × Cols', value: `${rLabels.length} × ${cLabels.length}` }, { label: 'Total N', value: `${total}` }] } },
  description: 'A cross-tabulation (contingency table) displays the joint distribution of two categorical variables.',
  formula: 'Cell count = nᵢⱼ for row i, column j',
  interpretation: 'Cross-tabulations reveal associations between categorical variables. Row percentages or column percentages aid interpretation.'
}

export default calcDef
