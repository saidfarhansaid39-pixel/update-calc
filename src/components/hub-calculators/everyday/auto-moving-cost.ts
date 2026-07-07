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
    return { result: total, label: 'Estimated Moving Cost', unit: '$', steps: [{ label: 'Truck/Mileage', value: `$${baseMileage.toFixed(0)}` }, { label: 'Bedroom Surcharge', value: `$${bedroomSurcharge.toFixed(0)}` }, { label: 'Packing + Materials', value: `$${(packingCost + materialCost).toFixed(0)}` }, { label: 'Labor (loading/unloading)', value: `$${laborCost.toFixed(0)}` }, { label: 'Insurance', value: `$${insuranceCost.toFixed(0)}` }, { label: 'Fuel Surcharge', value: `$${fuelSurcharge.toFixed(0)}` }, { label: 'Total Cost', value: `$${total.toFixed(0)}` }] }
  },
  description: 'Calculate your total moving cost including truck rental, packing services, materials, labor, and insurance. Get a complete estimate for local or long-distance moves.',
  formula: 'Total = (Distance × Truck Rate) + Bedroom Surcharge + Packing + Materials + Labor + Insurance + Fuel',
  interpretation: 'Local moves (under 50 mi): $300-1500. Long-distance: $2000-8000. Moving yourself saves 40-50% but factor in truck rental, fuel ($0.80-2/mi), and equipment. Book 4-6 weeks ahead for best rates. Summer moves cost 20-30% more.'
}

export default calcDef
