import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'cupcakes', label: 'Number of Cupcakes', type: 'number', min: 1, step: '1' },
      { name: 'technique', label: 'Technique', type: 'select', options: [{ label: 'Spread (1 tbsp each)', value: '1' }, { label: 'Piped swirl (2 tbsp)', value: '2' }, { label: 'Rosette (3 tbsp)', value: '3' }] }
    ],
    compute: (v) => {
      const tb = parseInt(v.technique) * v.cupcakes; const cu = tb / 16; return { result: tb, label: 'Icing Needed', unit: 'tbsp', steps: [{ label: 'Cupcakes', value: v.cupcakes }, { label: 'Per cupcake', value: v.technique + ' tbsp' }, { label: 'Total', value: tb + ' tbsp (' + cu.toFixed(1) + ' cups)' }] }
    },
    description: 'Cupcake icing quantities. Spread = 1 tbsp, piped swirl = 2 tbsp, rosette = 3 tbsp.',
    example: { label: '24 cupcakes, piped swirl', value: '48 tbsp (3 cups)' }
}

export default calcDef
