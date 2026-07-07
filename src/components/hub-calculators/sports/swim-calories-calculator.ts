import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 0, 'Must be > 0'), duration: z.string().min(1).refine(v => parseFloat(v) > 0, 'Must be > 0'), stroke: z.string() }),
  fields: [
    { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', min: 20, step: '0.1' },
    { name: 'duration', label: 'Duration', type: 'number', unit: 'min', min: 1, step: '1' },
    { name: 'stroke', label: 'Stroke Type', type: 'select', options: [
      { label: 'Freestyle (6 MET)', value: '6' },
      { label: 'Backstroke (5 MET)', value: '5' },
      { label: 'Breaststroke (7 MET)', value: '7' },
      { label: 'Butterfly (9 MET)', value: '9' },
      { label: 'Treading water (3 MET)', value: '3' },
    ] },
  ],
  compute: (v) => {
    const met = v.stroke
    const kcal = v.weight * met * (v.duration / 60)
    return {
      result: kcal, label: 'Calories Burned Swimming', unit: 'kcal',
      steps: [
        { label: 'Body weight', value: `${v.weight} kg` },
        { label: 'Stroke type', value: `${met} METs` },
        { label: 'Duration', value: `${v.duration} min` },
        { label: 'Calories burned', value: `${kcal.toFixed(0)} kcal` },
        { label: 'Note', value: 'Swimming burns more calories than running at the same effort due to higher energy cost of water resistance' },
      ]
}
  },
  description: 'Calculate calories burned during swimming by stroke type. Butterfly burns the most calories (~9 METs), while treading water burns the least (~3 METs).'
}

export default calcDef
