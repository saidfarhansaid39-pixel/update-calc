import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'AP Flour (g)', type: 'number', unit: 'g', min: 10, step: '10' },
      { name: 'substitute', label: 'Substitute', type: 'select', options: [{ label: 'Whole wheat (1:1)', value: '1_wholewheat' }, { label: 'Almond (0.8x)', value: '0.8_almond' }, { label: 'Coconut (0.3x)', value: '0.3_coconut' }, { label: 'GF blend (1:1)', value: '1_gf' }, { label: 'Oat (1:1)', value: '1_oat' }] }
    ],
    compute: (v) => {
      const p = v.substitute.split('_'); const r = parseFloat(p[0]); const result = v.amount * r; return { result, label: 'Substitute Flour', unit: 'g', steps: [{ label: 'AP flour', value: v.amount + ' g' }, { label: 'Substitute', value: p.slice(1).join(' ') }, { label: 'Ratio', value: r + 'x' }, { label: 'Need', value: result.toFixed(0) + ' g' }] }
    },
    description: 'Convert all-purpose flour to alternatives. Coconut flour needs much less and requires extra eggs.',
    example: { label: '200g AP to almond flour', value: '160g almond flour' }
}

export default calcDef
