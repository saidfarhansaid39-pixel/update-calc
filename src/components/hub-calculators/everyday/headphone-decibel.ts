import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ sensitivity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), powerMw: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'sensitivity', label: 'Headphone Sensitivity (dB/mW)', type: 'number', min: 80, step: '1' },
    { name: 'powerMw', label: 'Output Power (mW)', type: 'number', min: 0.1, step: '10' },
  ],
  compute: (v) => { const sen = parseFloat(v.sensitivity)||0; const pwr = parseFloat(v.powerMw)||0; const db = sen + 10 * Math.log10(pwr); return { result: db, label: 'Max SPL', unit: 'dB', steps: [{ label: 'Sensitivity', value: `${sen} dB/mW` }, { label: 'Power', value: `${pwr} mW` }, { label: 'Maximum SPL', value: `${db.toFixed(1)} dB` }] } },
  description: 'Calculate maximum volume (SPL) from headphone sensitivity and amplifier power. Match headphones to audio sources for optimal performance.',
  formula: 'SPL (dB) = Sensitivity (dB/mW) + 10 × log₁₀(Power in mW)',
  interpretation: 'Safe listening: below 85 dB for extended periods. Above 100 dB risks hearing damage in 15 minutes. High-sensitivity headphones (100+ dB/mW) work well with phones. Low-sensitivity planars need dedicated amps.'
}

export default calcDef
