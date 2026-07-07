import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hr: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), power: z.string().min(1).refine(v => { const p = parseFloat(v); return p > 0 && p < 1 }, '0-1'), alpha: z.string().min(1).refine(v => { const a = parseFloat(v); return a > 0 && a < 1 }, '0-1'), accr: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'hr', label: 'Hazard Ratio (HR)', type: 'number', min: 0.01, step: '0.05' }, { name: 'power', label: 'Power', type: 'number', min: 0.5, max: 0.99, step: '0.05' }, { name: 'alpha', label: 'Alpha', type: 'number', min: 0.001, max: 0.1, step: '0.005' }, { name: 'accr', label: 'Accrual Period (years)', type: 'number', min: 0.5, step: '0.5' }],
  compute: (v) => { const hr = n(v.hr); const pwr = n(v.power); const alpha = n(v.alpha); const accr = n(v.accr); const zAlpha = 1.96; const zBeta = 0.84; const events = Math.ceil(4 * (zAlpha + zBeta) ** 2 / (Math.log(hr) ** 2)); const totalN = Math.ceil(events / 0.7); const followUp = totalN / (accr * events) * accr; return { result: totalN, label: 'Required Sample Size', unit: '', steps: [{ label: 'Events needed', value: `${events}` }, { label: 'Total N (approx)', value: `${totalN}` }, { label: 'HR', value: `${hr}` }] } },
  description: 'Sample size calculation for survival analysis using the Schoenfeld formula for proportional hazards.',
  formula: 'Events = 4(z_α/2 + z_β)² / (ln(HR)²), N = Events / P(event)',
  interpretation: 'A HR of 0.7 (30% risk reduction) requires ~330 events for 80% power. Total N depends on event rate and follow-up duration.'
}

export default calcDef
