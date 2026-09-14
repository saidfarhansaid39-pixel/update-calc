import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ food: z.string().optional(), cover: z.string().optional(), water: z.string().optional(), reproduction: z.string().optional() }),
  fields: [
    { name: 'food', label: 'Food availability (0-1)', type: 'number', min: 0, max: 1, step: '0.1' },
    { name: 'cover', label: 'Cover availability (0-1)', type: 'number', min: 0, max: 1, step: '0.1' },
    { name: 'water', label: 'Water access (0-1)', type: 'number', min: 0, max: 1, step: '0.1' },
    { name: 'reproduction', label: 'Reproduction habitat (0-1)', type: 'number', min: 0, max: 1, step: '0.1' },
    ],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => { const food = parseFloat(v.food)||0.5; const cover = parseFloat(v.cover)||0.5; const water = parseFloat(v.water)||0.5; const repro = parseFloat(v.reproduction)||0.5; const hsi = Math.min(food, cover, water, repro); const geometric = Math.pow(food*cover*water*repro, 0.25); return { result: hsi, label: 'Habitat Suitability Index (min)', unit: '', steps: [{ label: 'Food', value: food.toFixed(2) }, { label: 'Cover', value: cover.toFixed(2) }, { label: 'Water', value: water.toFixed(2) }, { label: 'Reproduction', value: repro.toFixed(2) }, { label: 'HSI (minimum)', value: hsi.toFixed(3) }, { label: 'Geometric mean', value: geometric.toFixed(3) }, { label: 'Suitability', value: hsi>=0.7?'High':hsi>=0.4?'Moderate':'Low' }] ,
    extras: [
      { label: "Environmental Context", value: "Habitat loss and fragmentation are the primary drivers of biodiversity loss globally. Landscape connectivity is critical for species movement and gene flow." },
      { label: "Measurement Method", value: "Remote sensing (satellite imagery, aerial photography) combined with GIS analysis. Field validation of habitat quality and corridor use." },
      { label: "Conservation Note", value: "Ecological corridors reduce extinction risk by 30-50% in fragmented landscapes. Minimum corridor width varies by target species from 50-500 m." },
      { label: "Typical Ranges", value: "Edge effects extend 50-500 m into habitat patches. Optimal connectivity: >30% habitat cover at landscape scale. Patch area: 1-10⁶ ha." },
      { label: "Related Concepts", value: "Island biogeography theory, SLOSS debate, matrix permeability, stepping stones, wildlife crossings, green infrastructure." }
    ]} },
  description: 'Habitat Suitability Index (HSI) combines multiple environmental variables using limiting factor or geometric mean approaches to quantify habitat quality.',
  formula: 'HSI_min = min(S₁, S₂, ..., Sₙ) | HSI_gm = (∏Sᵢ)^(1/n)',
  interpretation: 'HSI ranges 0 (unsuitable) to 1 (optimal). Minimum method is conservative. Geometric mean allows trade-offs between factors. HSI > 0.7 = suitable habitat.'
}

export default calcDef
