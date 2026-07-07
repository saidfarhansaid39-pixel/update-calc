import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ coffeePriceLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gramsPerCup: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cupsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), creamerCostMonth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'coffeePriceLb', label: 'Coffee Price ($/lb)', type: 'number', min: 5, step: '5' },
    { name: 'gramsPerCup', label: 'Grams of Coffee per Cup', type: 'number', min: 5, max: 30, step: '1' },
    { name: 'cupsPerDay', label: 'Cups per Day', type: 'number', min: 1, step: '1' },
    { name: 'creamerCostMonth', label: 'Monthly Creamer/Milk ($)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const gramsPerLb = 453.592
    const costPerGram = v.coffeePriceLb / gramsPerLb
    const costPerCup = costPerGram * v.gramsPerCup
    const dailyCoffeeCost = costPerCup * v.cupsPerDay
    const monthlyCoffeeCost = dailyCoffeeCost * 30
    const monthlyTotal = monthlyCoffeeCost + v.creamerCostMonth
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Monthly Coffee Cost', unit: '$', steps: [{ label: 'Per Cup', value: `$${costPerCup.toFixed(2)}` }, { label: 'Daily Coffee', value: `$${dailyCoffeeCost.toFixed(2)}` }, { label: 'Monthly Coffee', value: `$${monthlyCoffeeCost.toFixed(2)}` }, { label: 'Creamer/Milk', value: `$${v.creamerCostMonth.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }] }
  },
  description: 'Calculate how much you spend on coffee including beans and creamer. Compare homemade coffee costs vs café prices and see your annual coffee spending.',
  formula: 'Cost/Cup = Price/lb / 453.6 × Grams/Cup | Monthly = Cost/Cup × Cups/Day × 30 + Creamer',
  interpretation: 'Homemade coffee costs $0.15-0.50/cup vs $3-6/cup at cafés. A 2-cup-per-day habit costs $180-600/yr homemade vs $2,000-4,000/yr at coffee shops. Quality beans ($15-20/lb) cost less than café drinks.'
}

export default calcDef
