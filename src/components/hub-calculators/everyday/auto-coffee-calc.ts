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
  defaults: { accCupsPerDay: '2', accBrewMethod: 'drip', accBeanCost: '12', accCreamerAdd: '0.1', accMachineCost: '40' },
  presets: [
    { label: 'Daily Drip Drinker', values: { accCupsPerDay: '3', accBrewMethod: 'drip', accBeanCost: '10', accCreamerAdd: '0.15', accMachineCost: '30' } },
    { label: 'Espresso Enthusiast', values: { accCupsPerDay: '2', accBrewMethod: 'espresso', accBeanCost: '18', accCreamerAdd: '0', accMachineCost: '500' } },
    { label: 'K-Cup Convenience', values: { accCupsPerDay: '1', accBrewMethod: 'k-cup', accBeanCost: '15', accCreamerAdd: '0.1', accMachineCost: '80' } },
    { label: 'French Press Aficionado', values: { accCupsPerDay: '4', accBrewMethod: 'french', accBeanCost: '14', accCreamerAdd: '0.05', accMachineCost: '35' } },
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
    const cafeEquivalent = v.accCupsPerDay * 4.5 * 365
    const savingsVsCafe = cafeEquivalent - annual
    return { result: monthly, label: 'Monthly Coffee Cost', unit: '$', steps: [{ label: 'Brew Cost per Cup', value: `$${coffeePerCup.toFixed(3)}` }, { label: 'Bean Cost per Cup', value: `$${v.accBeanCost.toFixed(2)} / 60 cups = $${beanCostPerCup.toFixed(3)}` }, { label: 'Brew + Bean', value: `$${totalBrewCost.toFixed(3)}` }, { label: 'Add Creamer/Syrup', value: `$${v.accCreamerAdd.toFixed(2)}` }, { label: 'Total per Cup', value: `$${perCup.toFixed(3)}` }, { label: 'Daily Cost', value: `$${daily.toFixed(2)}` }, { label: 'Monthly Cost', value: `$${monthly.toFixed(2)}` }, { label: 'Annual Cost (incl machine)', value: `$${annual.toFixed(2)}` }] ,
    extras: [
      { label: 'Cafe vs Home Savings', value: `At $4.50/cup cafe price, you would spend $${cafeEquivalent.toFixed(0)}/year. Home brewing saves $${savingsVsCafe.toFixed(0)}/year — that is $${(savingsVsCafe / 365).toFixed(2)}/day.` },
      { label: 'Brew Method Cost Ranking', value: 'Cheapest to most expensive per cup: French Press ($0.18) → Pour Over ($0.22) → Drip ($0.20) → Espresso ($0.30) → K-Cup ($0.65). K-Cups cost 3.6× drip despite less coffee volume.' },
      { label: 'Machine Payback Period', value: `Your $${v.accMachineCost.toFixed(0)} machine pays for itself after ${(v.accMachineCost / (perCup * v.accCupsPerDay)).toFixed(0)} home-brewed cups vs $4.50 cafe drinks. At ${v.accCupsPerDay} cups/day, that is ${((v.accMachineCost / (perCup * v.accCupsPerDay)) / v.accCupsPerDay).toFixed(1)} days.` },
      { label: 'Bean Buying Strategy', value: 'Buy whole beans ($10-18/12oz) instead of pre-ground — flavor degrades 50% after 2 weeks ground. Bulk bins ($8-12/lb) are cheaper than branded bags. A burr grinder ($30-100) pays for itself in better extraction.' },
      { label: 'Creamer Cost Creep', value: `At $${v.accCreamerAdd.toFixed(2)}/cup, creamer adds $${(v.accCreamerAdd * v.accCupsPerDay * 365).toFixed(0)}/year. Switching from $5 flavored syrups to $3 store-brand saves $${((5 - 3) * (v.accCupsPerDay * 365 / 30)).toFixed(0)}/year.` },
      { label: 'Caffeine per Dollar', value: 'Drip coffee delivers ~95mg caffeine per $0.20-0.30 cup. K-Cups deliver ~100mg per $0.65 — you pay 3× more for the same caffeine. Espresso: ~63mg per $0.30 shot.' },
      { label: 'Temperature & Waste', value: 'Brewing water at 195-205°F extracts optimal flavor. Too hot = bitter extraction (wasting beans). Too cold = sour under-extraction (wasting beans). A $15 gooseneck kettle improves extraction efficiency by ~15%.' },
    ]}
  },
  description: 'Calculate your true cost per cup of coffee including brew method, bean cost, creamer, and machine amortization. Compare drip, French press, espresso, pour-over, and K-Cup methods against cafe prices.',
  formula: 'Per Cup = Equipment Amortization + (Brew Cost + Bean Cost) + Creamer | Bean Cost/Cup = Bag Price ÷ 60 Cups | Annual = Daily × 365 + Machine Cost',
  interpretation: 'Home coffee costs $0.18-0.65/cup vs $4-6 at cafes — saving $1,200-2,500/year for a 2-cup-a-day drinker. K-Cups are the most expensive method at 3.6× the cost of drip. French press is cheapest at $0.18/cup ($0.38 with beans). A $500 espresso machine pays for itself in ~170 cups vs cafe espresso drinks at $4.50 each. Grinding fresh beans is the single highest-impact upgrade for both flavor and value.'
}

export default calcDef
