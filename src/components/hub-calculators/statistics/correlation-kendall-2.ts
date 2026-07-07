import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ x: z.string().min(1, 'Required'), y: z.string().min(1, 'Required') }),
  fields: [{ name: 'x', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'y', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.x); const y = parseList(v.y); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; let C = 0, D = 0, Tx = 0, Ty = 0; for (let i = 0; i < x.length; i++) for (let j = i + 1; j < x.length; j++) { const dx = Math.sign(x[i] - x[j]); const dy = Math.sign(y[i] - y[j]); if (dx * dy > 0) C++; else if (dx * dy < 0) D++; if (dx === 0 && dy !== 0) Tx++; if (dy === 0 && dx !== 0) Ty++ }; const n0 = x.length * (x.length - 1) / 2; const tauB = (C - D) / Math.sqrt((n0 - Tx) * (n0 - Ty)); return { result: tauB, label: "Kendall's τ-b", unit: '', steps: [{ label: 'Concordant', value: `${C}` }, { label: 'Discordant', value: `${D}` }, { label: 'Ties (X)', value: `${Tx}` }, { label: 'Ties (Y)', value: `${Ty}` }, { label: 'τ-b', value: `${tauB.toFixed(4)}` }] } },
  description: "Kendall's tau-b is a rank correlation coefficient with correction for ties.",
  formula: 'τ-b = (C - D) / √((n₀ - Tₓ)(n₀ - Tᵧ))',
  interpretation: 'τ-b ranges from -1 to +1. Handles ties better than τ-a. Used for ordinal data with many tied ranks.'
}

export default calcDef
