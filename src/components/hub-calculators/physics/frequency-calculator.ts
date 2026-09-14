import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ speed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wavelength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'speed', label: 'Wave Speed', type: 'number', unit: 'm/s', min: 0.001, step: '0.001' }, { name: 'wavelength', label: 'Wavelength', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { period: '0.01667' },
  presets: [
    { label: '60 Hz AC power', values: { period: '0.01667' } },
    { label: 'Middle C (261.6 Hz)', values: { period: '0.003823' } },
    { label: '1 second period', values: { period: '1' } },
  ],
  compute: (v) => ({ result: v.speed / v.wavelength, label: 'Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f = v/λ' }, { label: 'Substitute', value: `${v.speed} / ${v.wavelength}` }, { label: 'Result', value: `${(v.speed / v.wavelength).toFixed(4)} Hz` }],
      extras: [
        { label: 'Real-World Application', value: 'Frequency determines musical pitch, radio channels, AC power (50/60 Hz), and processor clock speeds. The ear hears 20 Hz to 20 kHz.' },
        { label: 'Common Values', value: 'Middle C: 261.6 Hz. A440: 440 Hz (orchestra tuning). AC power: 50 Hz (EU) / 60 Hz (US). Wi-Fi: 2.4 GHz or 5 GHz.' },
        { label: 'Precision Tip', value: 'Frequency and period are inverses: f = 1/T. For waves, angular frequency ω = 2πf = 2π/T (rad/s).' },
        { label: 'Related Formula', value: 'v = fλ. ω = 2πf. f = 1/T. For pendulums: f = (1/2π)√(g/L). For springs: f = (1/2π)√(k/m).' },
        { label: 'Unit Conversion Note', value: '1 Hz = 1 s⁻¹. 1 kHz = 10³ Hz. 1 MHz = 10⁶ Hz. 1 GHz = 10⁹ Hz. Convert RPM to Hz: divide by 60.' }
      ] }),
  description: 'Frequency is the number of wave cycles per second, calculated from wave speed and wavelength.',
  formula: 'f = v / λ',
  interpretation: 'Human hearing range is 20 Hz to 20,000 Hz. Radio frequencies range from kHz to GHz.'
}

export default calcDef
