import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tr2Width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tr2Aspect: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tr2Rim: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'tr2Width', label: 'Tire Width (mm)', type: 'number', min: 135, max: 405, step: '10' },
    { name: 'tr2Aspect', label: 'Aspect Ratio (%)', type: 'number', min: 20, max: 85, step: '5' },
    { name: 'tr2Rim', label: 'Rim Diameter (in)', type: 'number', min: 12, max: 30, step: '1' },
  ],
  compute: (v) => {
    const sidewallMm = v.tr2Width * (v.tr2Aspect / 100)
    const sidewallIn = sidewallMm / 25.4
    const totalDiameter = v.tr2Rim + sidewallIn * 2
    const circumferenceIn = totalDiameter * Math.PI
    const revsPerMile = 63360 / circumferenceIn
    return { result: totalDiameter, label: 'Overall Tire Diameter', unit: 'in', steps: [{ label: 'Sidewall', value: sidewallMm.toFixed(1) + ' mm (' + sidewallIn.toFixed(2) + ' in)' }, { label: 'Rim', value: v.tr2Rim + ' in' }, { label: 'Total Diameter', value: totalDiameter.toFixed(2) + ' in' }, { label: 'Circumference', value: circumferenceIn.toFixed(2) + ' in' }, { label: 'Revs per Mile', value: revsPerMile.toFixed(0) }] }
  },
  description: 'Calculate overall tire diameter, sidewall height, circumference, and revolutions per mile from tire size markings.',
  formula: 'Diameter = Rim + 2 x (Width x Aspect/100) / 25.4 | Circumference = Diameter x Pi | Revs/Mile = 63,360 / Circumference',
  interpretation: 'Common sizes: 205/55R16 (diameter ~24.9 in), 225/45R17 (~25.0 in), 265/70R17 (~31.6 in). Keep diameter within 3% of OEM when upsizing. Larger diameter = higher gearing = lower RPM at highway speed.'
}

export default calcDef
