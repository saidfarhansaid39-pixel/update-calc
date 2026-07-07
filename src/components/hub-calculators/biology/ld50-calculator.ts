import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    doseLog: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    response: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100')
}),
  fields: [
    { name: 'doseLog', label: 'Log10(Dose)', type: 'number', min: 0, step: '0.1' },
    { name: 'response', label: 'Mortality Rate', type: 'number', unit: '%', min: 0, max: 100, step: '1' },
  ],
  compute: (v) => {
    const logDose = v.doseLog
    const mortality = v.response
    const ld50Est = mortality >= 50 ? 10 ** logDose : 10 ** (logDose + (50 - mortality) / 20)
    const ld50Log = Math.log10(ld50Est)
    return {
      result: ld50Est, label: 'Estimated LD50', unit: 'mg/kg',
      steps: [
        { label: 'Log dose tested', value: `${logDose.toFixed(1)}` },
        { label: 'Mortality at dose', value: `${mortality}%` },
        { label: 'Estimated LD50', value: `${ld50Est.toFixed(2)} mg/kg` },
        { label: 'LD50 (log10)', value: `${ld50Log.toFixed(2)}` },
        { label: 'Toxicity class', value: ld50Est <= 5 ? 'Extremely toxic' : ld50Est <= 50 ? 'Highly toxic' : ld50Est <= 500 ? 'Moderately toxic' : 'Slightly toxic' },
      ]
}
  },
  description: 'LD50 is the median lethal dose — the dose required to kill 50% of a test population. It is a standard measure of acute toxicity in pharmacology and toxicology.',
  formula: 'LD50 = 10^(log dose at ~50% mortality) | Probit analysis for precise calculation',
  interpretation: 'Lower LD50 = more toxic. Classes: =5 (extremely), 5-50 (highly), 50-500 (moderately), 500-5000 (slightly), >5000 (practically non-toxic) mg/kg.'
}

export default calcDef
