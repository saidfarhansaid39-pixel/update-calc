import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ looks: z.string().min(1).refine(v => { const n = parseInt(v); return n >= 1 && n <= 10 }, '1-10'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1') }),
  fields: [{ name: 'looks', label: 'Number of Interim Looks', type: 'number', min: 1, max: 10, step: '1' }, { name: 'alpha', label: 'Overall Alpha', type: 'number', min: 0.001, max: 0.1, step: '0.005' }],
  compute: (v) => { const k = Math.round(n(v.looks)); const alpha = n(v.alpha); const bonfAlpha = alpha / k; const obfZ = 2.24; const pocockZ = 2.413; const bonfZ = 1.96; return { result: `Bonf:${bonfAlpha.toExponential(4)}`, label: 'Interim Monitoring Boundaries', unit: '', steps: [{ label: 'Looks', value: `${k}` }, { label: 'Overall α', value: `${alpha}` }, { label: 'Bonferroni α/look', value: `${bonfAlpha.toExponential(4)}` }, { label: 'OBrien-Fleming z', value: `${obfZ.toFixed(4)}` }, { label: 'Pocock z', value: `${pocockZ.toFixed(4)}` }] } },
  description: 'Interim monitoring uses group sequential methods to adjust significance boundaries for multiple interim analyses.',
  formula: 'O\'Brien-Fleming: z_k = z_α/√(look_k/K). Pocock: constant z across looks.',
  interpretation: 'Bonferroni is most conservative. O\'Brien-Fleming spends little α early. Pocock spends α evenly. Lan-DeMets is the flexible alternative.'
}

export default calcDef
