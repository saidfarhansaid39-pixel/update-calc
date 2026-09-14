import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'voltage', label: 'Voltage', type: 'number', unit: 'V', min: 0, step: '0.1' }, { name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  defaults: { voltage: '12', current: '1' },
  presets: [
    { label: 'USB charger (5 V, 2 A)', values: { voltage: '5', current: '2' } },
    { label: 'LED circuit (3.3 V, 20 mA)', values: { voltage: '3.3', current: '0.02' } },
    { label: 'Household (120 V, 10 A)', values: { voltage: '120', current: '10' } },
  ],
  compute: (v) => ({ result: v.voltage / v.current, label: 'Resistance', unit: 'ohm', steps: [{ label: 'Formula', value: 'R = V/I' }, { label: 'Substitute', value: `${v.voltage} / ${v.current}` }, { label: 'Result', value: `${(v.voltage / v.current).toFixed(2)} ohm` }],
      extras: [
        { label: 'Real-World Application', value: 'Ohm\'s law is fundamental to all electronics. It sizes resistors for LEDs, determines wire gauge for current capacity, and analyzes circuit behavior.' },
        { label: 'Common Values', value: 'USB: 5 V, up to 3 A. Household: 120 V (US) / 230 V (EU). Resistor values: 10 Ω - 10 MΩ. LED forward voltage: 1.8-3.3 V.' },
        { label: 'Precision Tip', value: 'Ohm\'s law is linear only for ohmic materials (metals at constant temperature). Diodes, transistors, and heating elements are non-ohmic.' },
        { label: 'Related Formula', value: 'Power: P = VI = I²R = V²/R. Series: R_total = R₁+R₂+... Parallel: 1/R_total = 1/R₁+1/R₂+...' },
        { label: 'Unit Conversion Note', value: '1 Ω = 1 V/A. Use kΩ (10³), MΩ (10⁶). mA (10⁻³) for small currents. 1 mΩ = 0.001 Ω for very low resistances.' }
      ] }),
  description: 'Ohm\'s Law: the voltage across a resistor equals the current through it times its resistance. V = IR.',
  formula: 'R = V / I',
  interpretation: 'A 1 V drop across a 1 ohm resistor produces 1 A of current. Power dissipation P = IV = I^2R = V^2/R.'
}

export default calcDef
