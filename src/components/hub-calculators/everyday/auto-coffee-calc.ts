import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ accCupsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accBrewMethod: z.string().min(1), accBeanCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), accCreamerAdd: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), accMachineCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'accCupsPerDay', label: 'Cups per Day', type: 'number', min: 1, step: '1' },
    { name: 'accBrewMethod', label: 'Brew Method', type: 'select', options: [{ label: 'Drip Machine', value: 'drip' }, { label: 'French Press', value: 'french' }, { label: 'Espresso Machine', value: 'espresso' }, { label: 'Pour Over', value: 'pour' }, { label: 'K-Cup Pods', value: 'k-cup' }] },
    { name: 'accBeanCost', label: 'Coffee Cost per Bag ($) (12oz)', type: 'number', min: 3, step: '2' },
    { name: 'accCreamerAdd', label: 'Creamer/Syrup per Cup ($)', type: 'number', min: 0, step: '0.05' },
    { name: 'accMachineCost', label: 'Machine Cost (one-time $)', type: 'number', min: 0, step: '25' },
  ],
  compute: (v) => {
    const costPerCupCoffee: Record<string, number> = { drip: 0.2, french: 0.18, espresso: 0.3, pour: 0.22, 'k-cup': 0.65 }
    const coffeePerCup = costPerCupCoffee[v.accBrewMethod] || 0.2
    const beanCostPerCup = v.accBeanCost / 60
    const totalBrewCost = coffeePerCup + beanCostPerCup
    const perCup = totalBrewCost + v.accCreamerAdd
    const daily = perCup * v.accCupsPerDay
    const monthly = daily * 30
    const machineAmort = v.accMachineCost / 365
    const annual = daily * 365 + v.accMachineCost
    return { result: monthly, label: 'Monthly Coffee Cost', unit: '$', steps: [{ label: 'Per Cup (brew + bean)', value: `$${totalBrewCost.toFixed(3)}` }, { label: 'Add Creamer', value: `$${v.accCreamerAdd.toFixed(2)}` }, { label: 'Total per Cup', value: `$${perCup.toFixed(3)}` }, { label: 'Daily Cost', value: `$${daily.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual (incl machine)', value: `$${annual.toFixed(2)}` }] }
  },
  description: 'Calculate your daily, monthly, and annual coffee expenses based on brew method, bean cost, and add-ons. Compare home brewing to cafe prices.',
  formula: 'Per Cup = Brew Cost + Bean Cost + Creamer | Monthly = Per Cup × Cups/Day × 30',
  interpretation: 'Home coffee costs $0.20-0.65/cup vs $4-6 at cafes. K-Cups are 3× more expensive than drip. A $1,000 espresso machine pays for itself in ~250 cups vs cafe prices. Grinding fresh beans is the biggest flavor upgrade for the lowest cost.'
}

export default calcDef
