import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    tm: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 45 && n <= 72 }, '45-72'),
    gc: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 20 && n <= 80 }, '20-80'),
    len: z.string().min(1, 'Required').refine(v => { const n = parseInt(v); return n >= 15 && n <= 40 }, '15-40')
}),
  fields: [
    { name: 'tm', label: 'Target Melting Temperature', type: 'number', unit: '°C', min: 45, max: 72, step: '1' },
    { name: 'gc', label: 'GC Content', type: 'number', unit: '%', min: 20, max: 80, step: '1' },
    { name: 'len', label: 'Primer Length', type: 'number', unit: 'bp', min: 15, max: 40, step: '1' },
  ],
  compute: (v) => {
    const issues = []
    if (v.tm < 50 || v.tm > 65) issues.push('Tm outside 50-65°C')
    if (v.gc < 40 || v.gc > 60) issues.push('GC% outside 40-60%')
    if (v.len < 18 || v.len > 25) issues.push('Length outside 18-25 bp')
    return {
      result: issues.length, label: 'Primer Issues Count', unit: '',
      steps: [
        { label: 'Tm', value: `${v.tm}°C (target: 50-65°C)` },
        { label: 'GC content', value: `${v.gc}% (target: 40-60%)` },
        { label: 'Length', value: `${v.len} bp (target: 18-25 bp)` },
        { label: 'Issues flagged', value: issues.length > 0 ? issues.join('; ') : 'None — primer design looks good' },
        { label: 'Rules', value: "Tm diff = 5\u00b0C between pair; 3' end: G/C clamp; avoid 4+ same base; no 3' complementarity" },
      ]
}
  },
  description: 'Primer design quality assessment: optimal primers have Tm 50-65°C, GC 40-60%, length 18-25 bp. Use with complementary Tm and minimal self-complementarity for specific PCR.',
  formula: "Tm(primer) \u02dc 2(AT) + 4(GC) for < 20 bp | \u0394G(3' end) < -9 kcal/mol for efficient priming | Avoid: hairpins, dimers, repeats",
  interpretation: "High Tm may cause non-specific binding; low Tm reduces amplification. GC-rich 3' ends improve priming. Check for secondary structures and cross-dimerization with your specific sequences using primer design software."
}

export default calcDef
