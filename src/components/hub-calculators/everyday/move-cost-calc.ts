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
  defaults: { moversHours: '4', moverRate: '50', moverCount: '3', truckRental: '200', mileage: '15', gasCost: '40', packingSupplies: '75' },
  presets: [
    { label: 'Studio Apt — DIY', values: { moversHours: '3', moverRate: '0', moverCount: '1', truckRental: '80', mileage: '10', gasCost: '25', packingSupplies: '40' } },
    { label: '2BR — Local Movers', values: { moversHours: '4', moverRate: '50', moverCount: '3', truckRental: '200', mileage: '15', gasCost: '40', packingSupplies: '75' } },
    { label: '4BR — Long Distance', values: { moversHours: '8', moverRate: '55', moverCount: '4', truckRental: '800', mileage: '500', gasCost: '200', packingSupplies: '150' } },
  ],
  compute: (v) => { const laborCost = v.moversHours * v.moverRate * v.moverCount; const travelCost = v.truckRental + v.gasCost; const totalCost = laborCost + travelCost + v.packingSupplies; const costPerRoom = v.moversHours > 0 ? totalCost / Math.max(1, v.moversHours / 1.5) : totalCost; const tipAmount = laborCost > 0 ? laborCost * 0.15 : 0; return { result: totalCost, label: 'Total Moving Cost', unit: '$', steps: [
    { label: 'Mover Labor', value: `${v.moversHours} hrs × ${v.moverCount} movers × $${v.moverRate}/hr = $${laborCost.toFixed(0)}` },
    { label: 'Truck Rental', value: `$${v.truckRental.toFixed(0)}` },
    { label: 'Gas/Fuel', value: `$${v.gasCost.toFixed(0)}` },
    { label: 'Packing Supplies', value: `$${v.packingSupplies.toFixed(0)}` },
    { label: 'Total Cost', value: `$${totalCost.toFixed(0)}` },
    { label: 'Suggested Tips (15%)', value: `$${tipAmount.toFixed(0)} (for movers)` },
    { label: 'Grand Total w/ Tips', value: `$${(totalCost + tipAmount).toFixed(0)}` },
  ] ,
    extras: [
      { label: 'Local Move Averages', value: 'Local moves: $80-150/hr for 2-3 movers. Most local moves take 3-6 hours depending on home size.' },
      { label: 'Long-Distance Costs', value: 'Long-distance: $2,000-5,000 for cross-country. Costs based on weight (lbs) and distance (miles).' },
      { label: 'Peak Season Pricing', value: 'May-September costs 20-30% more. Book 4-6 weeks ahead for best rates. Weekday moves are cheaper than weekends.' },
      { label: 'Mover Tips', value: 'Standard: 15-20% of labor cost or $20-40 per mover. Tip in cash at the end of the move.' },
      { label: 'Hidden Costs', value: 'Stairs ($50-100 extra), long carry ($75-150), bulky items (pianos $200+, pool tables $300+), disassembly/reassembly.' },
      { label: 'Get 3 Quotes', value: 'Always get at least 3 in-home estimates. Compare binding vs non-binding quotes. Binding is safer for your budget.' },
    ]} },
  description: 'Estimate the full cost of moving day including professional movers, truck rental, fuel, packing supplies, and recommended tips. Compare local vs long-distance scenarios.',
  formula: 'Total = (MoversHours × MoverRate × MoverCount) + TruckRental + GasCost + PackingSupplies | Tip = Labor × 15%',
  interpretation: 'Local moves average $80-150/hr for 2-3 movers with a 3-hour minimum. A typical 2BR local move: 4 hrs × 3 movers × $50/hr = $600 labor + $200 truck + $40 gas + $75 supplies = $915 total. Long-distance moves: $2,000-5,000 based on weight and distance. Peak season (May-Sep) costs 20-30% more. Get 3 binding quotes and book 4-6 weeks ahead for best rates.'
}

export default calcDef
