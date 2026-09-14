import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ mealsPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), caloriesPerMeal: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), people: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mealsPerWeek', label: 'Fast Food Meals/Week', type: 'number', min: 1, step: '1' },
    { name: 'costPerMeal', label: 'Cost per Meal ($)', type: 'number', min: 1, step: '2' },
    { name: 'caloriesPerMeal', label: 'Calories per Meal', type: 'number', min: 200, step: '100' },
    { name: 'people', label: 'Number of People', type: 'number', min: 1, step: '1' },
  ],
  defaults: { mealsPerWeek: '3', costPerMeal: '10', caloriesPerMeal: '1000', people: '1' },
  presets: [
    { label: 'Lunch Rush (Single)', values: { mealsPerWeek: '5', costPerMeal: '12', caloriesPerMeal: '900', people: '1' } },
    { label: 'Family Drive-Thru (4)', values: { mealsPerWeek: '2', costPerMeal: '9', caloriesPerMeal: '1100', people: '4' } },
    { label: 'Late Night Student', values: { mealsPerWeek: '4', costPerMeal: '7', caloriesPerMeal: '1300', people: '1' } },
    { label: 'Health-Conscious Minimal', values: { mealsPerWeek: '1', costPerMeal: '14', caloriesPerMeal: '650', people: '1' } },
  ],
  compute: (v) => {
    const weeklyCost = v.mealsPerWeek * v.costPerMeal * v.people
    const monthlyCost = weeklyCost * 4.33
    const annualCost = weeklyCost * 52
    const weeklyCalories = v.mealsPerWeek * v.caloriesPerMeal * v.people
    const dailyAvgCal = weeklyCalories / 7
    const pctDailyIntake = (dailyAvgCal / 2000) * 100
    const tenYearCost = annualCost * 10
    const yearlyWeightGainLbs = (dailyAvgCal > 0 ? (dailyAvgCal - 2000) * 365 / 3500 : 0)
    const weeklySodiumMg = v.mealsPerWeek * 1200 * v.people
    const dailySodiumMg = weeklySodiumMg / 7
    const mealCostPerPerson = v.costPerMeal
    const calPerDollar = v.caloriesPerMeal / v.costPerMeal
    return { result: monthlyCost, label: 'Monthly Fast Food Spend', unit: '$', steps: [
      { label: 'Meals per Week', value: `${v.mealsPerWeek} × ${v.people} people = ${v.mealsPerWeek * v.people} total meals` },
      { label: 'Weekly Cost', value: `$${weeklyCost.toFixed(0)}` },
      { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(0)}` },
      { label: 'Annual Cost', value: `$${annualCost.toFixed(0)}` },
      { label: '10-Year Cost', value: `$${tenYearCost.toFixed(0)}` },
      { label: 'Daily Calorie Impact', value: `${dailyAvgCal.toFixed(0)} cal (${pctDailyIntake.toFixed(0)}% of 2000 cal diet)` },
      { label: 'Annual Weight Impact', value: yearlyWeightGainLbs > 0 ? `~+${yearlyWeightGainLbs.toFixed(0)} lbs/yr` : '~0 lbs (within maintenance)' },
      { label: 'Daily Sodium', value: `~${dailySodiumMg.toFixed(0)} mg (${(dailySodiumMg / 2300 * 100).toFixed(0)}% of RDI)` },
      { label: 'Calories per Dollar', value: `${calPerDollar.toFixed(0)} cal/$ (vs 50-80 cal/$ for groceries)` },
    ] ,
    extras: [
      { label: "Most-Ordered Items by Chain", value: "McDonald's: Big Mac (550 cal, $5-6), 10pc McNuggets (480 cal, $5-7). Chick-fil-A: Chicken Sandwich (440 cal, $5-6). Taco Bell: Crunchwrap Supreme (530 cal, $4-5). Subway: Footlong Turkey (560 cal, $8-10). Chipotle: Burrito (1,100-1,400 cal, $9-11). The 'value menu' items are typically 200-400 cal at $1-3." },
      { label: "Hidden Health Costs", value: "A single fast food meal often exceeds: 100% of daily saturated fat (13-20g), 50-80% of sodium (1,500-2,300 mg), and 50-100% of added sugar (50-80g in a large soda). The combination of high sodium + high sugar + low fiber is disproportionately harmful for metabolic health vs the same calories from whole foods." },
      { label: "Meal Prep vs Fast Food Math", value: "Average fast food meal: $10-14 per person. Home-cooked equivalent: $3-5 per person. Weekly meal prep (Sunday, 2 hrs): makes 10-14 meals at $3-5 each. Annual savings: $2,600-5,200 for a family of 2 eating 3 fast food meals/week vs cooking. Prep time cost: 2 hrs/week × 52 weeks × $15/hr (opportunity cost) = $1,560. Net savings: $1,000-3,600/yr." },
      { label: "Fast Food & Inflation", value: "Fast food prices rose 25-35% from 2020-2025 (vs 20% general inflation). $5 footlongs are now $8-10. Value menus shrunk from 10+ items to 3-5. The 'dollar menu' hasn't had a $1 item since 2018. Fast casual (Chipotle, Sweetgreen) grew 40% faster — customers trading up to perceived healthier options despite higher prices." },
      { label: "App-Exclusive Deals Strategy", value: "McDonald's app: 20-30% off first order, then daily BOGO deals. Taco Bell app: 'Fire' tier gets free items every 200 pts ($1 = 10 pts). Starbucks app: free drink every 12-15 purchases. Chick-fil-A app: free sandwich on birthday + random offers. Combined savings: $200-500/yr for frequent users. Downside: data collection and dopamine-driven ordering." },
      { label: "Calorie Density Comparison", value: "Fast food is 3-5× more calorie-dense than home cooking. Avg fast food meal: 2-3 cal/gram. Home-cooked: 0.8-1.5 cal/gram. A 1,200 cal fast food meal weighs ~400-500g. A 1,200 cal home-cooked meal weighs 800-1,200g. The volume difference affects satiety — people eat until volume, not calories, so fast food leads to overconsumption." },
      { label: "State-Level Fast Food Frequency", value: "Highest per capita fast food spending: AL, MS, LA, WV, OK ($1,800-2,400/yr). Lowest: MA, VT, CO, CA, HI ($800-1,200/yr). Correlation: states with higher fast food consumption have 30-50% higher obesity rates. Blue states have 20-40% more fast-casual and salad-chain options per capita vs red states." },
      { label: "Nutritional Comparison: Fast Food vs Grocery", value: "Same $10 budget: fast food = 1 meal (900-1,200 cal, 50g fat, 2,000mg sodium). Grocery = 3-4 meals (1,500-2,000 cal total, 30g fat, 800mg sodium). The grocery option has 4× more fiber, 2× more protein per dollar, and 60% less sodium. An organic grocery basket only costs 10-20% more than conventional — still 60% cheaper than fast food per meal." },
    ]}
  },
  description: 'Track the full financial and nutritional impact of your fast food habits. Breaks down weekly, monthly, annual, and 10-year costs alongside calories, sodium, and estimated weight impact.',
  formula: 'Monthly Cost = Meals/Week × Cost/Meal × People × 4.33 | Daily Cal = Meals/Week × Cal/Meal × People / 7 | Weight Impact (lbs/yr) = (Daily Cal - 2000) × 365 / 3500',
  interpretation: 'The average American eats fast food 5-6 times per month, spending $1,500-3,000/year. A single fast food meal delivers 900-1,300 calories (45-65% of daily needs), 1,500-2,300mg sodium (65-100% of the RDI), and 50-80g of sugar. Financially, the fast food premium vs home cooking is $5-10 per meal — for a family of four eating fast food twice a week, that\'s $2,000-4,000/year that could fund a vacation. Nutritionally, the daily 300-500 calorie surplus from a single fast food meal (above maintenance) translates to 30-50 lbs of weight gain over 10 years.'
}

export default calcDef
