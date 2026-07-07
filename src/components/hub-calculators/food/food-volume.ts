import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Amount', type: 'number', min: 0, step: '0.25' },
      { name: 'fromUnit', label: 'From Unit', type: 'select', options: [{ label: 'Cups', value: 'cup' }, { label: 'Tablespoons', value: 'tbsp' }, { label: 'Teaspoons', value: 'tsp' }, { label: 'Milliliters', value: 'ml' }, { label: 'Fluid oz', value: 'floz' }] },
      { name: 'toUnit', label: 'To Unit', type: 'select', options: [{ label: 'Cups', value: 'cup' }, { label: 'Tablespoons', value: 'tbsp' }, { label: 'Teaspoons', value: 'tsp' }, { label: 'Milliliters', value: 'ml' }, { label: 'Fluid oz', value: 'floz' }] },
    ],
    compute: (v) => {
      const toMl: Record<string, number> = { cup: 240, tbsp: 15, tsp: 5, ml: 1, floz: 29.5735 }
      const fromMl: Record<string, number> = { cup: 1 / 240, tbsp: 1 / 15, tsp: 1 / 5, ml: 1, floz: 1 / 29.5735 }
      const result = v.amount * toMl[v.fromUnit] * fromMl[v.toUnit]
      return { result, label: 'Converted Volume', unit: v.toUnit, steps: [
        { label: 'Original', value: `${v.amount} ${v.fromUnit}` },
        { label: 'Converted', value: `${result.toFixed(2)} ${v.toUnit}` },
      ]}
    },
    description: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, and fluid ounces. Essential for following international recipes.',
    example: { label: '2 cups to milliliters', value: '480 mL' }
}

export default calcDef
