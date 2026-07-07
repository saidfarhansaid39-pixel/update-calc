import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ controlMean: z.string().min(1).refine(v => !isNaN(parseFloat(v)), 'Required'), treatMeans: z.string().min(1, 'Required'), mse: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'controlMean', label: 'Control Mean', type: 'number', step: 'any' }, { name: 'treatMeans', label: 'Treatment Means (comma separated)', type: 'number', step: 'any' }, { name: 'mse', label: 'MSE (within groups)', type: 'number', min: 0.001, step: 'any' }, { name: 'n', label: 'N per group', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const ctrl = n(v.controlMean); const treat = parseList(v.treatMeans); const mse = n(v.mse); const nPer = Math.round(n(v.n)); const se = Math.sqrt(mse / nPer); const diffs = treat.map(t => ({ diff: t - ctrl, d: (t - ctrl) / se })); return { result: diffs.map(d => d.d.toFixed(4)).join(', '), label: 'Dunnett t-stats', unit: '', steps: [{ label: 'Treatments vs Control', value: `${treat.length}` }, { label: 'SE', value: `${se.toFixed(4)}` }, { label: 't-values', value: diffs.map((d, i) => `T${i + 1}:${d.d.toFixed(4)}`).join(', ') }] } },
  description: 'Dunnett\'s test compares each treatment group to a single control group, controlling familywise error rate.',
  formula: 't_D = (x̄_t - x̄_c) / √(MSE(1/n_t + 1/n_c))',
  interpretation: 'More powerful than Tukey when only comparing to a control. Uses a special critical value that accounts for the number of comparisons.'
}

export default calcDef
