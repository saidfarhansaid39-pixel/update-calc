import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gender: z.string().min(1), symptoms: z.string().min(1), dietType: z.string().min(1) }),
  fields: [
    { name: 'age', label: 'Age', type: 'number', min: 1, max: 120, step: '1' },
    { name: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
    { name: 'symptoms', label: 'Primary Symptom', type: 'select', options: [{ label: 'Fatigue/Weakness', value: 'fatigue' }, { label: 'Muscle Cramps', value: 'cramps' }, { label: 'Hair Loss', value: 'hairLoss' }, { label: 'Brittle Nails', value: 'nails' }, { label: 'Poor Sleep', value: 'sleep' }, { label: 'Irregular Heartbeat', value: 'heart' }] },
    { name: 'dietType', label: 'Diet Type', type: 'select', options: [{ label: 'Omnivore', value: 'omnivore' }, { label: 'Vegetarian', value: 'vegetarian' }, { label: 'Vegan', value: 'vegan' }, { label: 'Keto', value: 'keto' }, { label: 'Gluten-Free', value: 'glutenFree' }] },
  ],
  compute: (v) => {
    const deficiencyMap: Record<string, { mineral: string; rdi: string; topFoods: string; supplementNote: string }> = {
      fatigue: { mineral: 'Iron', rdi: v.gender === 'female' ? '18 mg' : '8 mg', topFoods: 'Red meat, spinach, lentils, fortified cereals', supplementNote: 'Take with vitamin C for absorption. Avoid with coffee/tea.' },
      cramps: { mineral: 'Magnesium', rdi: v.gender === 'female' ? '310-320 mg' : '400-420 mg', topFoods: 'Almonds, spinach, cashews, black beans', supplementNote: 'Glycinate form for sleep/cramps. Citrate for digestion.' },
      hairLoss: { mineral: 'Zinc', rdi: v.gender === 'female' ? '8 mg' : '11 mg', topFoods: 'Oysters, beef, pumpkin seeds, chickpeas', supplementNote: 'Do not exceed 40 mg/day. Take with food to avoid nausea.' },
      nails: { mineral: 'Calcium', rdi: '1,000-1,200 mg', topFoods: 'Dairy, fortified plant milk, sardines, kale', supplementNote: 'Calcium citrate for better absorption. Split doses (500mg max at once).' },
      sleep: { mineral: 'Magnesium', rdi: v.gender === 'female' ? '310-320 mg' : '400-420 mg', topFoods: 'Dark chocolate, avocado, pumpkin seeds, tofu', supplementNote: 'Take magnesium glycinate 30 min before bed for sleep support.' },
      heart: { mineral: 'Potassium', rdi: '2,600-3,400 mg', topFoods: 'Bananas, potatoes, avocados, coconut water', supplementNote: 'Food sources preferred. Supplement only under medical supervision if on BP meds.' }
}
    const deficiency = deficiencyMap[v.symptoms as keyof typeof deficiencyMap] || deficiencyMap.fatigue
    const dietRiskMap: Record<string, string> = { omnivore: 'Low risk — balanced diet covers most minerals', vegetarian: 'Moderate risk for iron, zinc, B12', vegan: 'Higher risk for iron, zinc, calcium, iodine', keto: 'Risk of magnesium, potassium, sodium depletion', glutenFree: 'Risk of iron, zinc, magnesium, B vitamins' }
    const dietRisk = dietRiskMap[v.dietType as keyof typeof dietRiskMap] || dietRiskMap.omnivore
    return { result: 0, label: 'Likely Deficiency', unit: '', steps: [{ label: 'Likely Deficiency', value: deficiency.mineral }, { label: 'Recommended Daily Intake', value: deficiency.rdi }, { label: 'Top Food Sources', value: deficiency.topFoods }, { label: 'Supplement Guidance', value: deficiency.supplementNote }, { label: 'Diet Risk Assessment', value: dietRisk }] }
  },
  description: 'Identify potential mineral deficiencies based on symptoms, diet type, and demographic factors. Provides food sources and supplement guidance.',
  formula: 'Symptom → Mineral mapping with diet-adjusted risk assessment',
  interpretation: 'Self-assessment is not a diagnosis. See a doctor for blood tests. Common deficiencies: iron (1 in 4 women), magnesium (1 in 2 Americans), vitamin D (1 in 3). Food sources are preferred over supplements.'
}

export default calcDef
