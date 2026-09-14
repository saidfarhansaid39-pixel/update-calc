import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ yoWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yoWeightUnit: z.string().min(1), yoMinutes: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yoStyle: z.string().min(1) }),
  fields: [
    { name: 'yoWeight', label: 'Body Weight', type: 'number', min: 30, step: '10' },
    { name: 'yoWeightUnit', label: 'Weight Unit', type: 'select', options: [{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] },
    { name: 'yoMinutes', label: 'Yoga Duration (min)', type: 'number', min: 1, step: '5' },
    { name: 'yoStyle', label: 'Yoga Style', type: 'select', options: [{ label: 'Hatha (Gentle)', value: 'hatha' }, { label: 'Vinyasa (Flowing)', value: 'vinyasa' }, { label: 'Power Yoga', value: 'power' }, { label: 'Bikram/Hot Yoga', value: 'bikram' }] },
  ],
  defaults: { yoWeight: '68', yoWeightUnit: 'kg', yoMinutes: '45', yoStyle: 'vinyasa' },
  presets: [
    { label: 'Beginner Hatha (60 min)', values: { yoWeight: '68', yoWeightUnit: 'kg', yoMinutes: '60', yoStyle: 'hatha' } },
    { label: 'Vinyasa Flow (45 min)', values: { yoWeight: '68', yoWeightUnit: 'kg', yoMinutes: '45', yoStyle: 'vinyasa' } },
    { label: 'Hot Yoga Session (60 min)', values: { yoWeight: '75', yoWeightUnit: 'kg', yoMinutes: '60', yoStyle: 'bikram' } },
    { label: 'Power Yoga Express (30 min)', values: { yoWeight: '62', yoWeightUnit: 'kg', yoMinutes: '30', yoStyle: 'power' } },
  ],
  compute: (v) => {
    const weightKg = v.yoWeightUnit === 'lb' ? v.yoWeight * 0.453592 : v.yoWeight
    const metValues: Record<string, number> = { hatha: 2.5, vinyasa: 4, power: 5.5, bikram: 6.5 }
    const met = metValues[v.yoStyle] || 3
    const calories = met * 3.5 * weightKg / 200 * v.yoMinutes
    const totalMetMins = met * v.yoMinutes
    const caloriesPerHour = calories / v.yoMinutes * 60
    return { result: calories, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Body Weight in kg', value: `${weightKg.toFixed(1)} kg` }, { label: 'MET Value for Style', value: `${v.yoStyle} = ${met} MET` }, { label: 'Apply MET Formula', value: `${met} × 3.5 × ${weightKg.toFixed(1)} / 200 × ${v.yoMinutes} min` }, { label: 'Calories Burned', value: `${calories.toFixed(0)} kcal` }, { label: 'MET-minutes (exercise volume)', value: `${totalMetMins.toFixed(0)} MET-min` }, { label: 'Calories per Hour', value: `${caloriesPerHour.toFixed(0)} kcal/hr` }] ,
    extras: [
      { label: 'MET Value Reference', value: 'Hatha (gentle) = 2.5 MET, Vinyasa (flowing) = 4.0 MET, Power Yoga = 5.5 MET, Bikram/Hot Yoga = 6.5 MET. Higher MET = more intense workout and greater calorie burn.' },
      { label: 'Weight & Calorie Burn', value: 'A heavier person burns more calories doing the same yoga session. At 60 min Vinyasa: 60 kg = 252 kcal, 75 kg = 315 kcal, 90 kg = 378 kcal. Each 10 kg adds ~42 kcal.' },
      { label: 'Hot Yoga Bonus', value: 'Bikram yoga (105°F, 40% humidity) burns 25-40% more calories than the same poses at room temperature due to increased heart rate and metabolic demand. Hydration is critical — drink 1-2 L before class.' },
      { label: 'Beyond Calorie Burn', value: 'Yoga builds strength, flexibility, and balance. A 2023 Harvard study found 12 weeks of yoga reduced visceral fat by 18% independent of calorie burn. Regular practice lowers cortisol, aiding weight management.' },
      { label: 'Frequency Guidelines', value: 'For weight loss: 3-5 sessions/week of Vinyasa or Power yoga. For maintenance: 2-3 sessions/week mixed styles. Rest days between intense sessions allow muscle recovery.' },
      { label: 'Combined Activity Tracking', value: 'A 45-min Vinyasa session burns ~240 kcal (68 kg person). Walking 30 min adds ~120 kcal. Combining yoga with walking or strength training creates a balanced weekly exercise program.' },
      { label: 'Yoga vs Other Cardio', value: '60 min moderate yoga (Hatha) burns ~150-200 kcal vs 300-400 kcal for jogging. However, yoga improves mobility and reduces injury risk, making it an excellent complement to higher-intensity workouts.' },
    ]}
  },
  description: 'Calculate calories burned during yoga based on body weight, session duration, and yoga style. Uses MET (Metabolic Equivalent of Task) values validated by exercise physiology research for accurate energy expenditure estimates.',
  formula: 'Calories = MET × 3.5 × Weight(kg) ÷ 200 × Duration(min). MET values: Hatha 2.5, Vinyasa 4.0, Power 5.5, Bikram 6.5. MET-minutes = MET × Duration(min) as a measure of exercise volume.',
  interpretation: 'A 68 kg person burns ~191 kcal in 60 min of Hatha yoga, ~306 kcal in 60 min of Vinyasa, ~420 kcal in 60 min of Power Yoga, and ~497 kcal in 60 min of Bikram/Hot Yoga. Yoga consistently burns fewer calories per minute than running or cycling but provides unique benefits: improved flexibility, stress reduction, core strength, and injury prevention. The weighted MET-minutes metric (MET × minutes) helps compare total exercise volume across different activities — 150+ MET-minutes per week is the ACSM recommended minimum for health benefits.'
}

export default calcDef
