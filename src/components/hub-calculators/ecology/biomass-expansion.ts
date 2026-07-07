import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ merchantableVol: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), beFactor: z.string().optional() }),
  fields: [
    { name: 'merchantableVol', label: 'Merchantable timber volume (m³)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'beFactor', label: 'Biomass expansion factor (BEF)', type: 'number', min: 1, step: '0.1' },
  ],
  compute: (v) => { const vol = parseFloat(v.merchantableVol); const bef = parseFloat(v.beFactor)||1.5; const woodDensity = 0.5; const totalBiomass = vol * woodDensity * bef; const carbon = totalBiomass * 0.47; return { result: totalBiomass, label: 'Total Aboveground Biomass', unit: 'Mg', steps: [{ label: 'Merchantable volume', value: `${vol} m³` }, { label: 'BEF', value: `${bef}` }, { label: 'Wood density', value: `${woodDensity} Mg/m³` }, { label: 'Total biomass = V × ρ × BEF', value: `${totalBiomass.toFixed(2)} Mg` }, { label: 'Carbon', value: `${carbon.toFixed(2)} Mg C` }] } },
  description: 'Biomass Expansion Factor (BEF) converts merchantable timber volume to total aboveground biomass, accounting for branches, bark, and non-merchantable components.',
  formula: 'Total AGB = V × ρ × BEF | BEF typically 1.3-1.7 | ρ = wood density',
  interpretation: 'BEF of 1.5 means total biomass is 50% more than merchantable volume. Higher BEF for younger forests and tropical species with more branches.'
}

export default calcDef
