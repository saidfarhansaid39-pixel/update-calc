import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ giftCardBalance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), discountRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cashbackRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'giftCardBalance', label: 'Gift Card Balance ($)', type: 'number', min: 1, step: '5' },
    { name: 'discountRate', label: 'Purchase Discount (%)', type: 'number', min: 0, max: 100, step: '1' },
    { name: 'cashbackRate', label: 'Cashback/Rewards (%)', type: 'number', min: 0, max: 100, step: '0.5' },
  ],
  compute: (v) => {
    const effectiveValue = v.giftCardBalance / (1 - v.discountRate / 100)
    const cashback = v.giftCardBalance * (v.cashbackRate / 100)
    const totalValue = v.giftCardBalance + cashback
    return { result: totalValue, label: 'Total Value', unit: '$', steps: [{ label: 'Face Value', value: `$${v.giftCardBalance.toFixed(2)}` }, { label: 'Effective Purchase Cost', value: `$${(v.giftCardBalance * (1 - v.discountRate / 100)).toFixed(2)}` }, { label: 'Cashback Earned', value: `$${cashback.toFixed(2)}` }, { label: 'Total Value', value: `$${totalValue.toFixed(2)}` }] }
  },
  description: 'Calculate the true value of a gift card including purchase discounts and cashback rewards. Gift cards bought at a discount effectively have higher value.',
  formula: 'Effective Cost = Balance × (1 - Discount%) | Total Value = Balance + Cashback',
  interpretation: 'Buying discounted gift cards (e.g., 10% off) effectively gives you 11.1% more spending power. Combine with cashback for maximum savings.'
}

export default calcDef
