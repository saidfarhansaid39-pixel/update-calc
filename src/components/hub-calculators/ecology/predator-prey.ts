import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ prey: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pred: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), r: z.string().optional(), a: z.string().optional(), e: z.string().optional(), m: z.string().optional() }),
  fields: [
    { name: 'prey', label: 'Prey population (V)', type: 'number', min: 1, step: '1' },
    { name: 'pred', label: 'Predator population (P)', type: 'number', min: 1, step: '1' },
    { name: 'r', label: 'Prey growth rate (r)', type: 'number', min: 0, step: '0.01' },
    { name: 'a', label: 'Attack rate (a)', type: 'number', min: 0, step: '0.001' },
    { name: 'e', label: 'Conversion efficiency (e)', type: 'number', min: 0, step: '0.01' },
    { name: 'm', label: 'Predator mortality (m)', type: 'number', min: 0, step: '0.01' },
  ],
  compute: (v) => { const V = parseFloat(v.prey); const P = parseFloat(v.pred); const r = parseFloat(v.r)||0.5; const a = parseFloat(v.a)||0.01; const e = parseFloat(v.e)||0.1; const m = parseFloat(v.m)||0.2; const dV = r*V - a*V*P; const dP = e*a*V*P - m*P; const eqV = m/(e*a); const eqP = r/a; return { result: dV, label: 'dPrey/dt', unit: '', steps: [{ label: 'Prey (V)', value: `${V}` }, { label: 'Predators (P)', value: `${P}` }, { label: 'dPrey/dt = rV - aVP', value: dV.toFixed(2) }, { label: 'dPred/dt = eaVP - mP', value: dP.toFixed(2) }, { label: 'Equilibrium V* = m/(ea)', value: eqV.toFixed(0) }, { label: 'Equilibrium P* = r/a', value: eqP.toFixed(2) }] } },
  description: 'Lotka-Volterra predator-prey model calculates population change rates for coupled predator-prey dynamics.',
  formula: 'dV/dt = rV - aVP | dP/dt = eaVP - mP',
  interpretation: 'Predator and prey populations oscillate. When V increases, P follows with a lag. V then declines due to predation, followed by P decline.'
}

export default calcDef
