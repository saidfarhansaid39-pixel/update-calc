import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n < 299792458 }, '0-c') }),
  fields: [{ name: 'distance', label: 'One-Way Distance d', type: 'number', unit: 'ly', min: 1, step: '1' }, { name: 'velocity', label: 'Travel Speed v', type: 'number', unit: 'c', min: 0.01, max: 0.999999, step: '0.01' }],
  compute: (v) => { const c_ly = 1; const v_rel = v.velocity * c_ly; const gamma = 1 / Math.sqrt(1 - v_rel * v_rel); const earthTime = 2 * v.distance / v_rel; const travelerTime = earthTime / gamma; return { result: travelerTime, label: 'Traveler\'s Elapsed Time', unit: 'years', steps: [{ label: 'Formula', value: "t_traveler = t_earth/γ" }, { label: 'γ', value: `${gamma.toFixed(4)}` }, { label: 'Earth time', value: `${earthTime.toFixed(2)} years` }, { label: 'Traveler time', value: `${travelerTime.toFixed(2)} years` }] } },
  description: 'The twin paradox: a traveling twin returns younger than their Earth-bound sibling due to time dilation in special relativity.',
  formula: 'Δt_traveler = Δt_earth/γ = (2d/v)·√(1-v²/c²)',
  interpretation: 'The paradox is resolved by noting the traveling twin undergoes acceleration (non-inertial frame). For a 10 ly trip at 0.8c: Earth ages 25 years, traveler ages 15 years. GPS must account for relativistic effects.'
}

export default calcDef
