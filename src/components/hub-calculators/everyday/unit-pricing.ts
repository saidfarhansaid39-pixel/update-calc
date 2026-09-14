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
  defaults: { upTotalPrice: '5.99', upTotalUnits: '16', upUnitName: 'oz', upComparePrice: '8.49', upCompareUnits: '24' },
  presets: [
    { label: 'Pasta Sauce (jars)', values: { upTotalPrice: '3.49', upTotalUnits: '24', upUnitName: 'oz', upComparePrice: '5.29', upCompareUnits: '45' } },
    { label: 'Paper Towels (rolls)', values: { upTotalPrice: '6.99', upTotalUnits: '6', upUnitName: 'sheet', upComparePrice: '11.99', upCompareUnits: '12' } },
    { label: 'Olive Oil (bottles)', values: { upTotalPrice: '8.99', upTotalUnits: '17', upUnitName: 'floz', upComparePrice: '14.99', upCompareUnits: '34' } },
    { label: 'Chicken (per pound)', values: { upTotalPrice: '7.99', upTotalUnits: '3', upUnitName: 'lb', upComparePrice: '12.99', upCompareUnits: '5' } },
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
    return { result: itemUnitPrice, label: 'Unit Price', unit: '$/unit', steps: [
      { label: 'Formula', value: 'Unit Price = Total Price ÷ Total Units' },
      { label: 'Your Item', value: '$' + v.upTotalPrice.toFixed(2) + ' ÷ ' + v.upTotalUnits + ' ' + v.upUnitName + ' = $' + itemUnitPrice.toFixed(4) + '/' + v.upUnitName },
      { label: 'Comparison', value: compareUnitPrice > 0 ? '$' + v.upComparePrice.toFixed(2) + ' ÷ ' + v.upCompareUnits + ' ' + v.upUnitName + ' = $' + compareUnitPrice.toFixed(4) + '/' + v.upUnitName : 'No comparison entered' },
      { label: 'Savings per Unit', value: compareUnitPrice > 0 ? '$' + Math.abs(itemUnitPrice - compareUnitPrice).toFixed(4) + '/' + v.upUnitName + ' (cheaper: ' + betterDeal + ')' : 'Enter comparison to evaluate' },
    ] ,
    extras: [
      { label: 'Generic Savings', value: 'Generic/store brands typically have 15-30% lower unit prices than name brands with similar quality' },
      { label: 'Bulk Fallacy', value: 'Larger packages do NOT always have lower unit prices — always check. "Family size" can cost more per ounce' },
      { label: 'Unit Labeling', value: 'US law requires unit pricing on shelf tags at major grocery chains — check the orange price label' },
      { label: 'Warehouse Clubs', value: 'Costco/Sam\'s Club bulk pricing: typically 10-35% cheaper per unit than regular grocery stores' },
      { label: 'Loss Leaders', value: 'Milk, eggs, and bread are often sold near cost to get you in the store — their unit prices are hard to beat' },
      { label: 'Coupon Stacking', value: 'Coupons reduce effective unit price. A $1 off coupon on a $5 item = 20% lower unit price' },
      { label: 'Price Per Serving', value: 'For items with different densities, compare per-serving cost instead of per-ounce for better accuracy' },
      { label: 'Subscription Trap', value: 'Subscribe & Save offers look like deals but check the unit price — sometimes cheaper at the store' },
    ]}
  },
  description: 'Compare the true value of products by calculating unit price across different package sizes and brands. Essential for grocery shopping, bulk buying decisions, and maximizing your food budget.',
  formula: 'Unit Price = Total Price ÷ Total Units. The item with the lower unit price is the better value. Compare across identical unit types (oz to oz, lb to lb) for accurate results.',
  interpretation: 'Unit pricing reveals the real cost per ounce, pound, or count regardless of package size. A 24 oz jar at $5.99 ($0.25/oz) beats a 16 oz jar at $4.49 ($0.28/oz). Always compare unit prices on shelf tags — larger packages are often but not always cheaper per unit.'
}

export default calcDef
