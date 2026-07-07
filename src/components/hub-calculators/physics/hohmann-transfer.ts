import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r1: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r2: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'r1', label: 'Initial Orbit Radius r₁', type: 'number', unit: 'km', min: 100, step: '100' }, { name: 'r2', label: 'Final Orbit Radius r₂', type: 'number', unit: 'km', min: 100, step: '100' }, { name: 'mass', label: 'Central Mass M', type: 'number', unit: 'kg', min: 1e20, step: '1e20' }],
  compute: (v) => { const G = 6.674e-11; const r1 = v.r1 * 1000; const r2 = v.r2 * 1000; const a_transfer = (r1 + r2) / 2; const T = 2 * Math.PI * Math.sqrt(a_transfer * a_transfer * a_transfer / (G * v.mass)); const dv1 = Math.sqrt(G * v.mass / r1) * (Math.sqrt(2 * r2 / (r1 + r2)) - 1); const dv2 = Math.sqrt(G * v.mass / r2) * (1 - Math.sqrt(2 * r1 / (r1 + r2))); const total_dv = Math.abs(dv1) + Math.abs(dv2); const T_days = T / (24 * 3600); return { result: T_days, label: 'Transfer Time', unit: 'days', steps: [{ label: 'Formula', value: 't_transfer = π√(a³/(GM))' }, { label: 'Transit time', value: `${T_days.toFixed(2)} days` }, { label: 'Δv₁ (departure)', value: `${dv1.toFixed(2)} m/s` }, { label: 'Δv₂ (arrival)', value: `${dv2.toFixed(2)} m/s` }] } },
  description: 'A Hohmann transfer is the most fuel-efficient two-burn maneuver to transfer between two circular orbits around a central body.',
  formula: 't = π√(a³/(GM)), a = (r₁+r₂)/2',
  interpretation: 'Earth to Mars Hohmann transfer takes ~259 days. Earth to Venus transfer takes ~146 days. The transfer orbit is an ellipse tangent to both circular orbits.'
}

export default calcDef
