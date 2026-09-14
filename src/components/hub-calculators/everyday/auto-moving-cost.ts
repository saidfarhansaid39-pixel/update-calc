import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amcDistMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), amcBedrooms: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), amcTruckSize: z.string().min(1), amcPackingService: z.string().min(1), amcInsuranceType: z.string().min(1) }),
  fields: [
    { name: 'amcDistMiles', label: 'Moving Distance (miles)', type: 'number', min: 1, step: '50' },
    { name: 'amcBedrooms', label: 'Number of Bedrooms', type: 'number', min: 1, step: '1' },
    { name: 'amcTruckSize', label: 'Truck Size Needed', type: 'select', options: [{ label: 'Small (10ft) - Studio/1BR', value: 'small' }, { label: 'Medium (16ft) - 2BR', value: 'medium' }, { label: 'Large (22ft) - 3BR', value: 'large' }, { label: 'Extra Large (26ft) - 4+BR', value: 'xl' }] },
    { name: 'amcPackingService', label: 'Packing Service', type: 'select', options: [{ label: 'Self Pack', value: 'self' }, { label: 'Partial Packing', value: 'partial' }, { label: 'Full Packing Service', value: 'full' }] },
    { name: 'amcInsuranceType', label: 'Insurance Coverage', type: 'select', options: [{ label: 'Basic (included)', value: 'basic' }, { label: 'Full Value ($150)', value: 'full' }, { label: 'Full Value Plus ($300)', value: 'premium' }] },
  ],
  defaults: { amcDistMiles: '100', amcBedrooms: '2', amcTruckSize: 'medium', amcPackingService: 'self', amcInsuranceType: 'basic' },
  presets: [
    { label: 'Studio Local Move', values: { amcDistMiles: '15', amcBedrooms: '1', amcTruckSize: 'small', amcPackingService: 'self', amcInsuranceType: 'basic' } },
    { label: '3BR Cross-Country', values: { amcDistMiles: '1500', amcBedrooms: '3', amcTruckSize: 'large', amcPackingService: 'full', amcInsuranceType: 'premium' } },
    { label: '2BR City Move', values: { amcDistMiles: '5', amcBedrooms: '2', amcTruckSize: 'medium', amcPackingService: 'partial', amcInsuranceType: 'full' } },
    { label: '1BR Partial Pack', values: { amcDistMiles: '200', amcBedrooms: '1', amcTruckSize: 'small', amcPackingService: 'partial', amcInsuranceType: 'basic' } },
  ],
  compute: (v) => {
    const truckCosts: Record<string, number> = { small: 0.8, medium: 1.2, large: 1.6, xl: 2 }
    const truckRate = truckCosts[v.amcTruckSize] || 1.2
    const baseMileage = v.amcDistMiles * truckRate
    const bedroomSurcharge = v.amcBedrooms * 100
    const packingCosts: Record<string, number> = { self: 0, partial: v.amcBedrooms * 150, full: v.amcBedrooms * 350 }
    const packingCost = packingCosts[v.amcPackingService] || 0
    const materialCost = v.amcBedrooms * 75
    const insuranceCosts: Record<string, number> = { basic: 0, full: 150, premium: 300 }
    const insuranceCost = insuranceCosts[v.amcInsuranceType] || 0
    const laborCost = v.amcBedrooms * 200
    const subtotal = baseMileage + bedroomSurcharge + packingCost + materialCost + insuranceCost + laborCost
    const fuelSurcharge = baseMileage * 0.15
    const total = subtotal + fuelSurcharge
    const costPerMile = total / v.amcDistMiles
    const costPerRoom = total / v.amcBedrooms
    return { result: total, label: 'Estimated Moving Cost', unit: '$', steps: [{ label: 'Truck Mileage', value: `${v.amcDistMiles} mi × $${truckRate.toFixed(2)}/mi = $${baseMileage.toFixed(0)}` }, { label: 'Bedroom Surcharge', value: `${v.amcBedrooms} BR × $100 = $${bedroomSurcharge.toFixed(0)}` }, { label: 'Packing Service', value: `$${packingCost.toFixed(0)} (${v.amcPackingService})` }, { label: 'Materials (boxes/tape)', value: `${v.amcBedrooms} BR × $75 = $${materialCost.toFixed(0)}` }, { label: 'Labor (loading/unloading)', value: `${v.amcBedrooms} BR × $200 = $${laborCost.toFixed(0)}` }, { label: 'Insurance', value: `$${insuranceCost.toFixed(0)} (${v.amcInsuranceType})` }, { label: 'Fuel Surcharge (15%)', value: `$${fuelSurcharge.toFixed(0)}` }, { label: 'Total Cost', value: `$${total.toFixed(0)} ($${costPerMile.toFixed(2)}/mi, $${costPerRoom.toFixed(0)}/BR)` }] ,
    extras: [
      { label: 'DIY vs Full Service Comparison', value: `Your estimate: $${total.toFixed(0)}. If you self-pack + self-load, you save ~$${(packingCost + laborCost).toFixed(0)}. DIY truck rental only: ~$${(baseMileage + fuelSurcharge + materialCost).toFixed(0)}. At ${v.amcDistMiles} miles, DIY saves ${packingCost + laborCost > 0 ? ((packingCost + laborCost) / total * 100).toFixed(0) + '%' : 'nothing on labor (already self-pack)'}.` },
      { label: 'Packing Service Value', value: `${v.amcPackingService === 'full' ? 'Full packing ($' + packingCost.toFixed(0) + ') saves you ' + (v.amcBedrooms * 4) + '-20 hours of work.' : v.amcPackingService === 'partial' ? 'Partial packing ($' + packingCost.toFixed(0) + ') covers kitchen + fragile items — the most time-consuming parts.' : 'Self-packing saves $' + (v.amcBedrooms * 350).toFixed(0) + ' but takes ' + (v.amcBedrooms * 2) + '-8 hours of work.'} Professionals pack a kitchen in 1-2 hours vs 4-6 hours DIY.` },
      { label: 'Distance Cost Breakdown', value: `At $${truckRate.toFixed(2)}/mi + 15% fuel surcharge = $${(truckRate * 1.15).toFixed(2)}/mi effective. For ${v.amcDistMiles} miles: $${(truckRate * v.amcDistMiles * 1.15).toFixed(0)} combined. Local moves (<50 mi) are mostly labor; long-distance (>500 mi) is mostly mileage.` },
      { label: 'Truck Size Optimization', value: `${v.amcTruckSize} truck ($${truckRate.toFixed(2)}/mi). Downsizing to ${v.amcTruckSize === 'small' ? 'a smaller trailer' : 'the next size down'} saves $${((truckCosts[v.amcTruckSize] - (v.amcTruckSize === 'xl' ? 1.6 : v.amcTruckSize === 'large' ? 1.2 : v.amcTruckSize === 'medium' ? 0.8 : 0.8)) * v.amcDistMiles).toFixed(0)}. But may require 2 trips $$$.` },
      { label: 'Insurance Risk Assessment', value: `${v.amcInsuranceType === 'basic' ? 'Basic coverage ($0.60/lb) may not cover your $' + (v.amcBedrooms * 5000).toFixed(0) + '+ of belongings. Full Value ($' + insuranceCost.toFixed(0) + ') covers repair/replace at declared value — ~' + (insuranceCost / (v.amcBedrooms * 5000) * 100).toFixed(1) + '% of goods value.' : 'Full Value Plus ($' + insuranceCost.toFixed(0) + ') covers declared value of $' + (v.amcBedrooms * 5000).toFixed(0) + '+ — about ' + (insuranceCost / (v.amcBedrooms * 5000) * 100).toFixed(1) + '% of goods value. Worth it for electronics and furniture.'}` },
      { label: 'Booking Timing', value: `Book 4-6 weeks ahead: 10-15% discount. Last-minute (<1 week): 20-30% premium. Summer (May-Sept): +20-30%. Winter: -10-20%. Your $${total.toFixed(0)} quote could be $${(total * 0.8).toFixed(0)} with off-peak + advanced booking.` },
      { label: 'Declutter Before You Pack', value: `Each bedroom adds ~$${(100 + 75 + 200).toFixed(0)} to your moving cost (surcharge + materials + labor). Decluttering 1 bedroom worth of items before the move saves $${(100 + 75 + 200).toFixed(0)} directly, plus reduces truck size for additional savings.` },
    ]}
  },
  description: 'Calculate your total moving cost including truck rental (by size and mileage), packing service (self, partial, or full), materials, labor, insurance, and fuel surcharge. Optimize by comparing DIY vs full-service and seasonal timing.',
  formula: 'Total = (Distance × Truck Rate) + (Bedrooms × $100) + Packing + (Bedrooms × $75 Materials) + (Bedrooms × $200 Labor) + Insurance + (0.15 × Mileage Cost) | Truck Rates: Small $0.80, Medium $1.20, Large $1.60, XL $2.00/mi',
  interpretation: 'Local moves (under 50 mi) cost $400-2,000 depending on bedrooms. Long-distance moves cost $2,000-10,000+ with most cost in mileage and labor. A 2BR move of 100 miles with self-packing costs ~$1,000-1,500; full-service packing doubles it. The biggest savings levers: declutter (reduce bedrooms worth of stuff), self-pack (saves $150-350/BR), book off-peak (winter, mid-month), and compare insurance options. Moving yourself with a rental truck saves 40-50% but requires significant physical effort. Book 4-6 weeks ahead for best rates.'
}

export default calcDef
