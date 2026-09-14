import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wiWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wiWeightUnit: z.string().min(1), wiActivityMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wiClimate: z.string().min(1) }),
  fields: [
    { name: 'wiWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'wiWeightUnit', label: 'Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'wiActivityMin', label: 'Daily Exercise (min)', type: 'number', min: 0, step: '10' },
    { name: 'wiClimate', label: 'Climate', type: 'select', options: [{ label: 'Cool/Mild', value: 'cool' }, { label: 'Warm/Hot', value: 'hot' }, { label: 'Very Hot/Humid', value: 'humid' }] },
  ],
  defaults: { wiWeight: '70', wiWeightUnit: 'kg', wiActivityMin: '30', wiClimate: 'cool' },
  presets: [
    { label: 'Sedentary Office Worker', values: { wiWeight: '75', wiWeightUnit: 'kg', wiActivityMin: '10', wiClimate: 'cool' } },
    { label: 'Active Athlete', values: { wiWeight: '70', wiWeightUnit: 'kg', wiActivityMin: '90', wiClimate: 'hot' } },
    { label: 'Outdoor Worker Summer', values: { wiWeight: '85', wiWeightUnit: 'kg', wiActivityMin: '60', wiClimate: 'humid' } },
  ],
  compute: (v) => {
    const weightKg = v.wiWeightUnit === 'lb' ? v.wiWeight * 0.453592 : v.wiWeight
    const weightOz = weightKg * 35.274
    const baseOz = weightOz * 0.5 / 35.274 * 1000
    const baseMl = weightKg * 30
    const activityMl = v.wiActivityMin * 12
    const climateFactors: Record<string, number> = { cool: 1, hot: 1.2, humid: 1.4 }
    const climateFactor = climateFactors[v.wiClimate] || 1
    const totalMl = (baseMl + activityMl) * climateFactor
    const totalOz = totalMl / 29.5735
    const totalCups = totalMl / 240
    const totalLiters = totalMl / 1000
    return { result: totalMl, label: 'Daily Water Intake', unit: 'mL', steps: [{ label: 'Body Weight in kg', value: `${weightKg.toFixed(0)} kg` }, { label: 'Base Water Need', value: `${weightKg.toFixed(0)} × 30 mL = ${baseMl.toFixed(0)} mL` }, { label: 'Exercise Adjustment', value: `${v.wiActivityMin} min × 12 mL/min = +${activityMl.toFixed(0)} mL` }, { label: 'Subtotal Before Climate', value: `${baseMl.toFixed(0)} + ${activityMl.toFixed(0)} = ${(baseMl + activityMl).toFixed(0)} mL` }, { label: `Climate Multiplier (${v.wiClimate}: ${climateFactor}x)`, value: `${(baseMl + activityMl).toFixed(0)} × ${climateFactor} = ${totalMl.toFixed(0)} mL` }, { label: 'In Fluid Ounces', value: `${totalOz.toFixed(0)} oz` }, { label: 'In Standard Cups', value: `${totalCups.toFixed(1)} cups (8 oz)` }, { label: 'In Liters', value: `${totalLiters.toFixed(2)} L` }] ,
    extras: [
      { label: 'General Hydration Guidelines', value: 'Institute of Medicine: men 3.7 L/day (15.5 cups), women 2.7 L/day (11.5 cups) from all beverages + food. The 8×8 rule (eight 8 oz glasses) is a simplified myth — individual needs vary by weight, activity, and climate.' },
      { label: 'Hydration & Performance', value: 'Even 1-2% body weight dehydration reduces cognitive function, physical endurance, and mood. At 3%: significant performance decline. At 5%: heat exhaustion risk. Drink water steadily throughout the day — don\'t rely on thirst alone.' },
      { label: 'Urine Color Test', value: 'Use urine color for real-time hydration assessment: Pale yellow = hydrated. Dark yellow/amber = dehydrated. Clear = possibly overhydrated. Red/brown = see a doctor. Check your first morning urine for the most consistent reading.' },
      { label: 'Electrolyte Balance', value: 'During intense exercise (>60 min) or heavy sweating, replace electrolytes (sodium, potassium, magnesium). Sports drinks (8-10 g carbs, 100-200 mg sodium per 8 oz) are helpful for prolonged activity. For daily use, water is sufficient.' },
      { label: 'Food Water Content', value: 'Food provides ~20% of daily water intake. High-water foods: cucumber (96%), watermelon (92%), strawberries (91%), lettuce (96%), broth-based soups. A diet rich in fruits and vegetables contributes 20-30 oz of water daily.' },
      { label: 'Caffeine & Alcohol Effects', value: 'Caffeine is a mild diuretic but doesn\'t significantly dehydrate at moderate intake (<400 mg/day). Alcohol suppresses ADH (antidiuretic hormone), increasing water loss — drink 1 glass of water per alcoholic drink to offset.' },
      { label: 'Special Populations', value: 'Pregnant women: +300 mL/day. Breastfeeding: +700-1,000 mL/day. Older adults: thirst sensation diminishes — schedule regular drinks. Children: 1-1.5 L/day (ages 4-8), 1.5-2 L/day (ages 9-13). Athletes: weigh before/after exercise — drink 16-24 oz per lb lost.' },
    ]}
  },
  description: 'Calculate your daily water intake needs based on body weight, exercise duration, and climate conditions. Uses the Institute of Medicine guidelines with activity and climate adjustments for personalized hydration targets.',
  formula: 'DailyWater(mL) = (Weight(kg) × 30 mL/kg + Exercise(min) × 12 mL/min) × ClimateFactor. Climate factors: Cool/Mild 1.0×, Warm/Hot 1.2×, Very Hot/Humid 1.4×. Base intake of 30 mL per kg of body weight is the minimum for healthy adults.',
  interpretation: 'A 70 kg person with 30 min of daily exercise in a cool climate needs: (70 × 30 + 30 × 12) × 1.0 = (2,100 + 360) = 2,460 mL/day ≈ 2.46 L ≈ 83 oz ≈ 10.4 cups. Same person in a humid climate: 2,460 × 1.4 = 3,444 mL ≈ 3.4 L. The total aligns well with the IOM recommendation of 3.7 L for men (which includes ~20% from food). Adequate hydration improves energy levels, skin health, kidney function, and cognitive performance. Drink water with meals, before/during/after exercise, and whenever you feel thirsty.'
}

export default calcDef
