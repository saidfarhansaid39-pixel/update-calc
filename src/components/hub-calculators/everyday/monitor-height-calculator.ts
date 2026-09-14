import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ eyeHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), screenSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['in', 'cm']) }),
  fields: [
    { name: 'eyeHeight', label: 'Eye Height from Floor', type: 'number', min: 1, step: '1' },
    { name: 'screenSize', label: 'Monitor Diagonal Size', type: 'number', min: 1, step: '2' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
  ],
  defaults: { eyeHeight: '42', screenSize: '27', unit: 'in' },
  presets: [
    { label: 'Standard Desk Setup', values: { eyeHeight: '42', screenSize: '27', unit: 'in' } },
    { label: 'Laptop User', values: { eyeHeight: '42', screenSize: '15', unit: 'in' } },
    { label: 'Ultrawide Monitor', values: { eyeHeight: '44', screenSize: '34', unit: 'in' } },
    { label: 'Dual Monitor Setup', values: { eyeHeight: '42', screenSize: '24', unit: 'in' } },
  ],
  compute: (v) => { const screenH = v.screenSize * 0.49; const topOfScreen = v.eyeHeight + (screenH * 0.15); const bottomOfScreen = topOfScreen - screenH; const deskHeight = v.eyeHeight * 0.545; const standHeight = v.eyeHeight - deskHeight - (screenH * 0.5); const recommendedStand = Math.max(0, standHeight); const viewingDist = v.screenSize * 1.2; const ergonomicRating = recommendedStand <= 3 ? '✓ Good — minimal adjustment needed' : recommendedStand <= 8 ? '🟡 Needs moderate adjustment' : '🔴 Needs significant adjustment or monitor arm'; return { result: recommendedStand, label: 'Recommended Stand Height', unit: v.unit, steps: [
    { label: 'Seated Eye Height', value: `${v.eyeHeight} ${v.unit}` },
    { label: 'Monitor Height (approx)', value: `${v.screenSize}${v.unit} × 0.49 = ${screenH.toFixed(1)} ${v.unit}` },
    { label: 'Desk Height (avg)', value: `${v.eyeHeight} × 0.545 = ${deskHeight.toFixed(1)} ${v.unit}` },
    { label: 'Screen Center Target', value: `${v.eyeHeight} − ${deskHeight.toFixed(1)} = ${(v.eyeHeight - deskHeight).toFixed(1)} ${v.unit} above desk` },
    { label: 'Monitor Half Height', value: `${screenH.toFixed(1)} / 2 = ${(screenH * 0.5).toFixed(1)} ${v.unit}` },
    { label: 'Stand/Riser Needed', value: `${recommendedStand.toFixed(1)} ${v.unit}` },
    { label: 'Recommended Viewing Distance', value: `${viewingDist.toFixed(0)} ${v.unit} (${(viewingDist * 2.54).toFixed(0)} cm)` },
    { label: 'Ergonomic Assessment', value: ergonomicRating },
  ] ,
    extras: [
      { label: 'Top of Screen Rule', value: 'The top of your monitor should be at or slightly below eye level. You should look slightly down at the center of the screen.' },
      { label: 'Viewing Distance', value: `For a ${v.screenSize}${v.unit} monitor, sit ${viewingDist.toFixed(0)} ${v.unit} (${(viewingDist * 2.54).toFixed(0)} cm) away — roughly arm\'s length.` },
      { label: 'Neck Strain Prevention', value: 'Looking up at a screen for extended periods strains neck muscles. Proper monitor height reduces headache and upper back pain risk by ~50%.' },
      { label: 'Monitor Arms', value: 'A monitor arm ($30-100) allows infinite height and angle adjustment — the best ergonomic investment you can make.' },
      { label: 'Laptop Ergonomics', value: 'Use a laptop stand to raise the screen to eye level + external keyboard and mouse. Never hunch over a laptop for more than 30 min.' },
      { label: 'Blue Light & Eye Strain', value: 'Position monitor perpendicular to windows to reduce glare. Use 20-20-20 rule: every 20 min, look at something 20 ft away for 20 seconds.' },
    ]} },
  description: 'Calculate the optimal monitor height and ergonomic setup based on your seated eye height, monitor size, and desk configuration. Prevents neck strain, headaches, and eye fatigue.',
  formula: 'ScreenHeight = Diagonal × 0.49 | DeskHeight = EyeHeight × 0.545 | StandHeight = EyeHeight − DeskHeight − (ScreenWidth / 2) | ViewingDistance = Diagonal × 1.2',
  interpretation: 'Ergonomic guidelines: top of screen at or slightly below eye level, 20-40 inches (50-100 cm) viewing distance. For a person with 42 in seated eye height and a 27 in monitor: screen height ≈ 13.2 in, desk ≈ 22.9 in, so the monitor bottom needs to sit ~12.5 in above the desk — typically requiring a 4-6 in stand. A properly positioned monitor prevents forward head posture, neck strain, and tension headaches. For laptops, always use a separate keyboard and mouse with an elevated stand.'
}

export default calcDef
