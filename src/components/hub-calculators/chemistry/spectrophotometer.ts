import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    mode: z.string().min(1, 'Required'),
    value: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'mode', label: 'Convert from', type: 'select', options: [
      { label: '% Transmittance → Absorbance', value: 'TtoA' },
      { label: 'Absorbance → % Transmittance', value: 'AtoT' },
    ] },
    { name: 'value', label: 'Value', type: 'number', unit: '', min: 0.001, step: 'any' },
  ],
  compute: (v) => {
    if (v.mode === 'TtoA') {
      const T = v.value / 100
      const A = -Math.log10(T)
      return {
        result: A, label: 'Absorbance (A)', unit: 'AU',
        steps: [
          { label: '%T', value: `${v.value}%` },
          { label: 'T = %T/100', value: `${T.toFixed(4)}` },
          { label: 'A = -log₁₀(T)', value: `${A.toFixed(4)} AU` },
        ]
}
    } else {
      const T = Math.pow(10, -v.value) * 100
      return {
        result: T, label: 'Transmittance', unit: '%T',
        steps: [
          { label: 'A', value: `${v.value} AU` },
          { label: 'T = 10⁻ᴬ', value: `${(T / 100).toExponential(4)}` },
          { label: '%T = T × 100', value: `${T.toFixed(2)}%` },
        ]
}
    }
  },
  description: 'Spectrophotometers measure transmittance (%T) or absorbance (A) of light through a sample. Absorbance is related to concentration via Beer-Lambert law: A = εbc.',
  formula: 'A = -log₁₀(T) | T = 10⁻ᴬ | %T = T × 100 | A = εbc',
  interpretation: 'Absorbance is linear with concentration (Beer-Lambert), while transmittance is logarithmic. A = 0 means 100% transmitted, A = 1 means 10% transmitted, A = 2 means 1% transmitted.'
}

export default calcDef
