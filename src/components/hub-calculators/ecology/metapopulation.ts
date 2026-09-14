import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ colonization: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), extinction: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), patches: z.string().optional() }),
  fields: [
    { name: 'colonization', label: 'Colonization rate (c)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'extinction', label: 'Extinction rate (e)', type: 'number', min: 0.001, step: '0.001' },
    { name: 'patches', label: 'Total patches (optional)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => { const c = parseFloat(v.colonization); const e = parseFloat(v.extinction); const p_eq = c>e ? 1 - e/c : 0; const totalPatches = parseInt(v.patches)||100; const occupied = Math.round(p_eq * totalPatches); return { result: p_eq, label: 'Equilibrium Occupancy (p*)', unit: '', steps: [{ label: 'Colonization rate (c)', value: `${c}` }, { label: 'Extinction rate (e)', value: `${e}` }, { label: 'p* = 1 - e/c', value: p_eq.toFixed(4) }, { label: 'Occupied patches', value: `${occupied}/${totalPatches}` }, { label: 'Status', value: p_eq<=0?'Metapopulation cannot persist':p_eq<0.5?'Unstable':p_eq<0.8?'Moderate':'Stable persistence' }] ,
    extras: [
      { label: "Environmental Context", value: "Habitat loss and fragmentation are the primary drivers of biodiversity loss globally. Landscape connectivity is critical for species movement and gene flow." },
      { label: "Measurement Method", value: "Remote sensing (satellite imagery, aerial photography) combined with GIS analysis. Field validation of habitat quality and corridor use." },
      { label: "Conservation Note", value: "Ecological corridors reduce extinction risk by 30-50% in fragmented landscapes. Minimum corridor width varies by target species from 50-500 m." },
      { label: "Typical Ranges", value: "Edge effects extend 50-500 m into habitat patches. Optimal connectivity: >30% habitat cover at landscape scale. Patch area: 1-10⁶ ha." },
      { label: "Related Concepts", value: "Island biogeography theory, SLOSS debate, matrix permeability, stepping stones, wildlife crossings, green infrastructure." }
    ]} },
  description: 'Levins metapopulation model calculates the equilibrium fraction of occupied habitat patches based on colonization and extinction rates.',
  formula: 'p* = 1 - e/c | Requires c > e for persistence',
  interpretation: 'When c > e, a fraction of patches remains occupied at equilibrium. If c ≤ e, the metapopulation cannot persist and goes extinct.'
}

export default calcDef
