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
  defaults: { baseFare: '298', taxesFees: '85', baggageFees: '70', seatSelection: '30', numTickets: '1' },
  presets: [
    { label: 'Domestic Round Trip', values: { baseFare: '298', taxesFees: '85', baggageFees: '70', seatSelection: '30', numTickets: '1' } },
    { label: 'International Economy', values: { baseFare: '650', taxesFees: '180', baggageFees: '140', seatSelection: '60', numTickets: '1' } },
    { label: 'Family Vacation (4 tickets)', values: { baseFare: '250', taxesFees: '70', baggageFees: '280', seatSelection: '120', numTickets: '4' } },
    { label: 'Budget Airline (no frills)', values: { baseFare: '89', taxesFees: '45', baggageFees: '80', seatSelection: '0', numTickets: '1' } },
  ],
  compute: (v) => {
    const perTicket = v.baseFare + v.taxesFees
    const totalFare = perTicket * v.numTickets
    const baggagePerPerson = v.baggageFees
    const seatPerPerson = v.seatSelection
    const totalBaggage = v.baggageFees
    const totalSeats = v.seatSelection
    const totalAddOns = (v.baggageFees + v.seatSelection)
    const grandTotal = totalFare + totalBaggage + totalSeats
    const effectivePerTicket = grandTotal / v.numTickets
    const basePct = grandTotal > 0 ? (v.baseFare * v.numTickets) / grandTotal * 100 : 0
    const addonPct = grandTotal > 0 ? (totalAddOns) / grandTotal * 100 : 0
    const taxPct = grandTotal > 0 ? (v.taxesFees * v.numTickets) / grandTotal * 100 : 0
    return { result: grandTotal, label: 'Total Flight Cost', unit: '$', steps: [{ label: 'Base Fare per Ticket', value: `$${v.baseFare.toFixed(2)}` }, { label: 'Taxes & Fees per Ticket', value: `$${v.taxesFees.toFixed(2)}` }, { label: 'Total Fare (${v.numTickets} tickets)', value: `$${totalFare.toFixed(2)}` }, { label: 'Baggage Fees (total)', value: `$${totalBaggage.toFixed(2)}` }, { label: 'Seat Selection (total)', value: `$${totalSeats.toFixed(2)}` }, { label: 'Grand Total', value: `$${grandTotal.toFixed(2)}` }, { label: 'Effective Cost per Ticket', value: `$${effectivePerTicket.toFixed(2)}` }, { label: 'Cost Breakdown', value: `Base ${basePct.toFixed(0)}% | Tax ${taxPct.toFixed(0)}% | Add-ons ${addonPct.toFixed(0)}%` }] ,
    extras: [
      { label: 'Add-On Premium Analysis', value: `Add-ons cost $${(v.baggageFees + v.seatSelection).toFixed(0)} total ($${((v.baggageFees + v.seatSelection) / v.numTickets).toFixed(0)}/person) = ${addonPct.toFixed(0)}% of $${grandTotal.toFixed(0)} total. Budget carriers can have add-ons reaching 50-80% of base fare. Your base fare $${v.baseFare.toFixed(0)} becomes $${effectivePerTicket.toFixed(0)} effective after fees — a ${((effectivePerTicket - v.baseFare) / v.baseFare * 100).toFixed(0)}% surcharge. For a family of ${v.numTickets}, that's $${((v.baggageFees + v.seatSelection) * (v.numTickets > 1 ? 1 : 1)).toFixed(0)} just in optional fees.` },
      { label: 'Baggage Economics', value: `$${v.baggageFees.toFixed(0)} = ~${(v.baggageFees / 35).toFixed(1)} checked bags (typical $35 each). At $${v.baseFare.toFixed(0)} base fare, checking ${(v.baggageFees / 35).toFixed(0)} bag(s) adds ${(v.baggageFees / v.baseFare * 100).toFixed(0)}%. Carry-on only: save $${v.baggageFees.toFixed(0)}. Credit cards with free checked bags save frequent flyers $140-280/year. Pre-pay baggage online vs at airport: save $5-10 per bag.` },
      { label: 'Seat Selection Value', value: `$${v.seatSelection.toFixed(0)} for seat selection. Standard seats free at check-in, but families may need to pay to sit together (airlines may still separate without payment). Exit row/extra legroom costs $15-80/seat. For ${v.numTickets} tickets: $${(v.seatSelection).toFixed(0)} total. Without selection: free but risk split seating. Over a typical year of ${Math.ceil(v.numTickets)} trips, that's $${(v.seatSelection * Math.ceil(v.numTickets)).toFixed(0)} saved by skipping.` },
      { label: 'Credit Card & Points Strategy', value: `$${grandTotal.toFixed(0)} total — could reduce to $${(grandTotal * 0.5).toFixed(0)} with travel rewards card (typical 2× points = ~10% back). Best cards: Chase Sapphire, Amex Platinum, Capital One Venture for 2-5× on travel. Sign-up bonus (60-100k pts) often covers this entire $${grandTotal.toFixed(0)} fare. Without rewards: $${grandTotal.toFixed(0)} out of pocket. With 2% cashback card: $${(grandTotal * 0.98).toFixed(2)} net.` },
      { label: 'Booking Timing Impact', value: `Book ${v.baseFare >= 500 ? '3-6 months' : v.baseFare >= 200 ? '2-3 months' : '1-2 months'} ahead for best fare. At $${v.baseFare.toFixed(0)} base, booking last-minute (<14 days) adds 30-50%. Departure: Tuesday/Wednesday cheapest, Friday/Sunday +20-30%. Time of year: peak season (Jun-Aug, Dec) +30-50%. Your $${grandTotal.toFixed(0)} total could be $${(grandTotal * 0.75).toFixed(0)} with optimal timing.` },
      { label: 'Airline Comparison Potential', value: `$${v.baseFare.toFixed(0)} base fare comparison: ${v.baggageFees > 0 ? 'traditional airline (bags included) → $' + (v.baseFare).toFixed(0) + ' effective' : 'budget airline + ' + (v.baggageFees).toFixed(0) + ' bags = $' + (v.baseFare + v.baggageFees).toFixed(0) + ' effective'}. A competitor at $${(v.baseFare + 50).toFixed(0)} base with free bags + seats included = $${(v.baseFare + 50).toFixed(0)} vs your $${effectivePerTicket.toFixed(0)} — ${grandTotal > (v.baseFare + 50) * v.numTickets ? 'saves $' + (grandTotal - (v.baseFare + 50) * v.numTickets).toFixed(0) : 'costs $' + ((v.baseFare + 50) * v.numTickets - grandTotal).toFixed(0) + ' more'}. Always compare total cost, not base fare.` },
      { label: 'Per-Trip Cost Breakdown', value: `$${grandTotal.toFixed(0)} total for ${v.numTickets} ticket(s). Cost per ticket: $${effectivePerTicket.toFixed(2)}. Breakdown per ticket: base $${v.baseFare.toFixed(2)} (${basePct.toFixed(0)}%), taxes $${v.taxesFees.toFixed(2)} (${taxPct.toFixed(0)}%), extras $${((v.baggageFees + v.seatSelection) / v.numTickets).toFixed(2)} (${addonPct.toFixed(0)}%). If this is a round trip: $${(effectivePerTicket / 2).toFixed(2)} per direction. Annual cost if you ${v.numTickets === 1 ? 'take' : 'take'} ${Math.ceil(v.numTickets)} trip${Math.ceil(v.numTickets) > 1 ? 's' : ''}: $${(grandTotal * Math.ceil(v.numTickets)).toFixed(0)}.` },
    ]}
  },
  description: 'Calculate the true cost of a flight including base fare, taxes, baggage fees, and seat selection for multiple passengers. Includes add-on premium analysis, booking timing, and airline comparison tools.',
  formula: 'Total = (Base Fare + Taxes) × Tickets + Baggage + Seat Selection | Effective Per Ticket = Total ÷ Tickets | Breakdown %: Base ÷ Total × 100, Add-on ÷ Total × 100, Tax ÷ Total × 100',
  interpretation: 'Add-on fees (bags, seats, priority boarding) can add 30-80% to the base fare, especially on budget carriers. A "$89" base fare often becomes $200+ after mandatory taxes ($45-85) and baggage ($70-140 round trip). Always compare total round-trip cost not base fare — a traditional airline at $350 all-in may beat a budget airline at $89 + $200 fees. Book 2-6 months ahead, fly Tuesday-Wednesday, and join airline credit card programs for free bags to maximize savings of 20-50%.'
}

export default calcDef
