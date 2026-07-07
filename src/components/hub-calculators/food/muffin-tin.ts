import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'size', label: 'Muffin Size', type: 'select', options: [{ label: 'Mini (3 tbsp)', value: '3' }, { label: 'Standard (4 tbsp)', value: '4' }, { label: 'Jumbo (8 tbsp)', value: '8' }] },
      { name: 'muffins', label: 'Number of Muffins', type: 'number', min: 1, step: '1' }
    ],
    compute: (v) => {
      const tb = parseInt(v.size) * v.muffins; const cu = tb / 16; return { result: tb, label: 'Total Batter', unit: 'tbsp', steps: [{ label: 'Size', value: v.size + ' tbsp each' }, { label: 'Muffins', value: v.muffins }, { label: 'Total', value: tb + ' tbsp (' + cu.toFixed(1) + ' cups)' }] }
    },
    description: 'Muffin batter quantities. Standard uses 4 tbsp (1/4 cup) per muffin. Fill 2/3 full.',
    example: { label: '12 standard muffins', value: '48 tbsp (3 cups)' }
}

export default calcDef
