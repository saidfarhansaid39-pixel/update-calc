import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    sectionThick: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'),
    sectionInterval: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    totalSections: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, '>0'),
    countPerFrame: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0')
}),
  fields: [
    { name: 'sectionThick', label: 'Section Thickness', type: 'number', unit: 'µm', min: 1, step: '1' },
    { name: 'sectionInterval', label: 'Section Sampling Interval', type: 'number', min: 1, step: '1' },
    { name: 'totalSections', label: 'Total Sections Through Structure', type: 'number', min: 1, step: '1' },
    { name: 'countPerFrame', label: 'Avg Object Count per Frame', type: 'number', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const sectionPct = 1 / v.sectionInterval * 100
    const estTotal = v.countPerFrame * v.totalSections / v.sectionInterval
    return {
      result: estTotal, label: 'Estimated Total Object Count', unit: 'objects',
      steps: [
        { label: 'Section thickness', value: `${v.sectionThick} µm` },
        { label: 'Sampling interval (every nth)', value: `Every ${v.sectionInterval}th` },
        { label: 'Sections sampled', value: `${Math.ceil(v.totalSections / v.sectionInterval)}` },
        { label: 'Section sampling fraction', value: `${sectionPct.toFixed(1)}%` },
        { label: 'Estimated total count', value: `${estTotal.toFixed(0).toLocaleString()}` },
        { label: 'CE (coefficient of error)', value: 'Should be < 0.1 for reliable estimates (Gundersen method)' },
      ]
}
  },
  description: 'Stereology provides unbiased quantitative estimates of 3D structures from 2D sections. The optical fractionator method combines section sampling, area sampling, and disector height.',
  formula: 'Estimated population = SQ × 1/ssf × 1/asf × 1/hsf | ssf = section sampling fraction, asf = area sampling fraction, hsf = height sampling fraction',
  interpretation: 'Gold standard for unbiased cell counting. Requires systematic random sampling, clear counting rules (unbiased counting frame), and appropriate section thickness. CE < 0.1 indicates reliable estimate. Use modern stereology software.'
}

export default calcDef
