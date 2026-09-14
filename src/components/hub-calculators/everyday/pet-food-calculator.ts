import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ petType: z.enum(['dog', 'cat']), weight: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), brand: z.enum(['budget', 'mid-range', 'premium']), bagsPerMonth: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), costPerBag: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'petType', label: 'Pet Type', type: 'select', options: [{ label: 'Dog', value: 'dog' }, { label: 'Cat', value: 'cat' }] },
    { name: 'weight', label: 'Pet Weight (lbs)', type: 'number', min: 1, step: '5' },
    { name: 'brand', label: 'Food Brand Tier', type: 'select', options: [{ label: 'Budget ($)', value: 'budget' }, { label: 'Mid-Range ($$)', value: 'mid-range' }, { label: 'Premium ($$$)', value: 'premium' }] },
    { name: 'bagsPerMonth', label: 'Bags per Month', type: 'number', min: 0, step: '0.5' },
    { name: 'costPerBag', label: 'Cost per Bag ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { petType: 'dog', weight: '50', brand: 'mid-range', bagsPerMonth: '1.5', costPerBag: '45' },
  presets: [
    { label: '50-lb Dog (Mid-Range)', values: { petType: 'dog', weight: '50', brand: 'mid-range', bagsPerMonth: '1.5', costPerBag: '45' } },
    { label: '10-lb Cat (Premium)', values: { petType: 'cat', weight: '10', brand: 'premium', bagsPerMonth: '1', costPerBag: '55' } },
    { label: '70-lb Dog (Budget)', values: { petType: 'dog', weight: '70', brand: 'budget', bagsPerMonth: '2', costPerBag: '30' } },
    { label: 'Small Dog (Budget)', values: { petType: 'dog', weight: '15', brand: 'budget', bagsPerMonth: '0.5', costPerBag: '20' } },
  ],
  compute: (v) => { const dailyCups = v.petType === 'dog' ? Math.max(0.5, v.weight / 30) : Math.max(0.25, v.weight / 20); const dailyOz = dailyCups * (v.petType === 'dog' ? 4.5 : 3.5); const monthlyLbs = dailyOz * 30 / 16; const monthlyCost = v.bagsPerMonth * v.costPerBag; const annualCost = monthlyCost * 12; const costPerDay = monthlyCost / 30; const costPerMeal = costPerDay / (v.petType === 'dog' ? 2 : 3); const brandMultiplier = v.brand === 'premium' ? 2.5 : v.brand === 'mid-range' ? 1.5 : 1; return { result: monthlyCost, label: 'Monthly Food Cost', unit: '$',
    steps: [
      { label: 'Est. Daily Portion', value: `${dailyCups.toFixed(1)} cups (${dailyOz.toFixed(1)} oz)` },
      { label: 'Monthly Food Consumption', value: `${dailyOz.toFixed(1)} oz × 30 ÷ 16 = ${monthlyLbs.toFixed(1)} lbs/mo` },
      { label: 'Bags Bought per Month', value: `${v.bagsPerMonth} bag(s)` },
      { label: 'Monthly Food Cost', value: `${v.bagsPerMonth} × $${v.costPerBag} = $${monthlyCost.toFixed(2)}` },
      { label: 'Annual Food Cost', value: `$${monthlyCost.toFixed(2)} × 12 = $${annualCost.toFixed(2)}` },
      { label: 'Cost per Day', value: `$${costPerDay.toFixed(2)}/day` },
      { label: 'Cost per Meal', value: `$${costPerMeal.toFixed(2)}/meal (${v.petType === 'dog' ? '2' : '3'} meals/day)` },
      { label: 'Brand Tier: ${v.brand}', value: `×${brandMultiplier.toFixed(1)} vs budget ($${v.brand === 'budget' ? 'best value' : v.brand === 'mid-range' ? 'good balance' : 'premium nutrition'})` },
    ],
    extras: [
      { label: '🐕 Feeding Guidelines by Weight', value: 'Dogs: 5-10 lbs = ½-1 cup. 20-30 lbs = 1½-2 cups. 40-60 lbs = 2-3 cups. 70-90 lbs = 3-4 cups. Cats: 5-7 lbs = ¼-⅓ cup. 8-10 lbs = ⅓-½ cup. 12-15 lbs = ½-⅔ cup. Adjust for activity level and age.' },
      { label: '💰 Cost Comparison by Brand Tier', value: 'Budget ($15-30/bag): Store brands, generic — adequate nutrition. Mid-range ($35-55/bag): Purina Pro Plan, Hill\'s Science Diet — research-backed, balanced. Premium ($55-90/bag): Royal Canin, Orijen — high protein, specialized formulas. Premium costs 2-3× budget but may require 15-25% less volume per feeding.' },
      { label: '🧪 Reading Pet Food Labels', value: 'Look for AAFCO nutritional adequacy statement. First ingredient should be a named protein source (chicken, beef, salmon), not "meat meal" or "poultry by-product." Guaranteed analysis: protein (min 22% for dogs, 30% for cats), fat (min 8% dogs, 15% cats).' },
      { label: '📦 Auto-Ship Savings', value: 'Auto-ship from Chewy, Amazon, or Petco saves 5-35% per bag. Chewy Autoship: 5-10% + free shipping over $49. Amazon Subscribe & Save: 5-15%. Petco Vital Care rewards members save 20% on store brand food.' },
      { label: '🐱 Cats Are Obligate Carnivores', value: 'Cats require taurine (an amino acid found only in animal tissue). A taurine-deficient diet causes blindness and heart problems. Always feed cats food specifically formulated for cats — dog food lacks taurine.' },
      { label: '📏 Portion Control Is Critical', value: '56% of dogs and 60% of cats in the US are overweight or obese. Obesity costs $300-1,500/year in extra vet bills. Use a measuring cup (not a scoop) and follow bag guidelines. Treats should be ≤10% of daily calories.' },
      { label: '💧 Wet vs Dry Food Economics', value: 'Wet food: 75-85% moisture — more expensive per calorie but better for hydration and urinary health. Dry food: 6-10% moisture — cheaper, longer shelf life, better for dental health. Many owners feed ½ wet + ½ dry.' },
      { label: '♻️ Subscription Box Services', value: 'Fresh pet food delivery (The Farmer\'s Dog, Ollie, Nom Nom): $2-5/day — 3-4× dry food cost but highly digestible, human-grade ingredients. Some vets recommend for pets with allergies or sensitive stomachs.' },
    ]
  } },
  description: 'Calculate pet food costs with portion estimates based on pet type and weight, bag pricing, and brand tier. Get daily, monthly, annual costs with per-meal breakdowns and feeding guideline comparisons.',
  formula: 'Daily Portion (dogs) = Weight/30 cups, (cats) = Weight/20 cups | Monthly Consumption (lbs) = Portion oz × 30 ÷ 16 | Monthly Cost = Bags × Cost/Bag | Annual Cost = Monthly × 12 | Cost/Day = Monthly ÷ 30',
  interpretation: 'Pet food costs vary dramatically by brand tier: budget ($15-30/bag), mid-range ($35-55), and premium ($55-90+). Premium foods cost 2-3× more but have higher digestibility (15-25% less waste) and better nutrition. A 50-lb dog on mid-range food costs about $60-80/month ($720-960/year). A 10-lb cat on premium food costs about $45-65/month ($540-780/year). Portion control is critical — over 56% of pets are overweight. Auto-ship subscriptions save 5-35% per bag.'
}

export default calcDef
