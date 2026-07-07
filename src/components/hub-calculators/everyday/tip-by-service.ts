import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ tbsBill: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tbsServiceType: z.string().min(1), tbsQuality: z.string().min(1), tbsPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'tbsBill', label: 'Bill Amount ($)', type: 'number', min: 1, step: '10' },
    { name: 'tbsServiceType', label: 'Service Type', type: 'select', options: [{ label: 'Restaurant Sit-Down', value: 'restaurant' }, { label: 'Bar/Pub', value: 'bar' }, { label: 'Food Delivery', value: 'delivery' }, { label: 'Hair Salon/Barber', value: 'salon' }, { label: 'Spa/Massage', value: 'spa' }, { label: 'Hotel Housekeeping', value: 'hotel' }] },
    { name: 'tbsQuality', label: 'Service Quality', type: 'select', options: [{ label: 'Poor', value: 'poor' }, { label: 'Average', value: 'average' }, { label: 'Good', value: 'good' }, { label: 'Excellent', value: 'excellent' }] },
    { name: 'tbsPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => {
    const tipRates: Record<string, any> = { restaurant: { poor: 10, average: 15, good: 18, excellent: 20 }, bar: { poor: 10, average: 15, good: 18, excellent: 20 }, delivery: { poor: 10, average: 15, good: 18, excellent: 20 }, salon: { poor: 10, average: 15, good: 18, excellent: 20 }, spa: { poor: 10, average: 15, good: 18, excellent: 20 }, hotel: { poor: 2, average: 3, good: 5, excellent: 10 } }
    const rate = tipRates[v.tbsServiceType] && tipRates[v.tbsServiceType][v.tbsQuality] || 15
    const tipAmount = v.tbsBill * (rate / 100)
    const total = v.tbsBill + tipAmount
    const perPerson = total / v.tbsPeople
    return { result: tipAmount, label: 'Recommended Tip', unit: '$', steps: [{ label: 'Service', value: v.tbsServiceType }, { label: 'Quality/Rate', value: v.tbsQuality + ' (' + rate + '%)' }, { label: 'Tip Amount', value: '$' + tipAmount.toFixed(2) }, { label: 'Total with Tip', value: '$' + total.toFixed(2) }, { label: 'Per Person', value: '$' + perPerson.toFixed(2) }] }
  },
  description: 'Calculate the appropriate tip based on service type, quality level, and number of people. Service-specific tipping guidelines.',
  formula: 'Tip = Bill x Rate% | Rate varies by service: Restaurant 15-20%, Delivery 15-20%, Salon 15-20%, Hotel $2-10/night',
  interpretation: 'Restaurant: 15-20% pre-tax. Bar: $1-2/drink or 15-20%. Delivery: 15-20%. Salon/Spa: 15-20%. Hotel housekeeping: $2-5/night. Valet: $2-5. Always tip in cash when possible for service workers.'
}

export default calcDef
