import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    deltaOD: z.string().refine(v => parseFloat(v) > 0, '>0'),
    extinctionCoeff2: z.string().refine(v => parseFloat(v) > 0, '>0'),
    pathLength: z.string().refine(v => parseFloat(v) > 0, '>0'),
    reactionTime: z.string().refine(v => parseFloat(v) > 0, '>0'),
    sampleVolume: z.string().refine(v => parseFloat(v) > 0, '>0'),
    totalVolume: z.string().refine(v => parseFloat(v) > 0, '>0')
}),
  fields: [
    { name: 'deltaOD', label: '?OD (absorbance change)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'extinctionCoeff2', label: 'Extinction Coefficient e (M?¹·cm?¹)', type: 'number', min: 1, step: '100' },
    { name: 'pathLength', label: 'Path Length (cm)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'reactionTime', label: 'Reaction Time (min)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'sampleVolume', label: 'Sample Volume (mL)', type: 'number', min: 0.001, step: '0.01' },
    { name: 'totalVolume', label: 'Total Reaction Volume (mL)', type: 'number', min: 0.1, step: '0.1' },
  ],
  compute: (v) => {
    const mRate = v.deltaOD / (v.extinctionCoeff2 * v.pathLength * v.reactionTime)
    const activity = mRate * (v.totalVolume / v.sampleVolume) * 1e6
    return {
      result: activity, label: 'Enzymatic Activity', unit: 'U/mL',
      steps: [
        { label: 'Product formed (µmol)', value: `${(v.deltaOD / (v.extinctionCoeff2 * v.pathLength)).toExponential(4)}` },
        { label: 'Rate (µmol/min)', value: `${(v.deltaOD / (v.extinctionCoeff2 * v.pathLength * v.reactionTime)).toExponential(4)}` },
        { label: 'Volume correction', value: `${(v.totalVolume / v.sampleVolume).toFixed(2)}×` },
        { label: 'Activity', value: `${activity.toExponential(4)} U/mL` },
        { label: 'One unit (U)', value: '1 µmol product formed per minute' },
      ]
}
  },
  description: 'Enzymatic activity is measured as the rate of product formation per unit of enzyme. One unit (U) is defined as the amount of enzyme that converts 1 µmol of substrate per minute.',
  formula: 'Activity (U/mL) = (?OD × total volume) / (e × path length × time × sample volume) × 106',
  interpretation: 'Specific activity (U/mg) = activity / protein concentration. Higher specific activity indicates purer enzyme. Michaelis-Menten kinetics describe how activity varies with substrate concentration.'
}

export default calcDef
