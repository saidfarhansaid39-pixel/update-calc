import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bodyWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), activeMinutes: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'bodyWeight', label: 'Body Weight (lb)', type: 'number', min: 50, step: '5' },
    { name: 'activeMinutes', label: 'Daily Exercise (minutes)', type: 'number', min: 0, step: '15' },
  ],
  defaults: { bodyWeight: "160", activeMinutes: "30" },
  presets: [
    { label: "Sedentary Office Worker", values: { bodyWeight: "180", activeMinutes: "15" } },
    { label: "Active Athlete", values: { bodyWeight: "175", activeMinutes: "90" } },
    { label: "Hot Climate Worker", values: { bodyWeight: "160", activeMinutes: "60" } },
    { label: "Petite/Sedentary", values: { bodyWeight: "120", activeMinutes: "0" } },
  ],
  compute: (v) => { const bw = parseFloat(v.bodyWeight)||0; const am = parseFloat(v.activeMinutes)||0; const baseOz = bw * 0.5; const activityOz = (am / 15) * 4; const totalOz = baseOz + activityOz; const totalLiters = totalOz / 33.814; const cups = totalOz / 8; const bottles = totalOz / 16.9; const hourlySiP = 16 / 16; const bathroomTrips = Math.round(totalOz / 12); return { result: totalOz, label: 'Daily Water Goal', unit: 'oz', steps: [{ label: 'Base (body weight × 0.5)', value: `${baseOz.toFixed(0)} oz` }, { label: 'Exercise Supplement', value: `+${activityOz.toFixed(0)} oz (${am} min activity)` }, { label: 'Total Daily Goal', value: `${totalOz.toFixed(0)} oz` }, { label: 'In Liters', value: `${totalLiters.toFixed(1)} L` }, { label: 'In Cups (8 oz)', value: `${cups.toFixed(0)} cups` }, { label: 'In Water Bottles (16.9 oz)', value: `${bottles.toFixed(1)} bottles` }, { label: 'Suggested Sipping Pace', value: `~${hourlySiP.toFixed(0)} oz per hour over 16 waking hours` }] ,
    extras: [
      { label: "The Half-Body-Weight Rule", value: "Drink half your body weight (lb) in ounces as a baseline. A 160 lb person needs 80 oz (2.4 L) base. This covers normal metabolic, respiratory, and urinary losses." },
      { label: "Exercise Hydration Formula", value: "Add 12-16 oz for every 30 minutes of moderate exercise. For intense workouts or heavy sweating, weigh yourself before and after — each pound lost ≈ 16 oz of fluid to replenish." },
      { label: "Climate Adjustments", value: "Hot/humid weather: increase by 20-30% (sweat rate doubles at 90°F vs 70°F). High altitude (>8,000 ft): increase by 15-20% (faster respiration loses more water). Winter: dry air increases insensible losses." },
      { label: "Hydration Beyond Water", value: "20-30% of daily fluid comes from food (fruits, vegetables, soups). Coffee and tea count toward hydration (caffeine is a mild diuretic, but net effect is hydrating). Alcohol dehydrates — drink 1:1 water per alcoholic drink." },
      { label: "Dehydration Warning Signs", value: "Thirst (already 1-2% dehydrated), dark urine, headache, fatigue, dizziness, dry mouth, reduced urination. At 3-4% loss: impaired physical performance. At 5%+ : heat exhaustion risk." },
      { label: "Overhydration Risk", value: "Drinking too much water without electrolytes can cause hyponatremia (low blood sodium). Especially during endurance events (marathons, ultra runs). Symptoms: nausea, confusion, seizures. Sip to thirst during exercise." },
      { label: "Electrolyte Replacement", value: "For workouts over 60 minutes, replace sodium (500-700 mg/L sweat), potassium, and magnesium. Sports drinks help, but diluted (1:1 with water). Coconut water is natural but low sodium. Salt tablets for heavy sweaters." },
      { label: "Optimal Drinking Habits", value: "Drink steadily throughout the day rather than gulping large amounts. Your kidneys can process ~27-34 oz per hour maximum. Morning: 12-16 oz on waking (you lose water overnight). Pre-meal: 8 oz aids digestion." },
    ]} },
  description: 'Calculate your personalized daily water intake based on body weight and exercise. See your goal in ounces, liters, cups, and bottles with climate adjustment guidance.',
  formula: 'Daily Water (oz) = Body Weight (lb) × 0.5 + (Exercise Minutes ÷ 15 × 4) | ~20-30% additional in hot/humid conditions',
  interpretation: 'The rule of drinking half your body weight in ounces is a solid baseline for most people. A 160 lb sedentary person needs about 80 oz (2.4 L, 10 cups) daily. Adding 30 minutes of exercise brings this to 88 oz (2.6 L). In hot weather or at high altitude, increase by 20-30%. You get about 20-30% of your fluid from food, so total water intake from drinks should be roughly 70-80% of these targets. The best hydration indicator is urine color: pale yellow means well-hydrated; dark amber means drink more. Clear/colorless means you may be over-hydrating.'
}

export default calcDef
