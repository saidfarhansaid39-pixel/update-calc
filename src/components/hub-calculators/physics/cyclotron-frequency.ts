import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), field: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Particle Charge', type: 'number', unit: 'C', min: 1.602e-19, step: '1.602e-19' }, { name: 'mass', label: 'Particle Mass', type: 'number', unit: 'kg', min: 1e-31, step: '1e-31' }, { name: 'field', label: 'Magnetic Field', type: 'number', unit: 'T', min: 0.001, step: '0.001' }],
  defaults: { frequency: '60' },
  presets: [
    { label: '60 Hz AC power', values: { frequency: '60' } },
    { label: 'Middle C (261.6 Hz)', values: { frequency: '261.6' } },
    { label: '1 second period', values: { frequency: '1' } },
  ],
  compute: (v) => { const fc = v.charge * v.field / (2 * Math.PI * v.mass); return { result: fc, label: 'Cyclotron Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f_c = qB/(2πm)' }, { label: 'Result', value: `${fc.toExponential(4)} Hz` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Frequency determines musical pitch, radio channels, AC power (50/60 Hz), and processor clock speeds. The ear hears 20 Hz to 20 kHz.' },
        { label: 'Common Values', value: 'Middle C: 261.6 Hz. A440: 440 Hz (orchestra tuning). AC power: 50 Hz (EU) / 60 Hz (US). Wi-Fi: 2.4 GHz or 5 GHz.' },
        { label: 'Precision Tip', value: 'Frequency and period are inverses: f = 1/T. For waves, angular frequency ω = 2πf = 2π/T (rad/s).' },
        { label: 'Related Formula', value: 'v = fλ. ω = 2πf. f = 1/T. For pendulums: f = (1/2π)√(g/L). For springs: f = (1/2π)√(k/m).' },
        { label: 'Unit Conversion Note', value: '1 Hz = 1 s⁻¹. 1 kHz = 10³ Hz. 1 MHz = 10⁶ Hz. 1 GHz = 10⁹ Hz. Convert RPM to Hz: divide by 60.' }
      ]} },
  description: 'Cyclotron frequency is the frequency at which a charged particle orbits in a uniform magnetic field. It is independent of particle speed.',
  formula: 'f_c = qB / (2πm)',
  interpretation: 'Cyclotrons accelerate charged particles using this resonance. The frequency is constant allowing continuous acceleration. Protons in a 1 T field have f_c ≈ 15.2 MHz.'
}

export default calcDef
