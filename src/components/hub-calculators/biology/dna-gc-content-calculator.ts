import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    gc: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 100 }, '0-100'),
    length: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0')
}),
  fields: [
    { name: 'gc', label: 'GC Content', type: 'number', unit: '%', min: 0, max: 100, step: '0.1' },
    { name: 'length', label: 'Sequence Length', type: 'number', unit: 'bp', min: 1, step: '1' },
  ],
  compute: (v) => {
    const gcCount = v.length * v.gc / 100
    const atCount = v.length - gcCount
    const tm = 64.9 + 41 * (v.gc - 16.4) / v.length
    return {
      result: v.gc, label: 'GC Content', unit: '%',
      steps: [
        { label: 'GC percentage', value: `${v.gc}%` },
        { label: 'Sequence length', value: `${v.length} bp` },
        { label: 'G+C count', value: `${gcCount.toFixed(0)} bp` },
        { label: 'A+T count', value: `${atCount.toFixed(0)} bp` },
        { label: 'Est. Tm (basic)', value: `${tm.toFixed(1)} °C` },
      ]
}
  },
  description: 'GC content is the percentage of guanine and cytosine bases in a DNA sequence. It affects DNA stability, melting temperature, and primer design.',
  formula: 'GC% = (G+C) / (A+T+G+C) × 100 | Tm ˜ 64.9 + 41×(GC% – 16.4) / Length',
  interpretation: 'GC content ranges from 20-80% in most genomes. Higher GC = more stable DNA duplex. PCR primers typically target 40-60% GC.'
}

export default calcDef
