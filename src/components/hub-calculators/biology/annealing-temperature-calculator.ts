import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tmPrimer: z.string().transform(v => parseFloat(v)).pipe(z.number().min(30).max(100)),
    tmTarget: z.string().transform(v => parseFloat(v)).pipe(z.number().min(50).max(120)),
    unit: z.string().optional()
}),
  fields: [
    { name: 'tmPrimer', label: 'Primer Melting Temp (Tm?)', type: 'number', unit: '°C', min: 30, max: 100, step: '0.1' },
    { name: 'tmTarget', label: 'Target DNA Melting Temp (Tm?)', type: 'number', unit: '°C', min: 50, max: 120, step: '0.1' },
  ],
  defaults: { tmPrimer: '55', tmTarget: '72', unit: 'celsius' },
  compute: (vals) => {
    const t = parseFloat(vals.tmPrimer || '55')
    const g = parseFloat(vals.tmTarget || '72')
    const unit = vals.unit || 'celsius'
    const ta = 0.3 * t + 0.7 * g - 14.9
    let displayValue = ta
    let displayUnit = '°C'
    if (unit === 'fahrenheit') {
      displayValue = ta * 9/5 + 32
      displayUnit = '°F'
    } else if (unit === 'kelvin') {
      displayValue = ta + 273.15
      displayUnit = 'K'
    }
    return {
      result: ta,
      label: 'Optimal Annealing Temperature (T?)',
      unit: displayUnit,
      steps: [
        { label: 'Weighted primer contribution: 0.3 × Tm?', value: `${(0.3 * t).toFixed(2)}°C` },
        { label: 'Weighted target contribution: 0.7 × Tm?', value: `${(0.7 * g).toFixed(2)}°C` },
        { label: 'Subtract constant: -14.9', value: `${ta.toFixed(2)}°C` },
        { label: `Convert to ${displayUnit}` + (unit !== 'celsius' ? '' : ' (no conversion needed)'), value: `${displayValue.toFixed(2)} ${displayUnit}` },
      ]
}
  },
  formula: 'T? = 0.3 × Tm? + 0.7 × Tm? - 14.9',
  description: 'Annealing temperature is critical for specific PCR amplification. Calculate optimal Ta from your primer and target DNA melting temperatures.',
  interpretation: 'Ta is typically 3-5°C below the lower Tm. Too high: no amplification. Too low: non-specific binding. Use gradient PCR (55-65°C range) to find empirical optimum.',
  presets: [
    { label: 'Standard PCR', values: { tmPrimer: '55', tmTarget: '72' } },
    { label: 'GC-rich template', values: { tmPrimer: '62', tmTarget: '78' } },
    { label: 'Long amplicon (>2kb)', values: { tmPrimer: '58', tmTarget: '68' } },
    { label: 'Cat gene (Felis catus)', values: { tmPrimer: '57.8', tmTarget: '72.5' } },
    { label: 'High-fidelity PCR', values: { tmPrimer: '60', tmTarget: '75' } },
  ],
  formulaVariables: [
    { name: 'T?', value: 66.8, min: 30, max: 90 },
    { name: 'Tm?', value: 57.8, min: 30, max: 100 },
    { name: 'Tm?', value: 72.5, min: 50, max: 120 },
  ]
}

export default calcDef
