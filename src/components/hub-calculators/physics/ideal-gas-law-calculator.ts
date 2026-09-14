import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pressure: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), volume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), moles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'pressure', label: 'Pressure', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'volume', label: 'Volume', type: 'number', unit: 'm^3', min: 0.0001, step: '0.0001' }, { name: 'moles', label: 'Number of Moles', type: 'number', unit: 'mol', min: 0.001, step: '0.001' }],
  defaults: { pressure: '101325', volume: '0.0224', moles: '1' },
  presets: [
    { label: 'STP (1 mol, 22.4 L)', values: { pressure: '101325', volume: '0.0224', moles: '1' } },
    { label: 'Room air (1 mol, 24.5 L)', values: { pressure: '101325', volume: '0.0245', moles: '1' } },
    { label: 'Car tire (0.5 mol, 10 L, 2.5 atm)', values: { pressure: '253312', volume: '0.01', moles: '0.5' } },
  ],
  compute: (v) => { const R = 8.314; const T = v.pressure * v.volume / (v.moles * R); return { result: T, label: 'Temperature', unit: 'K', steps: [{ label: 'Formula', value: 'PV = nRT' }, { label: 'R', value: '8.314 J/(mol·K)' }, { label: 'Result', value: `${T.toFixed(2)} K` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Ideal gas law applies to weather balloons, SCUBA tanks, car engines, and HVAC systems. STP: 0°C, 1 atm = 22.4 L/mol.' },
        { label: 'Common Values', value: 'R = 8.314 J/(mol·K). STP: 0°C, 1 atm (101325 Pa). Room temp: 298 K (25°C). Car tire: 2.5 atm ≈ 253 kPa.' },
        { label: 'Precision Tip', value: 'Real gases deviate at high pressure (>10 atm) and low temperature. Use van der Waals equation for better accuracy in those regimes.' },
        { label: 'Related Formula', value: 'Combined gas law: P₁V₁/T₁ = P₂V₂/T₂. Van der Waals: (P + an²/V²)(V - nb) = nRT.' },
        { label: 'Unit Conversion Note', value: 'Temperature must be in Kelvin. K = °C + 273.15. 1 atm = 101325 Pa = 760 mmHg. 1 bar = 10⁵ Pa.' }
      ]} },
  description: 'The Ideal Gas Law relates pressure, volume, temperature, and number of moles of an ideal gas. PV = nRT.',
  formula: 'PV = nRT',
  interpretation: 'R = 8.314 J/(mol·K). The ideal gas law assumes no intermolecular forces and negligible molecular volume. Real gases deviate at high P and low T.'
}

export default calcDef
