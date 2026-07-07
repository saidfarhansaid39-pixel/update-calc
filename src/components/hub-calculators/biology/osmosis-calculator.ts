import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    concentration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    temperature: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= -10 && n <= 100 }, '-10 to 100')
}),
  fields: [
    { name: 'concentration', label: 'Solute Concentration', type: 'number', unit: 'M', min: 0.001, step: '0.001' },
    { name: 'temperature', label: 'Temperature', type: 'number', unit: '°C', min: -10, max: 100, step: '0.1' },
  ],
  compute: (v) => {
    const tk = v.temperature + 273.15
    const pi = v.concentration * 0.082057 * tk
    return {
      result: pi, label: 'Osmotic Pressure', unit: 'atm',
      steps: [
        { label: 'Concentration', value: `${v.concentration} M` },
        { label: 'Temperature', value: `${v.temperature} °C (${tk.toFixed(2)} K)` },
        { label: 'p = cRT', value: `${v.concentration} × 0.0821 × ${tk.toFixed(1)}` },
        { label: 'Osmotic pressure', value: `${pi.toFixed(2)} atm` },
      ]
}
  },
  description: 'Osmotic pressure is the pressure required to prevent solvent flow across a semipermeable membrane. It is proportional to solute concentration and temperature.',
  formula: 'p = cRT (van\'t Hoff equation) | R = 0.082057 L·atm/mol·K',
  interpretation: 'Higher solute concentration = higher osmotic pressure. In biology, osmotic pressure drives water movement across cell membranes and affects cell volume.'
}

export default calcDef
