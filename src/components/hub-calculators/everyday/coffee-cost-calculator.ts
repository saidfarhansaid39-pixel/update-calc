import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ coffeePriceLb: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gramsPerCup: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cupsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), creamerCostMonth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), brewMethod: z.string().min(1), cafePrice: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'coffeePriceLb', label: 'Coffee Price ($/lb)', type: 'number', min: 5, step: '5' },
    { name: 'gramsPerCup', label: 'Grams of Coffee per Cup', type: 'number', min: 5, max: 30, step: '1' },
    { name: 'cupsPerDay', label: 'Cups per Day', type: 'number', min: 1, step: '1' },
    { name: 'creamerCostMonth', label: 'Monthly Creamer/Milk ($)', type: 'number', min: 0, step: '5' },
    { name: 'brewMethod', label: 'Brew Method', type: 'select', options: [{ label: 'Drip', value: 'drip' }, { label: 'Espresso', value: 'espresso' }, { label: 'French Press', value: 'french' }, { label: 'Pour Over', value: 'pourover' }, { label: 'Pod/K-Cup', value: 'pod' }] },
    { name: 'cafePrice', label: 'Café Price per Cup ($)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { coffeePriceLb: '15', gramsPerCup: '15', cupsPerDay: '2', creamerCostMonth: '10', brewMethod: 'drip', cafePrice: '4.5' },
  presets: [
    { label: 'Daily Drip Drinker', values: { coffeePriceLb: '12', gramsPerCup: '15', cupsPerDay: '3', creamerCostMonth: '8', brewMethod: 'drip', cafePrice: '4' } },
    { label: 'Weekend Pour-Over Enthusiast', values: { coffeePriceLb: '20', gramsPerCup: '18', cupsPerDay: '1', creamerCostMonth: '5', brewMethod: 'pourover', cafePrice: '5' } },
    { label: 'Keurig Pod User', values: { coffeePriceLb: '18', gramsPerCup: '10', cupsPerDay: '2', creamerCostMonth: '10', brewMethod: 'pod', cafePrice: '4.5' } },
    { label: 'Espresso Aficionado', values: { coffeePriceLb: '22', gramsPerCup: '18', cupsPerDay: '2', creamerCostMonth: '15', brewMethod: 'espresso', cafePrice: '4' } },
  ],
  compute: (v) => {
    const gramsPerLb = 453.592
    const costPerGram = v.coffeePriceLb / gramsPerLb
    const costPerCup = costPerGram * v.gramsPerCup
    const dailyCoffeeCost = costPerCup * v.cupsPerDay
    const monthlyCoffeeCost = dailyCoffeeCost * 30
    const monthlyTotal = monthlyCoffeeCost + v.creamerCostMonth
    const annualTotal = monthlyTotal * 12
    const cafeAnnual = v.cafePrice * v.cupsPerDay * 365
    const annualSavings = cafeAnnual - annualTotal
    const costPerYearForBeans = monthlyCoffeeCost * 12
    const cupsPerLb = gramsPerLb / v.gramsPerCup
    const daysPerLb = cupsPerLb / v.cupsPerDay
    const podMultiplier = v.brewMethod === 'pod' ? 1.5 : 1
    return { result: monthlyTotal, label: 'Monthly Coffee Cost', unit: '$', steps: [
      { label: `Cost per Gram ($${v.coffeePriceLb.toFixed(2)}/lb)`, value: `$${v.coffeePriceLb.toFixed(2)} ÷ ${gramsPerLb.toFixed(0)}g = $${costPerGram.toFixed(4)}/g` },
      { label: 'Coffee Cost per Cup', value: `$${costPerGram.toFixed(4)}/g × ${v.gramsPerCup}g = $${costPerCup.toFixed(2)}` },
      { label: 'Daily Coffee Cost', value: `$${costPerCup.toFixed(2)} × ${v.cupsPerDay} cup${v.cupsPerDay > 1 ? 's' : ''} = $${dailyCoffeeCost.toFixed(2)}` },
      { label: 'Monthly Coffee (beans)', value: `$${dailyCoffeeCost.toFixed(2)} × 30 = $${monthlyCoffeeCost.toFixed(2)}` },
      { label: 'Creamer/Milk (monthly)', value: `+$${v.creamerCostMonth.toFixed(2)}` },
      { label: `Monthly Total (${v.brewMethod})`, value: `$${monthlyCoffeeCost.toFixed(2)} + $${v.creamerCostMonth.toFixed(2)} = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Total (homemade)', value: `$${monthlyTotal.toFixed(2)} × 12 = $${annualTotal.toFixed(2)}` },
      { label: 'vs Annual Café Cost', value: v.cafePrice > 0 ? `At $${v.cafePrice.toFixed(2)}/cup: $${cafeAnnual.toFixed(2)}/yr — save $${annualSavings.toFixed(0)}/yr` : 'Not compared' },
    ] ,
    extras: [
      { label: 'Drip vs Pod Cost Comparison', value: v.brewMethod === 'pod' ? 'K-Cups cost $0.50-0.80/cup vs $0.15-0.30 for drip. That\'s 2-5× more expensive for similar quality. A $100 reusable pod filter cuts pod cost by 75% and pays for itself in 2-3 months.' : 'Your drip/pourover costs $' + `${costPerCup.toFixed(2)}` + '/cup. Pods would cost 3× more ($' + `${(costPerCup * 3).toFixed(2)}` + '/cup). Stick with loose grounds — cheaper, fresher, and less waste.' },
      { label: `Annual Savings vs Café`, value: v.cafePrice > 0 ? `Making coffee at home saves $${annualSavings.toFixed(0)}/year vs buying at $${v.cafePrice.toFixed(2)}/cup. That's ${(annualSavings / 12 / 30).toFixed(1)} cups of café coffee worth of savings per day. Over 5 years: $${(annualSavings * 5).toFixed(0)} saved — enough for a nice espresso machine.` : 'Enter your typical café price to see how much you\'re saving by brewing at home.' },
      { label: 'Bag Frequency & Freshness', value: `A $${v.coffeePriceLb.toFixed(2)} bag lasts ${cupsPerLb.toFixed(1)} cups = ${daysPerLb.toFixed(1)} days at ${v.cupsPerDay} cup${v.cupsPerDay > 1 ? 's' : ''}/day. You go through ${(v.cupsPerDay / cupsPerLb * 30).toFixed(1)} bags/month. Coffee is freshest 4-14 days post-roast — buy whole bean and grind fresh for best flavor.` },
      { label: 'Brew Method Cost Efficiency', value: v.brewMethod === 'espresso' ? 'Espresso uses 18-20g per shot (double) vs 10-15g for drip. Your cost/shot is $' + `${(costPerGram * 18).toFixed(2)}` + ' — 1.3× a drip cup. But espresso-based drinks at cafés cost $4-6 vs $0.50 espresso at home — you save 88%.' : v.brewMethod === 'pourover' ? `Pour-over ($${costPerCup.toFixed(2)}/cup) uses slightly more coffee than drip (${v.gramsPerCup}g vs 10-12g) but produces a cleaner, more flavorful cup that rivals third-wave cafés.` : `${v.brewMethod === 'french' ? 'French press uses 10-15g/cup — efficient and no paper waste.' : 'Drip is the most cost-efficient: $' + costPerCup.toFixed(2) + '/cup and $' + v.coffeePriceLb.toFixed(2) + '/lb beans.'}` },
      { label: 'Creamer & Milk Economics', value: `At $${v.creamerCostMonth.toFixed(2)}/mo ($$${(v.creamerCostMonth * 12).toFixed(0)}/yr), your creamer adds $${(v.creamerCostMonth / (v.cupsPerDay * 30)).toFixed(2)}/cup. Alternative milks (oat, almond) cost $4-6/half-gallon. Buying in bulk and frothing yourself saves 30-50% vs individual creamer pods or café add-ons.` },
      { label: 'Equipment Cost Amortization', value: 'Add equipment costs to get true TCO: Drip maker ($30-150, 5yr life), Burr grinder ($50-200, 10yr), Espresso machine ($300-2000, 10yr), Pourover kit ($20-50, forever). Spread across daily use: $0.02-0.15/cup for drip equipment vs $0.15-0.55/cup for espresso. Pairing with $' + `${v.coffeePriceLb.toFixed(2)}/lb beans, total per cup: $${(costPerCup + 0.05).toFixed(2)}-${(costPerCup + 0.15).toFixed(2)}.` },
      { label: 'Caffeine per Dollar Analysis', value: `Each cup at ${v.gramsPerCup}g gives ~${Math.round(v.gramsPerCup * 10)}mg caffeine (drip). Cost per 100mg caffeine: $${(costPerCup / (v.gramsPerCup * 10) * 100).toFixed(2)}. Compare: $4.50 café latte gives ~150mg = $3.00/100mg. Your home brew is ${(3 / (costPerCup / (v.gramsPerCup * 10) * 100)).toFixed(1)}× more caffeine-efficient. Energy drinks ($2.50 for 150mg = $1.67/100mg) still cost more than home drip.` },
      { label: 'Environmental Impact', value: v.brewMethod === 'pod' ? 'K-Cups generate 10-12g of plastic waste per cup — that\'s 8,760g/year at 2 cups/day. Switch to a reusable pod filter to eliminate waste. Compostable pods exist but require industrial composting facilities (not home compost).' : 'Paper filters (bleached or unbleached) and coffee grounds are compostable. Your pour-over/drip method generates < 5% of the waste of pods. Used grounds make excellent garden fertilizer — 2% nitrogen by volume.' },
    ]}
  },
  description: 'Calculate the true cost of your coffee habit including beans, creamer, and brew method. Compare homemade costs vs café prices, see annual savings, and get bag-frequency estimates. Supports drip, espresso, French press, pour-over, and pod methods.',
  formula: 'Cost/Cup = (Price/lb ÷ 453.6) × Grams/Cup. Monthly = Cost/Cup × Cups/Day × 30 + Creamer. Annual = Monthly × 12. Café savings = (Café Price × Cups × 365) − Annual. Bags/Month = (Cups/Day × 30) ÷ (453.6 ÷ Grams/Cup).',
  interpretation: 'Homemade coffee costs $0.10-0.60/cup vs $3-6/cup at cafés. A 2-cup/day habit costs $100-400/year homemade vs $2,000-4,500/year at coffee shops — saving $1,600-4,100/year. Pods (K-Cups) cost 2-5× more than drip for equivalent quality. Buying whole-bean coffee ($12-20/lb) and grinding fresh gives the best value-to-flavor ratio. Equipment amortization adds $0.02-0.15/cup for drip, $0.15-0.55 for espresso. A quality burr grinder ($50-200) pays for itself in year one through better extraction and less waste.'
}

export default calcDef
