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
  defaults: { age: '30', gender: 'female', symptoms: 'fatigue', dietType: 'omnivore' },
  presets: [
    { label: 'Vegan Fatigue', values: { age: '28', gender: 'female', symptoms: 'fatigue', dietType: 'vegan' } },
    { label: 'Keto Muscle Cramps', values: { age: '40', gender: 'male', symptoms: 'cramps', dietType: 'keto' } },
    { label: 'Vegetarian Hair Loss', values: { age: '35', gender: 'female', symptoms: 'hairLoss', dietType: 'vegetarian' } },
    { label: 'Omnivore Poor Sleep', values: { age: '45', gender: 'male', symptoms: 'sleep', dietType: 'omnivore' } },
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
    const dietRiskMap: Record<string, string> = { omnivore: 'Low risk — balanced diet covers most minerals', vegetarian: 'Moderate risk for iron, zinc, B12', vegan: 'Higher risk for iron, zinc, calcium, iodine, B12', keto: 'Risk of magnesium, potassium, sodium depletion in first weeks', glutenFree: 'Risk of iron, zinc, magnesium, B vitamins from limited grain intake' }
    const dietRisk = dietRiskMap[v.dietType as keyof typeof dietRiskMap] || dietRiskMap.omnivore
    return { result: 0, label: 'Assessment Result', unit: '', steps: [
      { label: 'Your Symptom', value: `${v.symptoms}` },
      { label: 'Likely Deficiency', value: deficiency.mineral },
      { label: 'Why It Fits', value: `${deficiency.mineral} deficiency commonly presents with "${v.symptoms}" symptoms` },
      { label: 'Recommended Daily Intake', value: deficiency.rdi },
      { label: 'Top Food Sources', value: deficiency.topFoods },
      { label: 'Supplement Guidance', value: deficiency.supplementNote },
      { label: 'Diet Risk Assessment', value: dietRisk },
      { label: 'Next Step', value: 'Confirm with a blood test before starting supplements' },
    ] ,
    extras: [
      { label: 'Not a Diagnosis', value: 'This tool is for educational purposes only. Symptoms can have many causes. Always consult a doctor and get blood work before supplementing.' },
      { label: 'Iron Deficiency', value: 'Affects 1 in 4 women of childbearing age. Symptoms include fatigue, pale skin, cold hands/feet, brittle nails. Pair iron with vitamin C (orange juice) and avoid coffee/tea within 1 hour.' },
      { label: 'Magnesium Deficiency', value: 'Affects ~50% of Americans. Magnesium is involved in 300+ enzyme reactions. Risk factors: alcohol, stress, diabetes, GI conditions.' },
      { label: 'Zinc & Immunity', value: 'Zinc is crucial for immune function and hair growth. Vegans and vegetarians are at higher risk because plant zinc is less bioavailable (phytates block absorption).' },
      { label: 'Food First Approach', value: 'Whole foods provide minerals in their natural matrix with better absorption than supplements. Supplements should address confirmed deficiencies, not replace diet.' },
      { label: 'Supplement Quality', value: 'Look for third-party tested supplements (USP, NSF, ConsumerLab). Forms matter: magnesium glycinate for sleep, citrate for digestion, oxide is cheapest but least absorbed.' },
    ]}
  },
  description: 'Identify potential mineral deficiencies based on your symptoms, diet type, and demographic factors. Get personalized food source recommendations and supplement guidance for iron, magnesium, zinc, calcium, and potassium.',
  formula: 'Symptom → Mineral mapping: Fatigue→Iron, Cramps→Magnesium, HairLoss→Zinc, Nails→Calcium, Sleep→Magnesium, Heart→Potassium | Diet-adjusted risk factor applied per diet type',
  interpretation: 'This is a self-assessment tool, not a medical diagnosis. See a doctor for blood tests to confirm any deficiency. Common deficiencies: iron affects 1 in 4 women, magnesium affects ~1 in 2 Americans, and zinc is common among vegetarians/vegans. Food sources are strongly preferred over supplements — the body absorbs nutrients better from whole foods. When supplementing, choose high-quality, third-party tested products in bioavailable forms.'
}

export default calcDef
