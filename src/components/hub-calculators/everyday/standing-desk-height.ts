import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ heightInches: z.string().min(1).refine(v => parseFloat(v) > 48, '>48'), deskMode: z.string().min(1) }),
  fields: [
    { name: 'heightInches', label: 'Your Height (in)', type: 'number', min: 48, max: 84, step: '1' },
    { name: 'deskMode', label: 'Desk Mode', type: 'select', options: [{ label: 'Standing', value: 'stand' }, { label: 'Sitting', value: 'sit' }] },
  ],
  defaults: { heightInches: '68', deskMode: 'stand' },
  presets: [
    { label: 'Average Height (5\'8")', values: { heightInches: '68', deskMode: 'stand' } },
    { label: 'Tall (6\'2")', values: { heightInches: '74', deskMode: 'stand' } },
    { label: 'Petite (5\'2")', values: { heightInches: '62', deskMode: 'sit' } },
    { label: 'Average Sitting', values: { heightInches: '68', deskMode: 'sit' } },
  ],
  compute: (v) => {
    const h = v.heightInches
    const standingDesk = h * 0.447
    const sittingDesk = h * 0.246
    const seatHeight = h * 0.267
    const monitorHeight = h * 0.214
    const idealHeight = v.deskMode === 'stand' ? standingDesk : sittingDesk
    return { result: idealHeight, label: `Ideal Desk Height (${v.deskMode})`, unit: 'in', steps: [{ label: 'Seat Height', value: `${seatHeight.toFixed(1)} in` }, { label: 'Sitting Desk Height', value: `${sittingDesk.toFixed(1)} in` }, { label: 'Standing Desk Height', value: `${standingDesk.toFixed(1)} in` }, { label: 'Monitor Center Height', value: `${monitorHeight.toFixed(1)} in` }] ,
    extras: [
      { label: '90-Degree Rule', value: 'Elbows at 90° with forearms parallel to floor. Wrists straight (neutral) when typing — not bent up or down. Shoulders relaxed, not hunched' },
      { label: 'Standing-Sitting Rotation', value: 'Alternate every 30-60 minutes. Start with 15 min standing per hour and build up. Best ratio: 1:1 or 2:1 sitting to standing' },
      { label: 'Anti-Fatigue Mat Benefit', value: 'Standing on hard surfaces reduces blood flow by 20% in legs. Anti-fatigue mats improve circulation and reduce back pain by 30-50%' },
      { label: 'Screen Height Critical', value: 'Top of monitor at or slightly below eye level. Monitor center should be 15-20° below horizontal line of sight — prevents neck strain' },
      { label: 'Foot Position for Standing', value: 'Stand on an anti-fatigue mat with feet shoulder-width apart. Use a foot rail/rest to shift weight. Wear supportive shoes, not flat soles' },
      { label: 'Chair Ergonomics', value: 'Seat height: knees at 90° with feet flat. Seat depth: 2-4 in gap behind knees. Lumbar support at belt line. Armrests support elbows at 90°' },
      { label: 'Health Impact Data', value: 'Sitting 8+ hours/day increases cardiovascular risk by 17-50%. Alternating standing reduces back pain by 54% and improves mood/productivity' },
    ]}
  },
  description: 'Find the scientifically-recommended ergonomic desk height for both standing and sitting positions based on your height. Includes seat height and monitor placement.',
  formula: 'StandingDesk(in) = Height × 0.447. SittingDesk(in) = Height × 0.246. SeatHeight(in) = Height × 0.267. MonitorCenter(in) = Height × 0.214.',
  interpretation: 'Proper ergonomic setup: elbows at 90° with forearms parallel to floor, wrists straight when typing, feet flat on floor. For a 5\'8" person: standing desk should be ~30.4 in, sitting desk ~16.7 in, seat ~18.2 in, monitor center ~14.6 in. Research shows alternating between sitting and standing every 30-60 minutes reduces back pain by 54% and improves energy. Use an anti-fatigue mat for standing — it improves leg circulation by 20% and reduces joint strain.'
}

export default calcDef
