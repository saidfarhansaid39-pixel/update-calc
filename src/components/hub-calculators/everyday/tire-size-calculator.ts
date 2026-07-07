import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ trc2Width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2Aspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2Rim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewAspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), trc2NewRim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'trc2Width', label: 'Current Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'trc2Aspect', label: 'Current Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'trc2Rim', label: 'Current Rim (in)', type: 'number', min: 12, max: 30, step: '1' },
    { name: 'trc2NewWidth', label: 'New Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'trc2NewAspect', label: 'New Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'trc2NewRim', label: 'New Rim (in)', type: 'number', min: 12, max: 30, step: '1' },
  ],
  compute: (v) => {
    const oldSidewall = v.trc2Width * (v.trc2Aspect / 100) / 25.4
    const oldDiameter = v.trc2Rim + oldSidewall * 2
    const newSidewall = v.trc2NewWidth * (v.trc2NewAspect / 100) / 25.4
    const newDiameter = v.trc2NewRim + newSidewall * 2
    const diff = newDiameter - oldDiameter
    const diffPct = oldDiameter > 0 ? (diff / oldDiameter) * 100 : 0
    const speedError = 60 * (1 + diffPct / 100) - 60
    let safetyMsg = 'Within safe range (< 3%)'
    if (diffPct > 3 || diffPct < -3) safetyMsg = 'WARNING: Exceeds 3% limit'
    return { result: newDiameter, label: 'New Tire Diameter', unit: 'in', steps: [{ label: 'Old Diameter', value: oldDiameter.toFixed(2) + ' in' }, { label: 'New Diameter', value: newDiameter.toFixed(2) + ' in' }, { label: 'Difference', value: diff.toFixed(2) + ' in (' + diffPct.toFixed(1) + '%)' }, { label: 'Speedo Error @ 60mph', value: speedError.toFixed(1) + ' mph' }, { label: 'Safety', value: safetyMsg }] }
  },
  description: 'Compare two tire sizes and calculate diameter difference, speedometer error, and compatibility. Keep within 3% for safety.',
  formula: 'Diameter = Rim + 2 x (Width x Aspect/100)/25.4 | Diff% = (New - Old)/Old x 100 | Speedo Error = 60 x (1+Diff%) - 60',
  interpretation: 'Stay within +/- 3% of original diameter for proper speedometer, ABS, and traction control. Going larger improves ground clearance but reduces acceleration. Going smaller improves acceleration but increases RPM on highway.'
}

export default calcDef
