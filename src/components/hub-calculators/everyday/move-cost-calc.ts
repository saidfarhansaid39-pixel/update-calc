import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ moversHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), moverRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), moverCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), truckRental: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), mileage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), gasCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), packingSupplies: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'moversHours', label: 'Mover Labor Hours', type: 'number', min: 0, step: '1' },
    { name: 'moverRate', label: 'Hourly Rate per Mover ($)', type: 'number', min: 0, step: '10' },
    { name: 'moverCount', label: 'Number of Movers', type: 'number', min: 1, step: '1' },
    { name: 'truckRental', label: 'Truck Rental ($)', type: 'number', min: 0, step: '50' },
    { name: 'mileage', label: 'Distance (miles)', type: 'number', min: 0, step: '10' },
    { name: 'gasCost', label: 'Gas Cost ($)', type: 'number', min: 0, step: '20' },
    { name: 'packingSupplies', label: 'Packing Supplies ($)', type: 'number', min: 0, step: '25' },
  ],
  compute: (v) => { const laborCost = v.moversHours * v.moverRate * v.moverCount; const travelCost = v.truckRental + v.gasCost; const totalCost = laborCost + travelCost + v.packingSupplies; return { result: totalCost, label: 'Total Moving Cost', unit: '$', steps: [{ label: 'Labor', value: `${v.moversHours}hrs × ${v.moverCount} movers × $${v.moverRate} = $${laborCost.toFixed(0)}` }, { label: 'Truck + Gas', value: `$${travelCost.toFixed(0)}` }, { label: 'Supplies', value: `$${v.packingSupplies.toFixed(0)}` }, { label: 'Total', value: `$${totalCost.toFixed(0)}` }] } },
  description: 'Estimate total moving day cost including professional movers, truck rental, fuel, and packing supplies.',
  formula: 'Total = (Hours × Rate × Movers) + Truck Rental + Gas + Packing Supplies',
  interpretation: 'Local moves average $80-150/hr for 2-3 movers. Long-distance: $2,000-5,000. Peak season (May-Sep) costs 20-30% more. Get 3 quotes minimum and book 4-6 weeks ahead.'
}

export default calcDef
