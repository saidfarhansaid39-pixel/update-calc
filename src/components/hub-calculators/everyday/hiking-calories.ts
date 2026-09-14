import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hikerWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), packWeight: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'hikerWeight', label: 'Hiker Weight (lb)', type: 'number', min: 80, step: '5' },
    { name: 'hours', label: 'Hiking Duration (hours)', type: 'number', min: 0.5, step: '0.5' },
    { name: 'packWeight', label: 'Backpack Weight (lb)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { hikerWeight: "160", hours: "3", packWeight: "15" },
  presets: [
    { label: "Easy Nature Trail", values: { hikerWeight: "160", hours: "2", packWeight: "5" } },
    { label: "Moderate Mountain Ascent", values: { hikerWeight: "175", hours: "4", packWeight: "20" } },
    { label: "Overnight Backpacking", values: { hikerWeight: "180", hours: "6", packWeight: "35" } },
    { label: "Strenuous Ridge Hike", values: { hikerWeight: "155", hours: "8", packWeight: "15" } },
  ],
  compute: (v) => { const w = parseFloat(v.hikerWeight)||0; const h = parseFloat(v.hours)||0; const pk = parseFloat(v.packWeight)||0; const totalWeight = w + pk; const met = 6.0; const cal = met * 3.5 * (totalWeight / 2.205) / 200 * h * 60; const calPerHour = cal / h; const calPerMile = cal / (h * 2.5); const waterMl = h * 500; const snackCal = cal * 0.3; return { result: cal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Total Load (Body + Pack)', value: `${totalWeight} lb (${(totalWeight / 2.205).toFixed(1)} kg)` }, { label: 'Hiking Duration', value: `${h} hrs` }, { label: 'Calories per Hour', value: `${calPerHour.toFixed(0)} kcal/hr` }, { label: 'Est. per Mile', value: `${calPerMile.toFixed(0)} kcal/mi (at 2.5 mph)` }, { label: 'Total Calories Burned', value: `${cal.toFixed(0)} kcal` }, { label: 'Water Needed', value: `${waterMl.toFixed(0)} mL (${(waterMl / 1000).toFixed(1)} L)` }, { label: 'Snacks to Replenish', value: `${snackCal.toFixed(0)} kcal (30% of burn)` }] ,
    extras: [
      { label: "Terrain Multiplier Guide", value: "Flat/paved: MET 4.5-5.5 | Moderate hills: MET 6.0-7.5 | Steep/rocky: MET 8.0-10.0 | Scrambling: MET 10-12" },
      { label: "Elevation Gain Impact", value: "Every 1,000 ft of elevation gain per mile adds ~500 kcal/hr. Use a GPS watch for accurate ascent data." },
      { label: "Fueling Strategy", value: "Eat 30-60 g carbs per hour for hikes over 2 hrs. Trail mix, granola bars, and dried fruit are ideal packable options." },
      { label: "Hydration Schedule", value: "Drink 500-750 mL per hour in mild weather, up to 1 L/hr in heat. Sip steadily — don't wait until thirsty." },
      { label: "Weather Adjustment", value: "Cold weather +20% calories (shivering burns energy). Hot weather +15% (sweating and cardiovascular load)." },
      { label: "Calorie Deficit Caution", value: "Burning 3,000+ kcal on a long day hike requires intentional refueling. Bonking (hypoglycemia) is a real risk." },
      { label: "Packing Weight Trade-Offs", value: "Every 5 lb of pack weight adds ~60-80 kcal/hr. Ultralight backpacking (10-15 lb base) saves significant energy over traditional (30-40 lb)." },
      { label: "Post-Hike Recovery", value: "Eat a 3:1 carb-to-protein meal within 30-60 min post-hike for optimal muscle glycogen replenishment." },
    ]} },
  description: 'Calculate calories burned while hiking based on body weight, pack weight, duration, and terrain intensity. Get fueling and hydration recommendations for any hike length.',
  formula: 'Calories = MET (6.0) × 3.5 × Weight_kg ÷ 200 × Minutes | For moderate hiking. Terrain adjusts MET up to 10+ for steep/rocky.',
  interpretation: 'A 160 lb hiker carrying a 15 lb daypack on moderate terrain burns approximately 400-500 kcal per hour, or about 170-200 kcal per mile at 2.5 mph. Steep terrain can increase burn by 30-50%. For hikes over 2 hours, carry at least 1 L of water for every 2 hours and 200-300 kcal of snacks per hour. The biggest variable is your pack weight — every 5 pounds adds roughly 60-80 kcal/hour. If you are thru-hiking or backpacking multiple days, your daily caloric need can exceed 4,000-6,000 kcal.'
}

export default calcDef
