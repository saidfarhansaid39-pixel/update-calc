import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ a1b1: z.string().min(1, 'Required'), a1b2: z.string().min(1, 'Required'), a2b1: z.string().min(1, 'Required'), a2b2: z.string().min(1, 'Required') }),
  fields: [{ name: 'a1b1', label: 'A₁B₁ (comma separated)', type: 'number', step: 'any' }, { name: 'a1b2', label: 'A₁B₂ (comma separated)', type: 'number', step: 'any' }, { name: 'a2b1', label: 'A₂B₁ (comma separated)', type: 'number', step: 'any' }, { name: 'a2b2', label: 'A₂B₂ (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const cells = [[parseList(v.a1b1), parseList(v.a1b2)], [parseList(v.a2b1), parseList(v.a2b2)]]; if (cells.some(row => row.some(c => c.length < 2))) return { result: 'Need ≥2 per cell', label: '', unit: '', steps: [] }; const n = cells[0][0].length; const cellMeans = cells.map(row => row.map(c => c.reduce((a, b) => a + b, 0) / c.length)); const rowMeans = cellMeans.map(row => row.reduce((a, b) => a + b, 0) / 2); const colMeans = [0, 1].map(j => (cellMeans[0][j] + cellMeans[1][j]) / 2); const all = cells.flat(2); const grandMean = all.reduce((a, b) => a + b, 0) / all.length; const ssA = 2 * n * rowMeans.reduce((acc, m) => acc + (m - grandMean) ** 2, 0); const ssB = 2 * n * colMeans.reduce((acc, m) => acc + (m - grandMean) ** 2, 0); let ssAB = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) ssAB += n * (cellMeans[i][j] - rowMeans[i] - colMeans[j] + grandMean) ** 2; let ssE = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const m = cellMeans[i][j]; cells[i][j].forEach(v => { ssE += (v - m) ** 2 }) }; const dfA = 1; const dfB = 1; const dfAB = 1; const dfE = 4 * (n - 1); const msA = ssA / dfA; const msB = ssB / dfB; const msAB = ssAB / dfAB; const msE = ssE / dfE; const fA = msE > 0 ? msA / msE : 0; const fB = msE > 0 ? msB / msE : 0; const fAB = msE > 0 ? msAB / msE : 0; return { result: fA, label: 'F(A)', unit: '', steps: [{ label: 'F(A)', value: `${fA.toFixed(4)}` }, { label: 'F(B)', value: `${fB.toFixed(4)}` }, { label: 'F(AB)', value: `${fAB.toFixed(4)}` }] } },
  description: 'Two-way ANOVA tests main effects and interaction of two categorical factors on a continuous outcome.',
  formula: 'SS_total = SS_A + SS_B + SS_AB + SS_error. F = MS_effect / MS_error.',
  interpretation: 'Significant interaction (AB) means the effect of factor A depends on the level of factor B. Plot interaction graphs for interpretation.'
}

export default calcDef
