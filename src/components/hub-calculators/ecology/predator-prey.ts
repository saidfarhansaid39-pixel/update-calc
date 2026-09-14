import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

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
  presets: [
    { label: 'r-selected (mouse)', values: { lifespan: '1', fecundity: '60', ageFirstRepro: '0.2' } },
    { label: 'K-selected (elephant)', values: { lifespan: '60', fecundity: '6', ageFirstRepro: '12' } },
    { label: 'Intermediate (deer)', values: { lifespan: '15', fecundity: '20', ageFirstRepro: '2' } },
    { label: 'Loggerhead turtle', values: { lifespan: '50', fecundity: '100', ageFirstRepro: '25' } },
    { label: 'Dandelion (r-strategist)', values: { lifespan: '1', fecundity: '2000', ageFirstRepro: '0.3' } }
    ],
  compute: (v) => { const V = parseFloat(v.prey); const P = parseFloat(v.pred); const r = parseFloat(v.r)||0.5; const a = parseFloat(v.a)||0.01; const e = parseFloat(v.e)||0.1; const m = parseFloat(v.m)||0.2; const dV = r*V - a*V*P; const dP = e*a*V*P - m*P; const eqV = m/(e*a); const eqP = r/a; return { result: dV, label: 'dPrey/dt', unit: '', steps: [{ label: 'Prey (V)', value: `${V}` }, { label: 'Predators (P)', value: `${P}` }, { label: 'dPrey/dt = rV - aVP', value: dV.toFixed(2) }, { label: 'dPred/dt = eaVP - mP', value: dP.toFixed(2) }, { label: 'Equilibrium V* = m/(ea)', value: eqV.toFixed(0) }, { label: 'Equilibrium P* = r/a', value: eqP.toFixed(2) }] ,
    extras: [
      { label: "Environmental Context", value: "r/K selection theory describes life-history trade-offs. r-selected species thrive in disturbed habitats; K-selected species dominate stable environments." },
      { label: "Measurement Method", value: "Life-history parameters from long-term population studies. Matrix projection models integrate survival, growth, and fecundity across size/stage classes." },
      { label: "Conservation Note", value: "K-selected species (large, slow, low fecundity) are more vulnerable to extinction. Stage-structured models identify critical life stages for conservation action." },
      { label: "Typical Ranges", value: "r-selected: high fecundity (>1000 eggs), short lifespan (<1 yr), small body size. K-selected: low fecundity (<10 offspring), long lifespan (>10 yr), large body size." },
      { label: "Related Concepts", value: "Life-history strategies, demographic modeling, elasticity analysis, lottery model, Grime's CSR theory for plants." }
    ]} },
  description: 'Lotka-Volterra predator-prey model calculates population change rates for coupled predator-prey dynamics.',
  formula: 'dV/dt = rV - aVP | dP/dt = eaVP - mP',
  interpretation: 'Predator and prey populations oscillate. When V increases, P follows with a lag. V then declines due to predation, followed by P decline.'
}

export default calcDef
