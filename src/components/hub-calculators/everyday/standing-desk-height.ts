import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heightInches: z.string().min(1).refine(v => parseFloat(v) > 48, '>48'), deskMode: z.string().min(1) }),
  fields: [
    { name: 'heightInches', label: 'Your Height (in)', type: 'number', min: 48, max: 84, step: '1' },
    { name: 'deskMode', label: 'Desk Mode', type: 'select', options: [{ label: 'Standing', value: 'stand' }, { label: 'Sitting', value: 'sit' }] },
  ],
  compute: (v) => {
    const h = v.heightInches
    const standingDesk = h * 0.447
    const sittingDesk = h * 0.246
    const seatHeight = h * 0.267
    const monitorHeight = h * 0.214
    const idealHeight = v.deskMode === 'stand' ? standingDesk : sittingDesk
    return { result: idealHeight, label: `Ideal Desk Height (${v.deskMode})`, unit: 'in', steps: [{ label: 'Seat Height', value: `${seatHeight.toFixed(1)} in` }, { label: 'Sitting Desk Height', value: `${sittingDesk.toFixed(1)} in` }, { label: 'Standing Desk Height', value: `${standingDesk.toFixed(1)} in` }, { label: 'Monitor Center Height', value: `${monitorHeight.toFixed(1)} in` }] }
  },
  description: 'Find the ideal standing or sitting desk height based on your height. Proper ergonomic desk setup prevents strain and improves comfort.',
  formula: 'Standing: height×0.447 | Sitting: height×0.246 | Seat: height×0.267 | Monitor: height×0.214',
  interpretation: 'Elbows at 90° with forearms parallel to floor. Wrists straight when typing. Feet flat on floor or footrest. Standing desks should alternate every 30-60 min. Anti-fatigue mat recommended for standing.'
}

export default calcDef
