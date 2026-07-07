import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hr: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), se: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'hr', label: 'Hazard Ratio (HR)', type: 'number', min: 0.001, step: '0.01' }, { name: 'se', label: 'SE of log(HR)', type: 'number', min: 0.001, step: '0.01' }],
  compute: (v) => { const hr = n(v.hr); const seLog = n(v.se); const logHR = Math.log(hr); const ciLow = Math.exp(logHR - 1.96 * seLog); const ciHigh = Math.exp(logHR + 1.96 * seLog); const z = seLog > 0 ? logHR / seLog : 0; return { result: hr, label: 'Hazard Ratio', unit: '', steps: [{ label: 'HR', value: `${hr.toFixed(4)}` }, { label: '95% CI', value: `[${ciLow.toFixed(4)}, ${ciHigh.toFixed(4)}]` }, { label: 'z', value: `${z.toFixed(4)}` }, { label: 'Interpretation', value: hr > 1 ? 'Increased hazard (risk)' : hr < 1 ? 'Decreased hazard (protective)' : 'No effect' }] } },
  description: 'Cox proportional hazards models the hazard (instantaneous risk) as a function of covariates. HR = e^β.',
  formula: 'h(t|X) = h₀(t) × exp(βX), HR = exp(β)',
  interpretation: 'HR > 1: covariate increases hazard (worse survival). HR < 1: decreases hazard (better survival). CI should not cross 1.'
}

export default calcDef
