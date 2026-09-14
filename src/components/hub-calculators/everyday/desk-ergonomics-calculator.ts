import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ height: z.string().min(1).refine(v => parseFloat(v) > 48, '>48'), deskType: z.string().min(1), monitorSize: z.string().min(1).refine(v => parseFloat(v) > 10, '>10') }),
  fields: [
    { name: 'height', label: 'Your Height (in)', type: 'number', min: 48, step: '1' },
    { name: 'deskType', label: 'Desk Type', type: 'select', options: [{ label: 'Standing Desk', value: 'stand' }, { label: 'Sitting Desk', value: 'sit' }] },
    { name: 'monitorSize', label: 'Monitor Size (in diagonal)', type: 'number', min: 10, step: '1' },
  ],
  defaults: { height: '68', deskType: 'sit', monitorSize: '27' },
  presets: [
    { label: 'Petite (5\'0")', values: { height: '60', deskType: 'sit', monitorSize: '24' } },
    { label: 'Average (5\'8")', values: { height: '68', deskType: 'sit', monitorSize: '27' } },
    { label: 'Tall (6\'2") Standing', values: { height: '74', deskType: 'stand', monitorSize: '32' } },
    { label: 'Short (5\'4") Sitting', values: { height: '64', deskType: 'sit', monitorSize: '22' } },
  ],
  compute: (v) => {
    const deskHeight = v.deskType === 'stand' ? v.height * 0.447 : v.height * 0.246
    const seatHeight = v.height * 0.267
    const elbowHeight = v.deskType === 'stand' ? v.height * 0.416 : v.height * 0.235
    const monitorTop = v.monitorSize * 0.5 + v.height * 0.214
    const monitorHeight = v.height * 0.214
    const keyboardTray = deskHeight - 2
    return { result: deskHeight, label: 'Ideal Desk Height', unit: 'in', steps: [{ label: 'Seat Height', value: `${seatHeight.toFixed(1)} in` }, { label: 'Desk Height', value: `${deskHeight.toFixed(1)} in (${v.deskType === 'stand' ? 'standing' : 'sitting'})` }, { label: 'Elbow Height (90°)', value: `${elbowHeight.toFixed(1)} in — keyboard should be here` }, { label: 'Keyboard Tray Height', value: `${keyboardTray.toFixed(1)} in (2 in below desk surface)` }, { label: 'Eye Level', value: `${monitorTop.toFixed(1)} in from floor` }, { label: 'Monitor Top Position', value: `${monitorHeight.toFixed(1)} in above desk (top at eye level)` }, { label: 'Viewing Distance', value: `${(v.monitorSize * 1.5).toFixed(0)}-${(v.monitorSize * 2.5).toFixed(0)} in (arm's length)` }] ,
    extras: [
      { label: "90-90-90 Rule", value: "Elbows at 90°, hips at 90° (or slightly open to 100-110°), knees at 90°. Feet flat on floor or on a footrest. Ankles slightly forward of knees." },
      { label: "Monitor Height", value: "Top of the monitor screen should be at or just below eye level. If wearing bifocals, lower the monitor 1-2 in so you don't tilt your head back." },
      { label: "Viewing Distance", value: "Position monitor at arm's length (20-30 in for 24-32 in screens). For larger monitors (>32 in), move back to 30-40 in to keep the full screen in your field of view without head turning." },
      { label: "Keyboard Position", value: "Keyboard should be at or slightly below elbow height. Wrists should be straight (not bent up or down). Use a negative tilt (-5 to -10°) if possible." },
      { label: "Standing Desk Ratio", value: "Alternate sit/stand every 30-60 min. Standing all day is as bad as sitting all day. Aim for a 50:50 ratio or 20:40 split (stand 20 min each hour)." },
      { label: "Anti-Fatigue Mat", value: "A standing desk mat reduces lower back and leg fatigue by 30-50%. Look for one with beveled edges (trip hazard) and a massage texture to encourage micro-movement." },
      { label: "Lighting & Glare", value: "Position the monitor perpendicular to windows to reduce glare. Bias lighting behind the monitor (6500K) reduces eye strain by 20% and improves perceived contrast." },
      { label: "The 20-20-20 Rule", value: "Every 20 minutes, look at something 20 feet away for 20 seconds. This reduces digital eye strain by 30-50% and breaks prolonged static posture." },
    ]}
  },
  description: 'Calculate your ideal ergonomic workstation setup: desk height, seat height, monitor position, keyboard tray height, and viewing distance based on your height and desk type. Based on OSHA and Cornell University ergonomics guidelines.',
  formula: 'Sitting Desk = Height × 0.246 | Standing Desk = Height × 0.447 | Seat = Height × 0.267 | Eye Level = Height × 0.214 | Elbow = Standing: H × 0.416, Sitting: H × 0.235',
  interpretation: 'Proper ergonomics are governed by the 90-90-90 rule: elbows, hips, and knees all at approximately 90 degrees. The top of the monitor should be at or just below eye level—if you wear bifocals, lower it 1-2 inches. The keyboard should sit at elbow height, with wrists straight (neutral position). For standing desks, alternate sit/stand every 30-60 minutes using an anti-fatigue mat. Follow the 20-20-20 rule: every 20 minutes, gaze at something 20 feet away for 20 seconds to reduce digital eye strain. These adjustments can reduce work-related musculoskeletal discomfort by 40-60% and improve productivity by 5-15%.'
}

export default calcDef
