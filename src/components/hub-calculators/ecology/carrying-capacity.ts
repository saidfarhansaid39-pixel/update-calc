import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ growthRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), popSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), maxGrowth: z.string().optional() }),
  fields: [
    { name: 'popSize', label: 'Current population size', type: 'number', min: 1, step: '1' },
    { name: 'growthRate', label: 'Per capita growth rate (r)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'maxGrowth', label: 'Maximum observed growth increment', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Temperate example', values: { input: '100', factor: '1.5' } },
    { label: 'Tropical example', values: { input: '250', factor: '1.8' } },
    { label: 'Minimal case', values: { input: '10' } },
    { label: 'Recovery scenario', values: { input: '50', factor: '1.2' } },
    { label: 'Degraded state', values: { input: '200', factor: '0.7' } }
    ],
  compute: (v) => { const pop = parseFloat(v.popSize); const r = parseFloat(v.growthRate); const maxG = parseFloat(v.maxGrowth)||pop*r*0.5; const K_approx = pop + (maxG * pop) / (r * pop - maxG); const K = Math.max(K_approx, pop*1.1); const logisticRate = r * (1 - pop/K); return { result: K, label: 'Estimated Carrying Capacity (K)', unit: '', steps: [{ label: 'Current population (N)', value: `${pop}` }, { label: 'Growth rate (r)', value: r.toFixed(4) }, { label: 'Max growth increment', value: `${maxG}` }, { label: 'Estimated K', value: K.toFixed(0) }, { label: 'Current growth rate (dN/Ndt)', value: logisticRate.toFixed(4) }] ,
    extras: [
      { label: "Environmental Context", value: "Ecological calculations help quantify ecosystem structure, function, and change — providing the evidence base for conservation and management decisions." },
      { label: "Measurement Method", value: "Standardized field methods and protocols ensure data comparability across studies. Peer-reviewed methodologies published in ecological literature." },
      { label: "Conservation Note", value: "Ecological indicators inform policy and management. Regular monitoring detects early warning signs of ecosystem degradation." },
      { label: "Typical Ranges", value: "Ranges vary by ecosystem type, geographic region, and disturbance history. Context-specific interpretation using local reference sites is recommended." },
      { label: "Related Concepts", value: "Ecosystem-based management, adaptive management, evidence-based conservation, ecological integrity monitoring." }
    ]} },
  description: 'Estimates environmental carrying capacity from population growth data using the logistic model.',
  formula: 'dN/dt = rN(1-N/K) → K = N + (G·N)/(r·N - G)',
  interpretation: 'When N << K, population grows exponentially. When N ≈ K, growth slows to zero. Overshooting K leads to population crash.'
}

export default calcDef
