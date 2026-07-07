import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    baitAuto: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    preySignal: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'),
    negControl: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0')
}),
  fields: [
    { name: 'baitAuto', label: 'Bait-only Background', type: 'number', min: 0, step: '0.001' },
    { name: 'preySignal', label: 'Prey + Bait Signal (ß-gal/LUC)', type: 'number', min: 0, step: '0.001' },
    { name: 'negControl', label: 'Negative Control (empty prey)', type: 'number', min: 0, step: '0.001' },
  ],
  compute: (v) => {
    const correctedSignal = Math.max(0, v.preySignal - v.baitAuto)
    const foldActivation = v.negControl > 0 ? correctedSignal / v.negControl : correctedSignal / 0.001
    return {
      result: foldActivation, label: 'Fold Activation (vs Negative Control)', unit: 'x',
      steps: [
        { label: 'Bait-only background', value: `${v.baitAuto.toFixed(3)}` },
        { label: 'Bait + prey signal', value: `${v.preySignal.toFixed(3)}` },
        { label: 'Corrected signal = prey - bait auto', value: `${correctedSignal.toFixed(3)}` },
        { label: 'Neg control (empty prey + bait)', value: `${v.negControl.toFixed(3)}` },
        { label: 'Fold activation = corrected / neg control', value: `${foldActivation.toFixed(1)}x` },
        { label: 'Interpretation', value: foldActivation >= 10 ? 'Strong positive interaction' : foldActivation >= 5 ? 'Moderate interaction' : foldActivation >= 3 ? 'Weak/possible interaction' : 'No significant interaction' },
        { label: 'Controls needed', value: 'Test bait autoactivation before screening. Include known positive and negative controls.' },
      ]
}
  },
  description: 'The yeast two-hybrid (Y2H) assay detects protein-protein interactions by reconstituting a transcription factor. Bait (DNA-binding domain fusion) and prey (activation domain fusion) interact to activate a reporter gene (e.g., lacZ, HIS3, ADE2).',
  formula: 'Fold activation = (Prey signal - Bait autoactivation) / Neg control signal | = 10x: strong positive | 5-10x: moderate | 3-5x: weak/ambiguous',
  interpretation: 'Critical controls: bait-only autoactivation test, empty prey vector, known positive interaction pair. False positives from sticky/prey autoactivation. False negatives from improper folding or localization. Confirm with Co-IP, GST pull-down, or BRET. Library screening: typical 106-107 transformants for comprehensive coverage.'
}

export default calcDef
