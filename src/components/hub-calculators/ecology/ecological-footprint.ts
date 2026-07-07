import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ foodAcres: z.string().optional(), housingAcres: z.string().optional(), transportAcres: z.string().optional(), goodsAcres: z.string().optional() }),
  fields: [
    { name: 'foodAcres', label: 'Food footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'housingAcres', label: 'Housing footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'transportAcres', label: 'Transport footprint (global ha)', type: 'number', min: 0, step: '0.1' },
    { name: 'goodsAcres', label: 'Goods & services (global ha)', type: 'number', min: 0, step: '0.1' },
  ],
  compute: (v) => { const food = parseFloat(v.foodAcres)||1.2; const housing = parseFloat(v.housingAcres)||0.8; const transport = parseFloat(v.transportAcres)||0.6; const goods = parseFloat(v.goodsAcres)||0.8; const total = food + housing + transport + goods; const earths = total / 1.6; return { result: total, label: 'Ecological Footprint', unit: 'global ha', steps: [{ label: 'Food', value: `${food.toFixed(2)} gha` }, { label: 'Housing', value: `${housing.toFixed(2)} gha` }, { label: 'Transport', value: `${transport.toFixed(2)} gha` }, { label: 'Goods & services', value: `${goods.toFixed(2)} gha` }, { label: 'Total', value: `${total.toFixed(2)} gha` }, { label: 'Earths needed', value: `${earths.toFixed(2)}` }] } },
  description: 'Calculates personal ecological footprint in global hectares, measuring resource demand against Earth\'s biocapacity.',
  formula: 'EF = Σ(category consumption / global yield)',
  interpretation: 'Global biocapacity: ~1.6 gha/person. Sustainable target: <2.0 gha. US average: ~8.0 gha.'
}

export default calcDef
