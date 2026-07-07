import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    percentPos: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    intensity: z.string()
}),
  fields: [
    { name: 'percentPos', label: 'Positive Cells', type: 'number', unit: '%', min: 0, max: 100, step: '5' },
    { name: 'intensity', label: 'Staining Intensity', type: 'select', options: [
      { label: '0 (Negative)', value: '0' }, { label: '1+ (Weak)', value: '1' }, { label: '2+ (Moderate)', value: '2' }, { label: '3+ (Strong)', value: '3' },
    ] },
  ],
  compute: (v) => {
    const int = parseInt(v.intensity) || 0
    const hScore = v.percentPos * int
    const maxScore = 300
    return {
      result: hScore, label: 'H-Score (Histoscore)', unit: '(0-300)',
      steps: [
        { label: '% positive cells', value: `${v.percentPos}%` },
        { label: 'Intensity', value: `${int}+` },
        { label: 'H-Score = % × intensity', value: `${hScore} (range 0-300)` },
        { label: 'Category', value: hScore === 0 ? 'Negative' : hScore <= 100 ? 'Low expression' : hScore <= 200 ? 'Moderate expression' : 'High expression' },
        { label: 'Alternative', value: 'Allred score (breast cancer ER/PR): proportion + intensity (0-8)' },
      ]
}
  },
  description: 'Immunohistochemistry (IHC) scoring quantifies protein expression in tissue sections. The H-Score (histoscore) combines percentage of positive cells with staining intensity for semi-quantitative assessment.',
  formula: 'H-Score = S(% cells at intensity i × i) | Range 0-300 | Alternative: Allred (0-8), IRS (0-12), Quickscore',
  interpretation: 'H-Score is used for ER/PR/HER2 in breast cancer, PD-L1 in lung cancer, and many other biomarkers. Cutoffs vary by marker and clinical context. Automated image analysis improves reproducibility vs. manual scoring.'
}

export default calcDef
