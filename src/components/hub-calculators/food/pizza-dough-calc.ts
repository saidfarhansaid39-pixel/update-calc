import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'pizzas', label: 'Number of Pizzas', type: 'number', min: 1, step: '1' },
      { name: 'size', label: 'Pizza Size', type: 'select', options: [{ label: '10" (200g ball)', value: '200' }, { label: '12" (300g ball)', value: '300' }, { label: '14" (400g ball)', value: '400' }, { label: '16" (550g ball)', value: '550' }] },
      { name: 'hydration', label: 'Hydration', type: 'select', options: [{ label: '60% (firm)', value: '60' }, { label: '65% (standard)', value: '65' }, { label: '70% (airy)', value: '70' }] }
    ],
    compute: (v) => {
      const db = parseInt(v.size); const td = v.pizzas * db; const fl = td / (1 + parseFloat(v.hydration)/100 + 0.02 + 0.006); const wa = fl * parseFloat(v.hydration)/100; const sa = fl * 0.02; const ye = fl * 0.006; return { result: td, label: 'Total Dough', unit: 'g', steps: [{ label: 'Pizzas', value: v.pizzas + ' x ' + db + 'g' }, { label: 'Flour', value: fl.toFixed(0) + ' g' }, { label: 'Water (' + v.hydration + '%)', value: wa.toFixed(0) + ' g' }, { label: 'Salt (2%)', value: sa.toFixed(1) + ' g' }, { label: 'Yeast (0.6%)', value: ye.toFixed(1) + ' g' }] }
    },
    description: 'Pizza dough by baker\'s percentages. Higher hydration = lighter, airier crust.',
    example: { label: '2 x 12" pizzas, 65% hydration', value: '600g dough' }
}

export default calcDef
