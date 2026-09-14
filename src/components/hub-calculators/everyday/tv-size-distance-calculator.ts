import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tvsdViewingDist: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tvsdResolution: z.string().min(1), tvsdAspectRatio: z.string().min(1) }),
  fields: [
    { name: 'tvsdViewingDist', label: 'Viewing Distance (ft)', type: 'number', min: 3, step: '1' },
    { name: 'tvsdResolution', label: 'Screen Resolution', type: 'select', options: [{ label: '1080p (HD)', value: '1080p' }, { label: '4K (UHD)', value: '4k' }, { label: '8K', value: '8k' }] },
    { name: 'tvsdAspectRatio', label: 'Aspect Ratio', type: 'select', options: [{ label: '16:9 (Standard)', value: '16:9' }, { label: '21:9 (Ultrawide)', value: '21:9' }] },
  ],
  defaults: { tvsdViewingDist: '8', tvsdResolution: '4k', tvsdAspectRatio: '16:9' },
  presets: [
    { label: 'Living Room (8 ft)', values: { tvsdViewingDist: '8', tvsdResolution: '4k', tvsdAspectRatio: '16:9' } },
    { label: 'Home Theater (12 ft)', values: { tvsdViewingDist: '12', tvsdResolution: '1080p', tvsdAspectRatio: '16:9' } },
    { label: 'Bedroom (6 ft)', values: { tvsdViewingDist: '6', tvsdResolution: '4k', tvsdAspectRatio: '16:9' } },
    { label: 'Ultrawide Gaming (5 ft)', values: { tvsdViewingDist: '5', tvsdResolution: '4k', tvsdAspectRatio: '21:9' } },
  ],
  compute: (v) => {
    const resolutionMap: Record<string, { minFactor: number; maxFactor: number; idealFactor: number }> = { '1080p': { minFactor: 1.5, maxFactor: 3, idealFactor: 2.5 }, '4k': { minFactor: 1, maxFactor: 2, idealFactor: 1.5 }, '8k': { minFactor: 0.75, maxFactor: 1.5, idealFactor: 1 } }
    const res = resolutionMap[v.tvsdResolution] || { minFactor: 1, maxFactor: 2, idealFactor: 1.5 }
    const minSize = v.tvsdViewingDist * 12 / res.maxFactor
    const maxSize = v.tvsdViewingDist * 12 / res.minFactor
    const idealSize = v.tvsdViewingDist * 12 / res.idealFactor
    const aspectRatio = v.tvsdAspectRatio === '21:9' ? 21 / 9 : 16 / 9
    const diagFactor = Math.sqrt(1 + 1 / (aspectRatio * aspectRatio)) * aspectRatio
    const minDiagonal = minSize * diagFactor
    const maxDiagonal = maxSize * diagFactor
    const idealDiagonal = idealSize * diagFactor
    const fovDeg = 2 * Math.atan((idealSize / 2) / (v.tvsdViewingDist * 12)) * (180 / Math.PI)
    return { result: idealDiagonal, label: 'Ideal TV Size', unit: 'in', steps: [
      { label: 'Formula', value: 'Ideal = (Dist × 12 ÷ Factor) × DiagonalFactor' },
      { label: 'Resolution', value: v.tvsdResolution + ' (factor: ' + res.idealFactor + ')' },
      { label: 'Aspect Ratio', value: v.tvsdAspectRatio },
      { label: 'Min Size', value: minDiagonal.toFixed(0) + ' in' },
      { label: 'Ideal Size', value: idealDiagonal.toFixed(0) + ' in' },
      { label: 'Max Size', value: maxDiagonal.toFixed(0) + ' in' },
      { label: 'Field of View', value: fovDeg.toFixed(1) + ' deg (ideal: 30-40 deg)' },
    ] ,
    extras: [
      { label: 'THX Standard', value: 'THX recommends 30-40° field of view for immersive cinema-like experience at home' },
      { label: 'SMPTE Standard', value: 'SMPTE recommends minimum 30° FOV — anything under 26° feels like looking through a window' },
      { label: '4K Advantage', value: '4K allows sitting 40% closer than 1080p without seeing individual pixels — bigger feels more immersive' },
      { label: 'Eye Fatigue', value: 'Too-large TVs at close distance cause eye strain from constant saccadic movement across the screen' },
      { label: 'Mounting Height', value: 'Center of screen should be at seated eye level (~42 in). Add 4-6 in for soundbar clearance' },
      { label: 'Brightness Drop', value: 'OLED: 30-40° off-axis = 50% brightness loss. IPS LCD: better at wide angles than VA panels' },
      { label: 'Screen Burn-In', value: 'OLED: avoid static images (news tickers, HUDs) for hours. Modern OLEDs have pixel shifting to mitigate' },
      { label: 'Size vs Resolution', value: 'At 8 ft: 55" 1080p = pixelated. 65" 4K = sharp. 75" 8K = indistinguishable from 4K at that distance' },
    ]}
  },
  description: 'Find the optimal TV size for your viewing distance based on screen resolution and aspect ratio. Follows THX (30-40° FOV) and SMPTE (minimum 30° FOV) recommendations for the best home theater experience.',
  formula: 'Ideal Screen Height (in) = Distance (ft) × 12 ÷ Resolution Factor. Diagonal = Height × √(1 + (1/AspectRatio²)) × AspectRatio. 4K: factor 1.5 (ideal). 1080p: factor 2.5. 8K: factor 1.0.',
  interpretation: 'For an 8 ft viewing distance with 4K: ideal screen size is ~65 in (40° FOV). With 1080p at the same distance: ~55 in. 4K allows sitting closer for a more immersive experience without visible pixels. For mixed usage (TV + gaming), lean toward the smaller end of the range to reduce eye fatigue during non-cinema content.'
}

export default calcDef
