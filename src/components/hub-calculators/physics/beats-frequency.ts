import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ freq1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), freq2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'freq1', label: 'Frequency 1', type: 'number', unit: 'Hz', min: 0.1, step: '0.1' }, { name: 'freq2', label: 'Frequency 2', type: 'number', unit: 'Hz', min: 0.1, step: '0.1' }],
  compute: (v) => ({ result: Math.abs(v.freq1 - v.freq2), label: 'Beat Frequency', unit: 'Hz', steps: [{ label: 'Formula', value: 'f_beat = |f1 - f2|' }, { label: 'Substitute', value: `|${v.freq1} - ${v.freq2}|` }, { label: 'Result', value: `${Math.abs(v.freq1 - v.freq2).toFixed(2)} Hz` }] }),
  description: 'Beats occur when two waves of slightly different frequencies interfere, producing periodic variations in amplitude at the difference frequency.',
  formula: 'f_beat = |f1 - f2|',
  interpretation: 'Musicians tune instruments by minimizing beat frequency. When frequencies match exactly, beats disappear. Beat frequency is the absolute difference between the two frequencies.'
}

export default calcDef
