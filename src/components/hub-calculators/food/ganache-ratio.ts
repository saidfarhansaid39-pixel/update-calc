import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'chocolate', label: 'Chocolate Amount', type: 'number', unit: 'g', min: 50, step: '10' },
      { name: 'use', label: 'Use', type: 'select', options: [{ label: 'Glaze/pouring (2:1 choc:cream)', value: '2' }, { label: 'Filling/truffle (1:1)', value: '1' }, { label: 'Whipped ganache (1:2)', value: '0.5' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.use); const cream = v.chocolate / r; const t = v.chocolate + cream; return { result: t, label: 'Total Ganache', unit: 'g', steps: [{ label: 'Chocolate', value: v.chocolate + ' g' }, { label: 'Cream', value: cream.toFixed(0) + ' g' }, { label: 'Ratio', value: r + ':1' }, { label: 'Total', value: t.toFixed(0) + ' g' }] }
    },
    description: 'Ganache ratios: 2:1 for glaze, 1:1 for truffles, 1:2 for whipped. Use quality chocolate.',
    example: { label: '200g chocolate, truffle (1:1)', value: '400g total ganache' }
}

export default calcDef
