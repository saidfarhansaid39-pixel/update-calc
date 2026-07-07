import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    startingConc: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    dilutionFactor: z.string().min(1, 'Required').refine(v => parseFloat(v) > 1, 'Must be > 1'),
    clearWell: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n > 0 }, 'Must be > 0')
}),
  fields: [
    { name: 'startingConc', label: 'Starting Antimicrobial Conc.', type: 'number', unit: 'µg/mL', min: 0.1, step: '0.1' },
    { name: 'dilutionFactor', label: 'Dilution Factor', type: 'number', min: 2, step: '1' },
    { name: 'clearWell', label: 'First Clear Well (1 = highest conc)', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const mic = v.startingConc / (v.dilutionFactor ** (v.clearWell - 1))
    return {
      result: mic, label: 'Minimum Inhibitory Conc.', unit: 'µg/mL',
      steps: [
        { label: 'Starting conc.', value: `${v.startingConc} µg/mL` },
        { label: 'Dilution factor', value: `${v.dilutionFactor}-fold` },
        { label: 'Clear well number', value: `#${v.clearWell}` },
        { label: 'Formula', value: `${v.startingConc} / ${v.dilutionFactor}^${v.clearWell - 1}` },
        { label: 'MIC', value: `${mic.toFixed(3)} µg/mL` },
      ]
}
  },
  description: 'Minimum Inhibitory Concentration (MIC) is the lowest antimicrobial concentration that inhibits visible microbial growth. It is determined by serial dilution assays.',
  formula: 'MIC = Starting conc. / (DF)^(Well # – 1)',
  interpretation: 'Lower MIC = more effective antimicrobial. Clinical breakpoints (EUCAST/CLSI) classify isolates as susceptible, intermediate, or resistant based on MIC values.'
}

export default calcDef
