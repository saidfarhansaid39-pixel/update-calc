import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ voltage: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), impedance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), phase: z.string().min(1).refine(v => { const n = parseFloat(v); return n >= -90 && n <= 90 }, '-90 to 90') }),
  fields: [{ name: 'voltage', label: 'RMS Voltage', type: 'number', unit: 'V', min: 0.1, step: '0.1' }, { name: 'impedance', label: 'Impedance |Z|', type: 'number', unit: 'ohm', min: 0.1, step: '0.1' }, { name: 'phase', label: 'Phase Angle', type: 'number', unit: 'degrees', min: -90, max: 90, step: '1' }],
  defaults: { voltage: '1', impedance: '1', phase: '1' },
  presets: [
    { label: 'Standard example 1', values: { voltage: '1', impedance: '1', phase: '1' } },
    { label: 'Standard example 2', values: { voltage: '10', impedance: '10', phase: '10' } },
    { label: 'Standard example 3', values: { voltage: '100', impedance: '100', phase: '100' } },
  ],
  compute: (v) => { const I = v.voltage / v.impedance; const rad = v.phase * Math.PI / 180; const P = v.voltage * I * Math.cos(rad); return { result: I, label: 'RMS Current', unit: 'A', steps: [{ label: 'I = V/Z', value: `${v.voltage} / ${v.impedance} = ${I.toFixed(3)} A` }, { label: 'Power factor', value: `cos(φ) = ${Math.cos(rad).toFixed(4)}` }, { label: 'Real power', value: `${P.toFixed(2)} W` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'AC circuit analysis: current, power factor, and real power from RMS voltage, impedance magnitude, and phase angle.',
  formula: 'I = V/Z, P = VI·cos(φ)',
  interpretation: 'The power factor cos(φ) ranges from 0 (pure reactive) to 1 (pure resistive). A low power factor means more reactive power and less useful work.'
}

export default calcDef
