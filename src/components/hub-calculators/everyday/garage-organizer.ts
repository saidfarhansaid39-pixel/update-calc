import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ garageLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), garageWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), cars: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), storageShelves: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'garageLength', label: 'Garage Length (ft)', type: 'number', min: 10, step: '1' },
    { name: 'garageWidth', label: 'Garage Width (ft)', type: 'number', min: 10, step: '1' },
    { name: 'cars', label: 'Number of Cars', type: 'number', min: 0, max: 4, step: '1' },
    { name: 'storageShelves', label: 'Storage Shelving Units', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => {
    const area = v.garageLength * v.garageWidth
    const carSpace = v.cars * 140
    const shelfSpace = v.storageShelves * 12
    const usedSpace = carSpace + shelfSpace
    const remaining = area - usedSpace
    const pctUsed = (usedSpace / area) * 100
    return { result: pctUsed, label: 'Garage Space Used', unit: '%', steps: [{ label: 'Total Area', value: `${area} sq ft` }, { label: 'Car Space', value: `${carSpace} sq ft` }, { label: 'Shelving', value: `${shelfSpace} sq ft` }, { label: 'Remaining Open Space', value: `${remaining.toFixed(0)} sq ft` }] }
  },
  description: 'Plan your garage organization by calculating space used for parking and storage. Optimize for maximum usability.',
  formula: 'Used % = (Cars × 140 + Shelves × 12) / (L × W) × 100',
  interpretation: 'Standard one-car garage: 12×22 ft (264 sqft). Two-car: 22×22 ft (484 sqft). Ceiling-mounted racks free up floor space. Pegboard walls provide vertical tool storage.'
}

export default calcDef
