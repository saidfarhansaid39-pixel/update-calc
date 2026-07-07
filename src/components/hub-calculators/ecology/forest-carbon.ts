import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ biomass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().optional(), factor: z.string().optional() }),
  fields: [
    { name: 'biomass', label: 'Aboveground biomass (Mg)', type: 'number', min: 1, step: '1' },
    { name: 'area', label: 'Forest area (ha, optional)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'factor', label: 'Carbon fraction (default 0.47)', type: 'number', min: 0.1, max: 0.6, step: '0.01' },
  ],
  compute: (v) => { const agb = parseFloat(v.biomass); const area = parseFloat(v.area)||1; const cf = parseFloat(v.factor)||0.47; const carbon = agb * cf; const co2e = carbon * 3.67; const perHa = carbon/area; return { result: perHa, label: 'Carbon Stock', unit: 'Mg C/ha', steps: [{ label: 'AG biomass', value: `${agb} Mg` }, { label: 'Area', value: `${area} ha` }, { label: 'Carbon fraction', value: cf.toFixed(2) }, { label: 'Total carbon', value: `${carbon.toFixed(1)} Mg C` }, { label: 'Per hectare', value: `${perHa.toFixed(1)} Mg C/ha` }, { label: 'CO₂ equivalent', value: `${co2e.toFixed(0)} Mg CO₂e` }] } },
  description: 'Forest carbon stock estimates the amount of carbon stored in forest biomass using conversion from aboveground biomass.',
  formula: 'Carbon = AGB × 0.47 | CO₂e = Carbon × 3.67 | Per ha = Carbon/Area',
  interpretation: 'IPCC default carbon fraction: 0.47. Tropical forests: 100-300 Mg C/ha. Temperate: 50-150 Mg C/ha. Boreal: 30-80 Mg C/ha.'
}

export default calcDef
