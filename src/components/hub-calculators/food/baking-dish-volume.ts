import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'length', label: 'Length', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 10, step: '1' },
      { name: 'width', label: 'Width', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 10, step: '1' },
      { name: 'depth', label: 'Depth', type: 'number', unit: 'cm', units: [{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }], defaultUnit: 'cm', min: 3, step: '0.5' }
    ],
    compute: (v) => {
      const l = v.length * v.width * v.depth / 1000; const c = l * 4.227; return { result: l, label: 'Dish Volume', unit: 'L', steps: [{ label: 'Dimensions', value: v.length + 'x' + v.width + 'x' + v.depth + ' cm' }, { label: 'Volume', value: l.toFixed(2) + ' L' }, { label: 'Cups', value: c.toFixed(1) }] }
    },
    description: 'Baking dish volume in litres. Essential for substituting pans and adjusting recipes.',
    example: { label: '30x20x5 cm dish', value: '3.0 L (12.7 cups)' }
}

export default calcDef
