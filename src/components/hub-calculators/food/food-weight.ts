import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'amount', label: 'Amount', type: 'number', min: 0, step: '0.1' },
      { name: 'fromUnit', label: 'From Unit', type: 'select', options: [{ label: 'Grams (g)', value: 'g' }, { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Ounces (oz)', value: 'oz' }, { label: 'Pounds (lb)', value: 'lb' }] },
      { name: 'toUnit', label: 'To Unit', type: 'select', options: [{ label: 'Grams (g)', value: 'g' }, { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Ounces (oz)', value: 'oz' }, { label: 'Pounds (lb)', value: 'lb' }] },
    ],
    compute: (v) => {
      const toGrams: Record<string, number> = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 }
      const fromGrams: Record<string, number> = { g: 1, kg: 0.001, oz: 0.035274, lb: 0.00220462 }
      const result = v.amount * toGrams[v.fromUnit] * fromGrams[v.toUnit]
      return { result, label: 'Converted Weight', unit: v.toUnit, steps: [
        { label: 'Original', value: `${v.amount} ${v.fromUnit}` },
        { label: 'Converted', value: `${result.toFixed(2)} ${v.toUnit}` },
      ]}
    },
    description: 'Convert food weights between grams, kilograms, ounces, and pounds. Essential for following recipes using different measurement systems.',
    example: { label: '500g to ounces', value: '17.6 oz' }
}

export default calcDef
