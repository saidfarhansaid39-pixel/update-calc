import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ baseFare: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), taxesFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), baggageFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seatSelection: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), numTickets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'baseFare', label: 'Base Fare per Ticket ($)', type: 'number', min: 1, step: '50' },
    { name: 'taxesFees', label: 'Taxes & Fees per Ticket ($)', type: 'number', min: 0, step: '10' },
    { name: 'baggageFees', label: 'Baggage Fees ($)', type: 'number', min: 0, step: '20' },
    { name: 'seatSelection', label: 'Seat Selection ($)', type: 'number', min: 0, step: '10' },
    { name: 'numTickets', label: 'Number of Tickets', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const perTicket = v.baseFare + v.taxesFees
    const totalFare = perTicket * v.numTickets
    const totalAddOns = (v.baggageFees + v.seatSelection) * v.numTickets
    const grandTotal = totalFare + v.baggageFees + v.seatSelection
    return { result: grandTotal, label: 'Total Flight Cost', unit: '$', steps: [{ label: 'Fare + Taxes per Ticket', value: `$${perTicket.toFixed(2)}` }, { label: 'Total for All Tickets', value: `$${totalFare.toFixed(2)}` }, { label: 'Add-Ons', value: `$${totalAddOns.toFixed(2)}` }, { label: 'Grand Total', value: `$${grandTotal.toFixed(2)}` }] }
  },
  description: 'Calculate the true cost of a flight including base fare, taxes, baggage fees, and seat selection for multiple passengers.',
  formula: 'Total = (Base Fare + Taxes) × Tickets + Baggage + Seat Selection',
  interpretation: 'Add-on fees (bags, seats, priority boarding) can add 30-50% to the base fare. Budget airlines charge separately for everything. Compare total cost, not just base fare, when booking.'
}

export default calcDef
