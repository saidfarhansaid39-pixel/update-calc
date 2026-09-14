import { z } from 'zod'

export const paceSchema = z.object({
  distance: z.number().min(0.1),
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
})

export const paceSchemaDistOnly = z.object({
  distance: z.number().min(0.1),
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
})

export const caloriesSchema = z.object({
  weight: z.number().min(20),
  met: z.number().min(1),
  duration: z.number().min(1),
})

export const caloriesDistanceSchema = z.object({
  weight: z.number().min(20),
  distance: z.number().min(0.1),
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
})

export const heartRateSchema = z.object({
  age: z.number().min(10).max(120),
  restingHr: z.number().min(30).max(120),
  maxHr: z.number().min(100).max(250).optional(),
})

export const targetHrSchema = z.object({
  age: z.number().min(10).max(120),
  restingHr: z.number().min(30).max(120),
  intensity: z.number().min(0.3).max(1.0),
})

export const recoveryHrSchema = z.object({
  heartRate: z.number().min(30).max(250),
  recoveryMinutes: z.number().min(0).max(10),
})

export const oneRmSchema = z.object({
  weight: z.number().min(1),
  reps: z.number().min(1).max(30),
})

export const wilksSchema = z.object({
  bodyWeight: z.number().min(20).max(300),
  totalLifted: z.number().min(10),
  gender: z.enum(['male', 'female']),
})

export const vo2maxSchema = z.object({
  distance: z.number().min(100).max(5000),
  age: z.number().min(10).max(120),
  gender: z.enum(['male', 'female']),
  heartRate: z.number().min(30).max(250).optional(),
})

export const cyclingSchema = z.object({
  power: z.number().min(10).max(2000),
  weight: z.number().min(20).max(300),
  duration: z.number().min(1),
})

export const cyclingPowerSchema = z.object({
  speed: z.number().min(1).max(100),
  weight: z.number().min(20).max(300),
  gradient: z.number().min(-30).max(30),
})

export const cadenceSchema = z.object({
  steps: z.number().min(1),
  minutes: z.number().min(0.1).max(60),
})

export const swimPaceSchema = z.object({
  distance: z.number().min(25).max(5000),
  hours: z.number().min(0),
  minutes: z.number().min(0).max(59),
  seconds: z.number().min(0).max(59),
})

export const swimStrokeSchema = z.object({
  distance: z.number().min(25).max(5000),
  strokes: z.number().min(1),
  timeSeconds: z.number().min(1).max(3600),
})

export const pushupSchema = z.object({
  pushups: z.number().min(0).max(100),
  age: z.number().min(10).max(120),
  gender: z.enum(['male', 'female']),
})

export const cooperSchema = z.object({
  distance: z.number().min(100).max(5000),
  age: z.number().min(10).max(120),
  gender: z.enum(['male', 'female']),
})

export const beepSchema = z.object({
  level: z.number().min(1).max(23),
  shuttle: z.number().min(0).max(20),
  age: z.number().min(10).max(120).optional(),
  gender: z.enum(['male', 'female']).optional(),
})

export const jumpSchema = z.object({
  height: z.number().min(1).max(150),
  weight: z.number().min(20).max(300).optional(),
})

export const sprintSchema = z.object({
  distance: z.number().min(10).max(400),
  time: z.number().min(1).max(60),
})

export const agilitySchema = z.object({
  time: z.number().min(1).max(30),
  distance: z.number().min(1).max(50),
})

export const tdeeSchema = z.object({
  age: z.number().min(10).max(120),
  weight: z.number().min(20).max(300),
  height: z.number().min(50).max(300),
  gender: z.enum(['male', 'female']),
  activityLevel: z.number().min(1.2).max(2.5),
})

export const fitnessAgeSchema = z.object({
  age: z.number().min(10).max(120),
  restingHr: z.number().min(30).max(120),
  bodyFat: z.number().min(3).max(60).optional(),
  activityLevel: z.number().min(1).max(5),
})

export const bodyFatSchema = z.object({
  weight: z.number().min(20).max(300),
  height: z.number().min(50).max(300),
  waist: z.number().min(40).max(200),
  neck: z.number().min(20).max(100),
  hip: z.number().min(40).max(200).optional(),
  gender: z.enum(['male', 'female']),
})

