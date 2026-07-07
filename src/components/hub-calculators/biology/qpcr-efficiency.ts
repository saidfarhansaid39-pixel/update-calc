import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    slope: z.string().refine(v => parseFloat(v) < 0, 'must be negative')
}),
  fields: [
    { name: 'slope', label: 'Standard Curve Slope', type: 'number', max: -0.1, step: '0.01' },
  ],
  compute: (v) => {
    const eff = 10 ** (-1 / v.slope) - 1
    const effPct = eff * 100
    return {
      result: effPct, label: 'qPCR Efficiency', unit: '%',
      steps: [
        { label: 'Standard curve slope', value: `${v.slope.toFixed(3)}` },
        { label: 'E = 10^(-1/slope) - 1', value: `${effPct.toFixed(1)}%` },
        { label: 'R² target > 0.99', value: '' },
        { label: 'Optimal efficiency', value: effPct >= 90 && effPct <= 110 ? 'Yes (90-110%)' : effPct > 110 ? 'Too high (inhibitors?)' : 'Too low (poor primers?)' },
      ]
}
  },
  description: 'qPCR efficiency (E) quantifies the amplification performance of a PCR reaction. Perfect amplification doubles the target each cycle (E = 100%).',
  formula: 'E = 10^(-1/slope) - 1 | E% = (E) × 100 | Slope of -3.32 = 100% efficiency',
  interpretation: 'E = 100% perfect doubling. 90-110% is acceptable. Low efficiency (<85%): poor primers, inhibitors, or suboptimal conditions. High efficiency (>110%): possible non-specific amplification.'
}

export default calcDef
