import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ Qh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), Qc: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0') }),
  fields: [{ name: 'Qh', label: 'Heat Input Q_h (hot)', type: 'number', unit: 'J', min: 1, step: '1' }, { name: 'Qc', label: 'Heat Rejected Q_c (cold)', type: 'number', unit: 'J', min: 0, step: '1' }],
  compute: (v) => { const eff = 1 - v.Qc / v.Qh; const W = v.Qh - v.Qc; return { result: eff, label: 'Thermal Efficiency η', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - Q_c/Q_h' }, { label: 'Net work', value: `${W.toFixed(1)} J` }, { label: 'Efficiency', value: `${(eff * 100).toFixed(1)}%` }] } },
  description: 'The thermal efficiency of a heat engine is the ratio of net work output to heat input. η = 1 - Q_c/Q_h, where Q_h is heat from hot reservoir and Q_c is waste heat.',
  formula: 'η = 1 - Q_c / Q_h',
  interpretation: 'Efficiency is always < 1 (second law of thermodynamics). Modern coal plants achieve ~35-40%, combined-cycle gas turbines reach ~60%. The Carnot efficiency sets the maximum possible value.'
}

export default calcDef
