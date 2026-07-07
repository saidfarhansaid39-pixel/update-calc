import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>0'), current: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'voltage', label: 'Voltage', type: 'number', unit: 'V', min: 0, step: '0.1' }, { name: 'current', label: 'Current', type: 'number', unit: 'A', min: 0.001, step: '0.001' }],
  compute: (v) => ({ result: v.voltage / v.current, label: 'Resistance', unit: 'ohm', steps: [{ label: 'Formula', value: 'R = V/I' }, { label: 'Substitute', value: `${v.voltage} / ${v.current}` }, { label: 'Result', value: `${(v.voltage / v.current).toFixed(2)} ohm` }] }),
  description: 'Ohm\'s Law: the voltage across a resistor equals the current through it times its resistance. V = IR.',
  formula: 'R = V / I',
  interpretation: 'A 1 V drop across a 1 ohm resistor produces 1 A of current. Power dissipation P = IV = I^2R = V^2/R.'
}

export default calcDef
