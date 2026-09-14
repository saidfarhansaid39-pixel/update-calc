import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({
    speciesType: z.string(),
    movementDist: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, 'Must be > 0'),
    edgeEffect: z.string().optional().refine(v => !v || parseFloat(v) >= 0, 'Must be >= 0')
}),
  fields: [
    { name: 'speciesType', label: 'Target Species Group', type: 'select', options: [
      { label: 'Small mammals / amphibians', value: 'small' },
      { label: 'Medium mammals / birds', value: 'medium' },
      { label: 'Large mammals', value: 'large' },
      { label: 'Wide-ranging carnivores', value: 'wide' },
    ] },
    { name: 'movementDist', label: 'Daily Movement Distance', type: 'number', unit: 'm', min: 1, step: '10' },
    { name: 'edgeEffect', label: 'Edge Effect Distance (opt)', type: 'number', unit: 'm', min: 0, step: '10' },
    ],
  presets: [
    { label: 'Amazon deforestation', values: { forest: '1000', deforested: '180', patchCount: '45' } },
    { label: 'Urban fragmentation', values: { nativeCover: '500', builtArea: '1200', roadDensity: '5' } },
    { label: 'Wildlife corridor', values: { corridorWidth: '200', corridorLength: '5000', habitatQuality: '0.7' } },
    { label: 'Mountain ecosystem', values: { elevationMin: '500', elevationMax: '2500', patchArea: '800' } },
    { label: 'Coastal wetland', values: { wetlandArea: '500', bufferZone: '150', connectivityScore: '0.6' } }
    ],
  compute: (v) => {
    const factors: Record<string, number> = { small: 5, medium: 10, large: 20, wide: 30 }
    const factor = factors[v.speciesType] || 10
    const edge = v.edgeEffect || 50
    const minWidth = v.movementDist / factor
    const recommendedWidth = Math.max(minWidth, edge * 2)
    return {
      result: recommendedWidth, label: 'Recommended Corridor Width', unit: 'm',
      steps: [
        { label: 'Species group', value: `${v.speciesType}` },
        { label: 'Daily movement', value: `${v.movementDist} m` },
        { label: 'Movement factor', value: `${factor}` },
        { label: 'Minimum width', value: `${minWidth.toFixed(0)} m` },
        { label: 'Edge effect buffer', value: `${edge * 2} m (2 × ${edge} m)` },
        { label: 'Recommended width', value: `${recommendedWidth.toFixed(0)} m` },
      ]
,
    extras: [
      { label: "Environmental Context", value: "Habitat loss and fragmentation are the primary drivers of biodiversity loss globally. Landscape connectivity is critical for species movement and gene flow." },
      { label: "Measurement Method", value: "Remote sensing (satellite imagery, aerial photography) combined with GIS analysis. Field validation of habitat quality and corridor use." },
      { label: "Conservation Note", value: "Ecological corridors reduce extinction risk by 30-50% in fragmented landscapes. Minimum corridor width varies by target species from 50-500 m." },
      { label: "Typical Ranges", value: "Edge effects extend 50-500 m into habitat patches. Optimal connectivity: >30% habitat cover at landscape scale. Patch area: 1-10⁶ ha." },
      { label: "Related Concepts", value: "Island biogeography theory, SLOSS debate, matrix permeability, stepping stones, wildlife crossings, green infrastructure." }
    ]}
  },
  description: 'Wildlife corridor width depends on target species movement needs and edge effect buffers. Adequate width ensures functional connectivity for dispersal and gene flow.',
  formula: 'Width = Daily movement / Species factor | Edge buffer = 2 × Edge effect distance',
  interpretation: 'Small mammals: 50-100 m. Medium mammals: 200-500 m. Large mammals: 500-2000+ m. Wider corridors support more species and ecological processes.'
}

export default calcDef
