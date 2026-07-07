import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ upTotalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), upTotalUnits: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), upUnitName: z.string().min(1), upComparePrice: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), upCompareUnits: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'upTotalPrice', label: 'Item Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'upTotalUnits', label: 'Item Size/Quantity', type: 'number', min: 1, step: '1' },
    { name: 'upUnitName', label: 'Unit Type', type: 'select', options: [{ label: 'Ounces (oz)', value: 'oz' }, { label: 'Pounds (lb)', value: 'lb' }, { label: 'Fluid Ounces (fl oz)', value: 'floz' }, { label: 'Liters', value: 'L' }, { label: 'Each', value: 'each' }, { label: 'Sheets/Rolls', value: 'sheet' }] },
    { name: 'upComparePrice', label: 'Comparison Item Price ($)', type: 'number', min: 0, step: '1' },
    { name: 'upCompareUnits', label: 'Comparison Item Size', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const itemUnitPrice = v.upTotalPrice / v.upTotalUnits
    let compareUnitPrice = 0
    let betterDeal = ''
    if (v.upComparePrice > 0 && v.upCompareUnits > 0) {
      compareUnitPrice = v.upComparePrice / v.upCompareUnits
      if (itemUnitPrice < compareUnitPrice) betterDeal = 'First item is better value'
      else if (itemUnitPrice > compareUnitPrice) betterDeal = 'Comparison item is better value'
      else betterDeal = 'Same value'
    }
    return { result: itemUnitPrice, label: 'Unit Price', unit: '$/unit', steps: [{ label: 'Your Item', value: '$' + v.upTotalPrice.toFixed(2) + ' / ' + v.upTotalUnits + ' ' + v.upUnitName + ' = $' + itemUnitPrice.toFixed(4) + '/' + v.upUnitName }, { label: 'Comparison', value: compareUnitPrice > 0 ? '$' + v.upComparePrice.toFixed(2) + ' / ' + v.upCompareUnits + ' ' + v.upUnitName + ' = $' + compareUnitPrice.toFixed(4) + '/' + v.upUnitName : 'No comparison entered' }, { label: 'Result', value: compareUnitPrice > 0 ? betterDeal : 'Enter comparison to evaluate' }] }
  },
  description: 'Calculate unit price to compare value across different package sizes. Find the best deal on any product.',
  formula: 'Unit Price = Total Price / Total Units | Lower unit price = better value | Compare across brands and sizes',
  interpretation: 'Unit pricing reveals true value. Larger packages often (not always) have lower unit prices. Beware of family size vs jumbo. Generic brands typically have 15-30% lower unit prices than name brands.'
}

export default calcDef
