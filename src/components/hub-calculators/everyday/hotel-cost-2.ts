import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ nights: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), nightRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), resortFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), parking: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dining: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'nights', label: 'Number of Nights', type: 'number', min: 1, step: '1' },
    { name: 'nightRate', label: 'Nightly Room Rate ($)', type: 'number', min: 0, step: '25' },
    { name: 'taxRate', label: 'Hotel Tax Rate (%)', type: 'number', min: 0, step: '1' },
    { name: 'resortFee', label: 'Resort/Daily Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'parking', label: 'Daily Parking ($)', type: 'number', min: 0, step: '5' },
    { name: 'dining', label: 'Daily Dining/Incidentals ($)', type: 'number', min: 0, step: '20' },
  ],
  defaults: { nights: "3", nightRate: "200", taxRate: "14", resortFee: "35", parking: "25", dining: "60" },
  presets: [
    { label: "Budget Road Trip", values: { nights: "2", nightRate: "80", taxRate: "12", resortFee: "0", parking: "0", dining: "40" } },
    { label: "Business Trip", values: { nights: "3", nightRate: "250", taxRate: "16", resortFee: "0", parking: "45", dining: "80" } },
    { label: "Beach Resort Vacation", values: { nights: "5", nightRate: "350", taxRate: "12", resortFee: "45", parking: "20", dining: "100" } },
    { label: "City Weekend Getaway", values: { nights: "2", nightRate: "180", taxRate: "16", resortFee: "25", parking: "50", dining: "70" } },
  ],
  compute: (v) => { const baseRoom = v.nightRate * v.nights; const taxes = baseRoom * (v.taxRate / 100); const fees = v.resortFee * v.nights; const park = v.parking * v.nights; const dine = v.dining * v.nights; const total = baseRoom + taxes + fees + park + dine; const totalBeforeFees = baseRoom + taxes; const hiddenFeesPct = total > 0 ? ((fees + park) / total) * 100 : 0; const effectiveNightly = total / v.nights; return { result: total, label: 'Total Hotel Cost', unit: '$', steps: [{ label: 'Room Charges', value: `$${baseRoom.toFixed(0)} (${v.nights} nights × $${v.nightRate})` }, { label: 'Hotel Taxes', value: `$${taxes.toFixed(0)} (${v.taxRate}% rate)` }, { label: 'Resort/Daily Fees', value: `$${fees.toFixed(0)} ($${v.resortFee}/night)` }, { label: 'Parking', value: `$${park.toFixed(0)} ($${v.parking}/night)` }, { label: 'Dining & Incidentals', value: `$${dine.toFixed(0)}` }, { label: 'Grand Total', value: `$${total.toFixed(0)}` }, { label: 'Effective Nightly Rate', value: `$${effectiveNightly.toFixed(0)}/night ($${(v.nightRate).toFixed(0)} advertised)` }, { label: 'Hidden Fees Share', value: `${hiddenFeesPct.toFixed(0)}% of total is fees + parking` }] ,
    extras: [
      { label: "Hotel Tax Rates by City", value: "NYC: 14.75% + $3.50/night | Chicago: 17.4% | Houston: 17% | LA: 14% | London: 20% VAT | Paris: 10% + €1-5/night tourist tax" },
      { label: "Resort Fee Warning", value: "Resort fees are mandatory charges for amenities you may not use (pool, gym, wifi). Average $25-50/night. Always check total price before booking — they are often not included in the advertised rate." },
      { label: "Parking Cost Guide", value: "Self-park: $15-30/night (suburban) to $40-70/night (urban). Valet: add $10-20/night. Compare nearby garages for long stays — they can be 50-70% cheaper than hotel parking." },
      { label: "Loyalty Program Value", value: "Marriott Bonvoy, Hilton Honors, IHG Rewards: 10-20 points per dollar spent. Free night typically requires 15,000-50,000 points. Elite status adds perks: late checkout, room upgrades, free breakfast." },
      { label: "Booking Channel Comparison", value: "Direct booking often includes best rate guarantee, free breakfast, or loyalty points. OTAs (Expedia, Booking) may be 5-15% cheaper but harder to modify/cancel. Always check cancellation policies." },
      { label: "Incidentals Budget", value: "Hotels place a hold of $50-200/night for incidentals on your credit card. This is released at checkout but can tie up credit limit during your stay." },
      { label: "Seasonal Pricing Impact", value: "Hotel rates vary 2-3× between off-peak and peak season. Example: beach resort $150/night in November vs $450/night in July. City hotels: cheaper weekends (business) vs cheaper weekdays (leisure)." },
      { label: "All-Inclusive vs A La Carte", value: "All-inclusive resorts bundle meals, drinks, activities at $200-600+/night. Break-even analysis: add your total dining + activities estimate vs all-inclusive premium to decide." },
    ]} },
  description: 'Calculate the true total cost of a hotel stay including hidden resort fees, parking, taxes, and dining. See the effective nightly rate versus the advertised rate.',
  formula: 'Total = (Nights × Rate) + (Rate × Nights × Tax%) + Nights × (Resort Fee + Parking + Dining) | Effective Nightly = Total ÷ Nights',
  interpretation: 'The advertised room rate can be 25-45% lower than your actual nightly cost after taxes, resort fees, and parking are added. A $200/night room in a city with 16% tax, $35 resort fee, and $30 parking becomes effectively $297/night. Hotel taxes vary dramatically by city — from <10% in some suburbs to >17% in major metros like Chicago and Houston. Resort fees have become ubiquitous even at non-resort city hotels, often covering amenities you may not use. Always check the total price (including all fees and taxes) before comparing hotels, and consider nearby parking alternatives which can save $20-40/night.'
}

export default calcDef