export const metActivityOptions = [
  { value: '1.0', label: 'Resting / Sleeping' },
  { value: '1.5', label: 'Sitting / Desk Work' },
  { value: '2.0', label: 'Light walking (3 km/h)' },
  { value: '3.0', label: 'Walking (5 km/h)' },
  { value: '3.5', label: 'Brisk walking (6 km/h)' },
  { value: '4.0', label: 'Light cycling (10-12 km/h)' },
  { value: '5.0', label: 'Moderate cycling (12-16 km/h)' },
  { value: '6.0', label: 'Jogging (8 km/h)' },
  { value: '7.0', label: 'Running (8-10 km/h)' },
  { value: '8.0', label: 'Running (10 km/h)' },
  { value: '9.0', label: 'Running (10-12 km/h)' },
  { value: '10.0', label: 'Running (12-14 km/h)' },
  { value: '11.0', label: 'Running (14-16 km/h)' },
  { value: '12.0', label: 'Running (>16 km/h)' },
  { value: '4.5', label: 'Swimming (leisure)' },
  { value: '6.0', label: 'Swimming (moderate)' },
  { value: '8.0', label: 'Swimming (vigorous)' },
  { value: '4.0', label: 'Yoga / Stretching' },
  { value: '5.5', label: 'Strength training (moderate)' },
  { value: '6.0', label: 'Strength training (vigorous)' },
  { value: '4.5', label: 'Golf (walking)' },
  { value: '5.0', label: 'Dancing (social)' },
  { value: '6.5', label: 'Dancing (vigorous)' },
  { value: '3.0', label: 'Housework' },
  { value: '2.5', label: 'Cooking / Food prep' },
  { value: '3.5', label: 'Gardening (light)' },
  { value: '5.0', label: 'Gardening (moderate)' },
  { value: '6.0', label: 'Shoveling snow' },
]

export const hiitMetOptions = [
  { value: '6.0', label: 'Low intensity (rest)' },
  { value: '8.0', label: 'Moderate intensity' },
  { value: '10.0', label: 'High intensity' },
  { value: '12.0', label: 'Very high intensity' },
  { value: '14.0', label: 'Maximum effort' },
]

export const walkMetOptions = [
  { value: '2.0', label: 'Slow (3 km/h)' },
  { value: '2.5', label: 'Moderate (4 km/h)' },
  { value: '3.0', label: 'Brisk (5 km/h)' },
  { value: '3.5', label: 'Fast (6 km/h)' },
  { value: '4.0', label: 'Very fast (7 km/h)' },
  { value: '4.5', label: 'Race walking (8 km/h)' },
]

export const runMetOptions = [
  { value: '6.0', label: 'Jogging (6-7 km/h)' },
  { value: '7.0', label: 'Light run (8 km/h)' },
  { value: '8.0', label: 'Moderate run (9 km/h)' },
  { value: '9.0', label: 'Run (10 km/h)' },
  { value: '10.0', label: 'Fast run (11-12 km/h)' },
  { value: '11.0', label: 'Fast run (13-14 km/h)' },
  { value: '12.0', label: 'Very fast (15-16 km/h)' },
  { value: '13.0', label: 'Sprint (>16 km/h)' },
]

export const intensityOptions = [
  { value: '0.5', label: 'Very light (50%)' },
  { value: '0.6', label: 'Light (60%)' },
  { value: '0.7', label: 'Moderate (70%)' },
  { value: '0.8', label: 'Vigorous (80%)' },
  { value: '0.85', label: 'Hard (85%)' },
  { value: '0.9', label: 'Very hard (90%)' },
  { value: '0.95', label: 'Maximum (95%)' },
]

export const activityLevelOptions = [
  { value: '1.2', label: 'Sedentary (little/no exercise)' },
  { value: '1.375', label: 'Lightly active (1-3 days/week)' },
  { value: '1.55', label: 'Moderately active (3-5 days/week)' },
  { value: '1.725', label: 'Very active (6-7 days/week)' },
  { value: '1.9', label: 'Extremely active (athlete/physical job)' },
]
