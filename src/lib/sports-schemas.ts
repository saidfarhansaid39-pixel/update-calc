import { z } from 'zod'

export const paceSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  seconds: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

export const paceSchemaDistOnly = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

export const caloriesSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  duration: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  met: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const caloriesDistanceSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  met: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const heartRateSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  restingHR: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

export const targetHrSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  restingHR: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
  intensity: z.string().optional().refine(v => !v || (parseFloat(v) >= 50 && parseFloat(v) <= 100), '50-100%'),
})

export const recoveryHrSchema = z.object({
  postHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  oneMinHR: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const oneRmSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  reps: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 30 }, '1-30'),
})

export const wilksSchema = z.object({
  bodyweight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  total: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string(),
})

export const vo2maxSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

export const cyclingSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  weight: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

export const cyclingPowerSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  power: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const cadenceSchema = z.object({
  rpm: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 200 }, '1-200'),
  chainring: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
  cog: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
  wheel: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 }, 'Must be > 0'),
})

export const swimPaceSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  hours: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  minutes: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
  seconds: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 0 && n <= 59 }, '0-59'),
})

export const swimStrokeSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  strokes: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const pushupSchema = z.object({
  count: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, 'Must be >= 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

export const cooperSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().optional().refine(v => !v || (parseFloat(v) >= 1 && parseFloat(v) <= 120), '1-120'),
  gender: z.string().optional(),
})

export const beepSchema = z.object({
  level: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 25 }, '1-25'),
  shuttle: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n > 0 && n <= 20 }, '1-20'),
})

export const jumpSchema = z.object({
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string().optional(),
})

export const sprintSchema = z.object({
  distance: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const agilitySchema = z.object({
  time: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string().optional(),
})

export const tdeeSchema = z.object({
  weight: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  gender: z.string(),
  activity: z.string(),
})

export const fitnessAgeSchema = z.object({
  age: z.string().min(1, 'Required').refine(v => { const n = parseFloat(v); return n >= 1 && n <= 120 }, '1-120'),
  vo2max: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
})

export const bodyFatSchema = z.object({
  neck: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  waist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  height: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
  gender: z.string(),
  hip: z.string().optional().refine(v => !v || parseFloat(v) > 0, 'Must be > 0'),
})

export const metActivityOptions = [
  { label: 'Resting (1.0)', value: '1' },
  { label: 'Walking slow (2.5)', value: '2.5' },
  { label: 'Walking brisk (3.5)', value: '3.5' },
  { label: 'Cycling leisure (5.0)', value: '5' },
  { label: 'Swimming (6.0)', value: '6' },
  { label: 'Running 10 km/h (10.0)', value: '10' },
  { label: 'HIIT (8.0)', value: '8' },
  { label: 'Weight lifting (4.0)', value: '4' },
  { label: 'Rowing (7.0)', value: '7' },
  { label: 'Jump rope (10.0)', value: '10' },
]

export const hiitMetOptions = [
  { label: 'HIIT - Low intensity (5.0 MET)', value: '5' },
  { label: 'HIIT - Moderate (8.0 MET)', value: '8' },
  { label: 'HIIT - Vigorous (10.5 MET)', value: '10.5' },
  { label: 'HIIT - Extreme (14.0 MET)', value: '14' },
]

export const walkMetOptions = [
  { label: 'Walking slow (2.0 MET)', value: '2' },
  { label: 'Walking moderate (3.0 MET)', value: '3' },
  { label: 'Walking brisk (3.5 MET)', value: '3.5' },
  { label: 'Walking very brisk (4.3 MET)', value: '4.3' },
  { label: 'Nordic walking (5.0 MET)', value: '5' },
]

export const runMetOptions = [
  { label: 'Running 8 km/h (8.0 MET)', value: '8' },
  { label: 'Running 10 km/h (10.0 MET)', value: '10' },
  { label: 'Running 12 km/h (12.5 MET)', value: '12.5' },
  { label: 'Running 14 km/h (14.0 MET)', value: '14' },
  { label: 'Running 16 km/h (16.0 MET)', value: '16' },
]

export const intensityOptions = [
  { label: '50% (very light)', value: '50' },
  { label: '60% (light)', value: '60' },
  { label: '70% (moderate)', value: '70' },
  { label: '80% (vigorous)', value: '80' },
  { label: '85% (very vigorous)', value: '85' },
  { label: '90% (near max)', value: '90' },
]

export const activityLevelOptions = [
  { label: 'Sedentary (1.2)', value: '1.2' },
  { label: 'Light (1.375)', value: '1.375' },
  { label: 'Moderate (1.55)', value: '1.55' },
  { label: 'Very Active (1.725)', value: '1.725' },
  { label: 'Extra Active (1.9)', value: '1.9' },
]
