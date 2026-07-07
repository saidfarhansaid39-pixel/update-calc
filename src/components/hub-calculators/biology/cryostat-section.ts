import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    chamberTemp: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -40 && n <= 0 }, '-40 to 0'),
    tissueType: z.string(),
    sectionThick: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 2 && n <= 50 }, '2-50')
}),
  fields: [
    { name: 'chamberTemp', label: 'Cryostat Chamber Temp', type: 'number', unit: '°C', min: -40, max: 0, step: '1' },
    { name: 'tissueType', label: 'Tissue Type', type: 'select', options: [
      { label: 'Brain (unfixed)', value: 'brain' },
      { label: 'Liver/Kidney', value: 'liver' },
      { label: 'Muscle/Tendon', value: 'muscle' },
      { label: 'Adipose/Fatty', value: 'adipose' },
      { label: 'Tumor', value: 'tumor' },
      { label: 'Skin', value: 'skin' },
    ] },
    { name: 'sectionThick', label: 'Section Thickness', type: 'number', unit: 'µm', min: 2, max: 50, step: '1' },
  ],
  compute: (v) => {
    const optimalTemps: Record<string,string> = {
      'brain': '-15 to -18°C', 'liver': '-14 to -16°C', 'muscle': '-20 to -25°C',
      'adipose': '-25 to -30°C', 'tumor': '-16 to -20°C', 'skin': '-18 to -22°C'
}
    const opt = optimalTemps[v.tissueType] || '-16 to -20°C'
    const current = v.chamberTemp <= -20 ? 'Cold — harder tissue, less compression' : v.chamberTemp <= -14 ? 'Moderate — good for most tissues' : 'Warm — softer sections, may fold or tear'
    const useOCT = v.tissueType === 'adipose' || v.tissueType === 'skin'
    return {
      result: 0, label: 'Cryostat Settings Guide', unit: '',
      steps: [
        { label: 'Tissue type', value: v.tissueType },
        { label: 'Current chamber temp', value: `${v.chamberTemp}°C` },
        { label: 'Optimal temp for this tissue', value: opt },
        { label: 'Assessment', value: current },
        { label: 'Section thickness', value: `${v.sectionThick} µm` },
        { label: 'Embedding', value: useOCT ? 'Use OCT compound — embed at -20°C for 30 min' : 'OCT or optimal cutting temperature medium' },
        { label: 'Anti-roll plate', value: 'Adjust gap to section thickness for flat sections' },
      ]
}
  },
  description: 'Cryostat sectioning produces frozen tissue sections for rapid diagnosis (frozen section), immunohistochemistry, or enzyme histochemistry. Optimal temperature varies by tissue composition.',
  formula: 'Chamber temp = f(tissue composition) | Fatty tissues need colder temps (-25 to -30°C) | Fibrous tissues need moderate temps (-14 to -18°C) | Section thickness: 5-10 µm standard, 10-30 µm for IHC',
  interpretation: 'Colder temperatures make tissue harder — reduces compression but increases chatter/tears. Warmer temperatures cause folding and compression. Fatty tissues require colder temps than fibrous tissues. Let tissue equilibrate in chamber for 10-15 min before cutting.'
}

export default calcDef
