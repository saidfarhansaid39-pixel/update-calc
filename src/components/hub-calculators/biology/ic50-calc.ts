import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    highInh: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    highConc: z.string().refine(v => parseFloat(v) > 0, '>0'),
    lowInh: z.string().refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    lowConc: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'highInh', label: 'Inhibition at High Conc (%)', type: 'number', min: 0, max: 100, step: '1' },
    { name: 'highConc', label: 'High Concentration (µM)', type: 'number', min: 0.001, step: '0.1' },
    { name: 'lowInh', label: 'Inhibition at Low Conc (%)', type: 'number', min: 0, max: 100, step: '1' },
    { name: 'lowConc', label: 'Low Concentration (µM)', type: 'number', min: 0.001, step: '0.1' },
  ],
  compute: (v) => {
    const slope = v.highInh !== v.lowInh && v.highConc !== v.lowConc ? Math.log(v.highConc / v.lowConc) / (v.highInh - v.lowInh) : 0.1
    const ic50 = slope > 0 ? v.highConc * Math.exp(-(v.highInh - 50) * slope) : 0
    return {
      result: ic50, label: 'Estimated IC50', unit: 'µM',
      steps: [
        { label: 'High conc inhibition', value: `${v.highInh}% at ${v.highConc} µM` },
        { label: 'Low conc inhibition', value: `${v.lowInh}% at ${v.lowConc} µM` },
        { label: 'Estimated IC50', value: `${ic50.toFixed(2)} µM` },
        { label: 'Note', value: 'Use 4-parameter logistic regression for accurate determination with full dose-response data' },
      ]
}
  },
  description: 'IC50 is the half-maximal inhibitory concentration — the concentration of an inhibitor needed to reduce a biological response by 50%. It measures drug potency.',
  formula: 'Log IC50 = log(highConc) - (highInh - 50) / slope | Slope = log(high/low) / (highInh - lowInh)',
  interpretation: 'Lower IC50 = more potent inhibitor. IC50 depends on assay conditions (substrate concentration, enzyme concentration, temperature). Compare IC50 values only within the same assay.'
}

export default calcDef
