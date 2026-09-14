import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ freq1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), freq2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'freq1', label: 'Frequency 1', type: 'number', unit: 'Hz', min: 0.1, step: '0.1' }, { name: 'freq2', label: 'Frequency 2', type: 'number', unit: 'Hz', min: 0.1, step: '0.1' }],
  defaults: { frequency: '60' },
  presets: [
    { label: '60 Hz AC power', values: { frequency: '60' } },
    { label: 'Middle C (261.6 Hz)', values: { frequency: '261.6' } },
    { label: '1 second period', values: { frequency: '1' } },
  ],
  compute: (v) => ({ result: Math.abs(v.freq1 - v.freq2), label: 'Beat Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f_beat = |f1 - f2|' }, { label: 'Substitute', value: `|${v.freq1} - ${v.freq2}|` }, { label: 'Result', value: `${Math.abs(v.freq1 - v.freq2).toFixed(2)} Hz` }],
      extras: [
        { label: 'Real-World Application', value: 'Frequency determines musical pitch, radio channels, AC power (50/60 Hz), and processor clock speeds. The ear hears 20 Hz to 20 kHz.' },
        { label: 'Common Values', value: 'Middle C: 261.6 Hz. A440: 440 Hz (orchestra tuning). AC power: 50 Hz (EU) / 60 Hz (US). Wi-Fi: 2.4 GHz or 5 GHz.' },
        { label: 'Precision Tip', value: 'Frequency and period are inverses: f = 1/T. For waves, angular frequency ω = 2πf = 2π/T (rad/s).' },
        { label: 'Related Formula', value: 'v = fλ. ω = 2πf. f = 1/T. For pendulums: f = (1/2π)√(g/L). For springs: f = (1/2π)√(k/m).' },
        { label: 'Unit Conversion Note', value: '1 Hz = 1 s⁻¹. 1 kHz = 10³ Hz. 1 MHz = 10⁶ Hz. 1 GHz = 10⁹ Hz. Convert RPM to Hz: divide by 60.' }
      ] }),
  description: 'Beats occur when two waves of slightly different frequencies interfere, producing periodic variations in amplitude at the difference frequency.',
  formula: 'f_beat = |f1 - f2|',
  interpretation: 'Musicians tune instruments by minimizing beat frequency. When frequencies match exactly, beats disappear. Beat frequency is the absolute difference between the two frequencies.'
}

export default calcDef
