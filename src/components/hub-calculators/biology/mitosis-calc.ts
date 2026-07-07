import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({
    totalCells: z.string().min(1, 'Required').refine(v => parseInt(v) > 0, 'Must be > 0'),
    prophase: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    metaphase: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    anaphase: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0'),
    telophase: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'totalCells', label: 'Total Cells Counted', type: 'number', min: 10, step: '1' },
    { name: 'prophase', label: 'Prophase Cells', type: 'number', min: 0, step: '1' },
    { name: 'metaphase', label: 'Metaphase Cells', type: 'number', min: 0, step: '1' },
    { name: 'anaphase', label: 'Anaphase Cells', type: 'number', min: 0, step: '1' },
    { name: 'telophase', label: 'Telophase Cells', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const mitotic = v.prophase + v.metaphase + v.anaphase + v.telophase
    const mi = mitotic / v.totalCells * 100
    return {
      result: mi, label: 'Mitotic Index', unit: '%',
      steps: [
        { label: 'Total cells', value: `${v.totalCells}` },
        { label: 'Mitotic cells', value: `${mitotic}` },
        { label: 'Mitotic index', value: `${mi.toFixed(2)}%` },
        { label: 'Prophase', value: mitotic > 0 ? `${(v.prophase / mitotic * 100).toFixed(1)}% of mitotic` : '—' },
        { label: 'Metaphase', value: mitotic > 0 ? `${(v.metaphase / mitotic * 100).toFixed(1)}% of mitotic` : '—' },
        { label: 'Anaphase', value: mitotic > 0 ? `${(v.anaphase / mitotic * 100).toFixed(1)}% of mitotic` : '—' },
        { label: 'Telophase', value: mitotic > 0 ? `${(v.telophase / mitotic * 100).toFixed(1)}% of mitotic` : '—' },
      ]
}
  },
  description: 'Mitosis stage distribution analysis determines the proportion of cells in each mitotic phase. Phase timing reveals cell cycle dynamics and effects of treatments that arrest mitosis.',
  formula: 'Mitotic Index = S(mitotic cells) / Total cells × 100% | Stage % = Stage count / S(mitotic cells) × 100%',
  interpretation: 'Normal tissue mitotic index < 1%. Prophase is typically longest (40-60% of mitotic cells). High metaphase index suggests mitotic arrest (colchicine, taxanes). Tissue with high proliferation (bone marrow, tumors) has higher index.'
}

export default calcDef
