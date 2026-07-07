import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    gc: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    salt: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'gc', label: 'GC Content', type: 'number', unit: '%', min: 0, max: 100, step: '0.1' },
    { name: 'length', label: 'Primer Length', type: 'number', unit: 'bp', min: 1, step: '1' },
    { name: 'salt', label: '[Na+] (optional)', type: 'number', unit: 'mM', min: 0, step: '0.1' },
  ],
  compute: (v) => {
    const tmBasic = 64.9 + 41 * (v.gc - 16.4) / v.length
    const salt = v.salt || 50
    const tmSaltCorrected = tmBasic + 16.6 * Math.log10(salt / (1 + 0.7 * salt))
    const ta = tmSaltCorrected - 5
    return {
      result: ta, label: 'Annealing Temp (Ta)', unit: '°C',
      steps: [
        { label: 'GC content', value: `${v.gc}%` },
        { label: 'Primer length', value: `${v.length} bp` },
        { label: '[Na+]', value: `${salt} mM` },
        { label: 'Basic Tm', value: `${tmBasic.toFixed(1)} °C` },
        { label: 'Salt-corrected Tm', value: `${tmSaltCorrected.toFixed(1)} °C` },
        { label: 'Annealing temp (Tm–5)', value: `${ta.toFixed(1)} °C` },
      ]
}
  },
  description: 'PCR annealing temperature is critical for specific amplification. Calculate primer melting temperature and optimal annealing temperature based on sequence and salt.',
  formula: 'Tm = 64.9 + 41×(GC% – 16.4)/Length | Ta = Tm – 5°C',
  interpretation: 'Ta is typically 3-5°C below Tm. Too high: no amplification. Too low: non-specific binding. Gradient PCR finds optimal Ta empirically.'
}

export default calcDef
