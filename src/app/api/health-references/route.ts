import { NextResponse } from 'next/server'

const BMI_CATEGORIES = [
  { category: 'Severely underweight', min: 0, max: 16, color: 'red' },
  { category: 'Underweight', min: 16, max: 18.5, color: 'orange' },
  { category: 'Normal weight', min: 18.5, max: 25, color: 'green' },
  { category: 'Overweight', min: 25, max: 30, color: 'orange' },
  { category: 'Obese Class I', min: 30, max: 35, color: 'red' },
  { category: 'Obese Class II', min: 35, max: 40, color: 'red' },
  { category: 'Obese Class III', min: 40, max: Infinity, color: 'darkred' },
]

const CALORIE_REFERENCE = {
  sedentary: { min: 1600, max: 2200, label: 'Little or no exercise' },
  light: { min: 1800, max: 2400, label: 'Light exercise 1-3 days/week' },
  moderate: { min: 2000, max: 2700, label: 'Moderate exercise 3-5 days/week' },
  active: { min: 2400, max: 3000, label: 'Heavy exercise 6-7 days/week' },
  extra: { min: 2800, max: 3500, label: 'Very heavy exercise, physical job' },
}

const BODY_FAT_PERCENTAGES = {
  essential: { women: { min: 10, max: 13 }, men: { min: 2, max: 5 } },
  athletes: { women: { min: 14, max: 20 }, men: { min: 6, max: 13 } },
  fitness: { women: { min: 21, max: 24 }, men: { min: 14, max: 17 } },
  acceptable: { women: { min: 25, max: 31 }, men: { min: 18, max: 24 } },
  obese: { women: { min: 32, max: 100 }, men: { min: 25, max: 100 } },
}

const BMR_FORMULAS = {
  mifflinStJeor: {
    women: '10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161',
    men: '10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5',
  },
  harrisBenedict: {
    women: '655.1 + 9.563 × weight(kg) + 1.85 × height(cm) - 4.676 × age',
    men: '66.5 + 13.75 × weight(kg) + 5.003 × height(cm) - 6.755 × age',
  },
}

const WATER_INTAKE = {
  general: '8 × 8 oz glasses per day (~1.9L)',
  detailed: { men: '3.7L/day total (from all sources)', women: '2.7L/day total (from all sources)' },
}

const MACROS_REFERENCE = {
  protein: { min: 0.8, max: 2.2, unit: 'g per kg of body weight', label: 'Protein' },
  carbs: { min: 45, max: 65, unit: '% of total calories', label: 'Carbohydrates' },
  fat: { min: 20, max: 35, unit: '% of total calories', label: 'Fat' },
  fiber: { min: 25, max: 38, unit: 'g per day', label: 'Fiber' },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'

  const data: Record<string, any> = {}

  if (type === 'all' || type === 'bmi') data.bmi = BMI_CATEGORIES
  if (type === 'all' || type === 'calorie') data.calorie = CALORIE_REFERENCE
  if (type === 'all' || type === 'bodyfat') data.bodyFat = BODY_FAT_PERCENTAGES
  if (type === 'all' || type === 'bmr') data.bmr = BMR_FORMULAS
  if (type === 'all' || type === 'water') data.water = WATER_INTAKE
  if (type === 'all' || type === 'macros') data.macros = MACROS_REFERENCE

  return NextResponse.json({
    ...data,
    timestamp: new Date().toISOString(),
    source: 'CDC, WHO, NIH, and peer-reviewed medical literature',
    disclaimer: 'These are general reference ranges. Individual needs vary. Consult a healthcare professional.',
  })
}
