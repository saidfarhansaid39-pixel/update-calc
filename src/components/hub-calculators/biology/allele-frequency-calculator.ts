import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const diseases = [
  { label: 'Custom', prevalence: '' },
  { label: 'Albinism', prevalence: '0.0001' },
  { label: 'Cystic fibrosis (Caucasian)', prevalence: '0.0004' },
  { label: 'Harlequin-type ichthyosis', prevalence: '0.00000333' },
  { label: 'Phenylketonuria (Caucasian)', prevalence: '0.0000667' },
  { label: 'Sickle cell anemia (African-American)', prevalence: '0.001667' },
  { label: 'Tay Sachs (Ashkenazi Jewish)', prevalence: '0.000278' },
]

const calcDef: CalcDef = {
  schema: z.object({
    mode: z.enum(['counts', 'prevalence']),
    dominant: z.string().optional().or(z.literal('')),
    recessive: z.string().optional().or(z.literal('')),
    diseasePrevalence: z.string().optional().or(z.literal('')),
    diseasePreset: z.string().optional().or(z.literal('')),
  }),
  fields: [
    { name: 'mode', label: 'Input Mode', type: 'select', options: [
      { value: 'counts', label: 'Phenotype Counts' },
      { value: 'prevalence', label: 'Disease Prevalence' },
    ] },
    { name: 'dominant', label: 'Dominant Phenotype Count', type: 'number', min: 0, step: '1' },
    { name: 'recessive', label: 'Recessive Phenotype Count', type: 'number', min: 0, step: '1' },
    { name: 'diseasePreset', label: 'Common Diseases', type: 'select', options: diseases.map(d => ({ value: d.prevalence, label: d.label })) },
    { name: 'diseasePrevalence', label: 'Disease Prevalence (1 in X or decimal)', type: 'number', min: 0, step: '0.0001' },
  ],
  defaults: {
    mode: 'counts',
    dominant: '200',
    recessive: '50',
    diseasePreset: '',
    diseasePrevalence: '',
  },
  presets: [
    { label: 'Count mode: 200 dom, 50 rec', values: { mode: 'counts', dominant: '200', recessive: '50', diseasePrevalence: '', diseasePreset: '' } },
    { label: 'Prevalence: Cystic fibrosis', values: { mode: 'prevalence', dominant: '', recessive: '', diseasePrevalence: '0.0004', diseasePreset: '0.0004' } },
    { label: 'Prevalence: Sickle cell (AA)', values: { mode: 'prevalence', dominant: '', recessive: '', diseasePrevalence: '0.001667', diseasePreset: '0.001667' } },
    { label: 'Prevalence: Tay Sachs', values: { mode: 'prevalence', dominant: '', recessive: '', diseasePrevalence: '0.000278', diseasePreset: '0.000278' } },
  ],
  compute: (v) => {
    const mode = (v.mode as string) || 'counts'
    let p = 0, q = 0, carrierFreq = 0, diseaseFreq = 0, total = 0

    if (mode === 'counts') {
      const dom = Number(v.dominant) || 0
      const rec = Number(v.recessive) || 0
      total = dom + rec
      if (total > 0) {
        diseaseFreq = rec / total
        q = Math.sqrt(diseaseFreq)
        p = 1 - q
        carrierFreq = 2 * p * q
      }
    } else {
      const raw = Number(v.diseasePrevalence) || 0
      if (raw > 0) {
        const q2 = raw >= 1 ? 1 / raw : raw
        q = Math.sqrt(q2)
        p = 1 - q
        diseaseFreq = q2
        carrierFreq = 2 * p * q
      }
    }

    const carrierOdds = carrierFreq > 0 ? Math.round(1 / carrierFreq) : 0
    const carrierOneIn = carrierOdds > 0 ? `1 in ${carrierOdds}` : 'N/A'
    const diseaseOneIn = diseaseFreq > 0 ? `1 in ${Math.round(1 / diseaseFreq)}` : 'N/A'

    return {
      result: p, label: 'Healthy Allele (p)', unit: '',
      steps: [
        { label: 'Mode', value: mode === 'counts' ? 'Phenotype counts' : 'Disease prevalence' },
        ...(mode === 'counts' ? [{ label: 'Total individuals', value: `${total}` }] : [{ label: 'Disease frequency (q²)', value: `${diseaseFreq.toExponential(4)} (${diseaseOneIn})` }]),
        { label: 'q (mutant allele)', value: q.toFixed(4) },
        { label: 'p (healthy allele)', value: p.toFixed(4) },
        { label: 'Carrier frequency (2pq)', value: `${carrierFreq.toExponential(4)} (${carrierOneIn})` },
        { label: 'Expected AA (p²)', value: `= ${(p * p * 100).toFixed(2)}% of population` },
        { label: 'Expected Aa carriers (2pq)', value: `= ${(carrierFreq * 100).toFixed(2)}% of population` },
        { label: 'Expected aa affected (q²)', value: `= ${(diseaseFreq * 100).toFixed(4)}% of population` },
      ],
      extras: [
        { label: 'Mode', value: mode === 'counts' ? 'Phenotype counts (Hardy-Weinberg)' : 'Disease prevalence (Hardy-Weinberg)' },
        { label: 'Carrier probability', value: carrierOneIn },
        { label: 'Disease frequency', value: diseaseOneIn },
        { label: 'Hardy-Weinberg equation', value: 'p² + 2pq + q² = 1' },
        ...(mode === 'counts' ? [{ label: 'Chi-square test', value: 'Compare expected vs observed for HWE fit' }] : []),
        { label: 'Albinism prevalence', value: '1 in 10,000 (general population)' },
        { label: 'Cystic fibrosis (Caucasian)', value: '1 in 2,500' },
        { label: 'Sickle cell anemia (AA)', value: '1 in 600 (African-American)' },
        { label: 'Tay Sachs (Ashkenazi)', value: '1 in 3,600' },
        { label: 'Phenylketonuria (Caucasian)', value: '1 in 15,000' },
        { label: 'Limitation', value: 'Assumes Hardy-Weinberg equilibrium. Actual frequencies may vary by population.' },
      ],
    }
  },
  description: 'Calculate allele frequencies and carrier probabilities using the Hardy-Weinberg equilibrium equation. Supports both phenotype counts and disease prevalence input.',
  formula: 'q² = disease frequency | q = √q² | p = 1 - q | Carrier freq = 2pq | p² + 2pq + q² = 1',
  interpretation: 'The carrier frequency (2pq) tells you the chance that a randomly selected person carries one copy of the mutant allele. Disease frequency (q²) is the proportion of affected individuals in the population.'
}

export default calcDef
