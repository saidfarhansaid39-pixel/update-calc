import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ steps: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), strideLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), strideUnit: z.string().min(1) }),
  fields: [
    { name: 'steps', label: 'Number of Steps', type: 'number', min: 1, step: '100' },
    { name: 'strideLength', label: 'Stride Length', type: 'number', min: 0.5, step: '0.1' },
    { name: 'strideUnit', label: 'Stride Unit', type: 'select', options: [{ label: 'Feet', value: 'ft' }, { label: 'Meters', value: 'm' }] },
  ],
  defaults: { steps: '10000', strideLength: '2.5', strideUnit: 'ft' },
  presets: [
    { label: 'Average Walker', values: { steps: '10000', strideLength: '2.5', strideUnit: 'ft' } },
    { label: 'Tall Walker (6ft+)', values: { steps: '10000', strideLength: '2.8', strideUnit: 'ft' } },
    { label: 'Petite Walker', values: { steps: '10000', strideLength: '0.65', strideUnit: 'm' } },
    { label: 'Power Walk', values: { steps: '8000', strideLength: '3', strideUnit: 'ft' } },
  ],
  compute: (v) => {
    const strideFt = v.strideUnit === 'm' ? v.strideLength * 3.28084 : v.strideLength
    const distanceFt = v.steps * strideFt
    const miles = distanceFt / 5280
    const km = distanceFt / 3280.84
    const calories = v.steps * 0.04
    return { result: miles, label: 'Distance Walked', unit: 'mi', steps: [{ label: 'Total Steps', value: `${v.steps}` }, { label: 'Distance (mi)', value: `${miles.toFixed(2)} mi` }, { label: 'Distance (km)', value: `${km.toFixed(2)} km` }, { label: 'Estimated Calories', value: `${calories.toFixed(0)} kcal` }] ,
    extras: [
      { label: 'Calorie Estimate Basis', value: '~0.04 kcal/step for an average person. At 10,000 steps = 400 kcal. Varies by weight: a 68 kg person burns ~0.03 kcal/step, an 82 kg person burns ~0.05 kcal/step' },
      { label: 'Measuring Your Stride', value: 'Walk 10 steps, measure distance from heel of first step to toe of last step, divide by 10. Water on pavement method: wet feet, measure spacing' },
      { label: 'Stride Adjustments', value: 'Walking: height × 0.415. Running: height × 0.45-0.50 (longer stride at speed). Fitness walking: height × 0.44. Adjust stride in this calculator' },
      { label: 'Device Accuracy', value: 'Phone pedometers are ~5-10% less accurate than dedicated fitness trackers. Wrist-based trackers overcount by 5-15% in daily use' },
      { label: 'Gait Changes With Age', value: 'Stride length decreases ~0.5% per year after age 40 due to reduced hip flexibility and muscle strength. Re-measure stride annually' },
      { label: 'Surface Impact', value: 'Walking on grass or sand shortens stride by 5-15% vs pavement. Treadmill walking at 0% incline slightly shortens stride vs outdoor' },
      { label: 'Health Activity Targets', value: 'Children (6-17): 12,000-16,000 steps/day recommended. Adults (18-64): 7,500-10,000. Adults (65+): 6,000-8,000 for optimal health' },
    ]}
  },
  description: 'Convert steps to distance in miles and kilometers using your personal stride length. Includes estimated calorie burn based on step count.',
  formula: 'Miles = Steps × Stride(ft) ÷ 5,280. Kilometers = Steps × Stride(m) ÷ 1,000 or Miles × 1.60934. Calories ~ Steps × 0.04. Converts stride between ft and m: 1m = 3.28084 ft.',
  interpretation: 'Average stride length: 2.2-2.5 ft (0.67-0.76 m) for women, 2.5-2.8 ft (0.76-0.85 m) for men. For most accurate results, measure your actual stride length rather than using height estimation. At 10,000 steps with a 2.5 ft stride, you walk 4.73 miles (7.6 km). The FDA-cleared step counters in modern phones are surprisingly accurate — within 5% of research-grade devices. For weight management, 10,000 steps/day typically burns 350-500 kcal above resting expenditure.'
}

export default calcDef
