import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1).refine(v => parseFloat(v) > 48, '>48'), deskType: z.string().min(1), monitorSize: z.string().min(1).refine(v => parseFloat(v) > 10, '>10') }),
  fields: [
    { name: 'height', label: 'Your Height (in)', type: 'number', min: 48, step: '1' },
    { name: 'deskType', label: 'Desk Type', type: 'select', options: [{ label: 'Standing Desk', value: 'stand' }, { label: 'Sitting Desk', value: 'sit' }] },
    { name: 'monitorSize', label: 'Monitor Size (in diagonal)', type: 'number', min: 10, step: '1' },
  ],
  compute: (v) => {
    const deskHeight = v.deskType === 'stand' ? v.height * 0.447 : v.height * 0.246
    const seatHeight = v.height * 0.267
    const monitorTop = v.monitorSize * 0.5 + v.height * 0.214
    return { result: deskHeight, label: 'Ideal Desk Height', unit: 'in', steps: [{ label: 'Seat Height', value: `${seatHeight.toFixed(1)} in` }, { label: 'Desk Height', value: `${deskHeight.toFixed(1)} in (${v.deskType === 'stand' ? 'standing' : 'sitting'})` }, { label: 'Eyes to Monitor Top', value: `${monitorTop.toFixed(1)} in` }] }
  },
  description: 'Find your ideal desk height, chair height, and monitor position based on your height. Proper ergonomics prevent strain and improve productivity.',
  formula: 'Sitting desk = height × 0.246 | Standing desk = height × 0.447 | Seat = height × 0.267',
  interpretation: 'Elbows at 90° and wrists straight. Monitor top at or just below eye level. Feet flat on floor. Take a 5-min break every hour. Standing desks should alternate sit/stand every 30-60 min.'
}

export default calcDef
