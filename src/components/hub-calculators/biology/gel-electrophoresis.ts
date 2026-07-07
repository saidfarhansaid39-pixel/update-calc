import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    kbSize: z.string().refine(v => parseFloat(v) > 0, '>0'),
    gelPct: z.string().refine(v => parseFloat(v) > 0, '>0'),
    voltage: z.string().refine(v => parseFloat(v) > 0, '>0'),
    timeRun: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'kbSize', label: 'DNA Fragment Size', type: 'number', unit: 'kb', min: 0.01, step: '0.1' },
    { name: 'gelPct', label: 'Agarose Gel %', type: 'number', min: 0.3, max: 3, step: '0.1' },
    { name: 'voltage', label: 'Voltage (V)', type: 'number', min: 1, max: 200, step: '5' },
    { name: 'timeRun', label: 'Run Time (min)', type: 'number', min: 1, step: '5' },
  ],
  compute: (v) => {
    const logKb = Math.log10(v.kbSize)
    const approxDist = 100 - 40 * logKb - v.gelPct * 10
    const migration = Math.max(0, approxDist)
    const vh = v.voltage * v.timeRun / 60
    return {
      result: migration, label: 'Estimated Migration Distance', unit: 'mm',
      steps: [
        { label: 'Fragment size', value: `${v.kbSize} kb` },
        { label: 'Gel percentage', value: `${v.gelPct}%` },
        { label: 'Voltage × time', value: `${v.voltage} V × ${v.timeRun} min = ${vh.toFixed(0)} V·h` },
        { label: 'Estimated migration', value: `${migration.toFixed(1)} mm from well` },
        { label: 'Recommendation', value: v.kbSize < 0.5 ? 'Use 1.5-2% gel' : v.kbSize < 3 ? 'Use 0.8-1% gel' : 'Use 0.6-0.8% gel' },
      ]
}
  },
  description: 'Agarose gel electrophoresis separates DNA fragments by size. Smaller fragments migrate faster through the gel matrix. Migration distance is proportional to log of fragment size.',
  formula: 'Migration ˜ constant - m × log(kb) - gel% × f | Run at 5-10 V/cm gel length | Lower % gel for larger fragments',
  interpretation: 'High voltage causes faster migration but may heat the gel and reduce resolution. Use 1× TAE or TBE buffer. Add DNA stain (EtBr, SYBR Safe) for visualization. Include DNA ladder for size estimation.'
}

export default calcDef
