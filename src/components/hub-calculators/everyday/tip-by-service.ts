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
  defaults: { tbsBill: '75', tbsServiceType: 'restaurant', tbsQuality: 'good', tbsPeople: '2' },
  presets: [
    { label: 'Restaurant Dinner ($75)', values: { tbsBill: '75', tbsServiceType: 'restaurant', tbsQuality: 'good', tbsPeople: '2' } },
    { label: 'Bar Tab ($40)', values: { tbsBill: '40', tbsServiceType: 'bar', tbsQuality: 'good', tbsPeople: '1' } },
    { label: 'Food Delivery ($30)', values: { tbsBill: '30', tbsServiceType: 'delivery', tbsQuality: 'average', tbsPeople: '1' } },
    { label: 'Spa Day ($200)', values: { tbsBill: '200', tbsServiceType: 'spa', tbsQuality: 'excellent', tbsPeople: '1' } },
  ],
  compute: (v) => {
    const tipRates: Record<string, any> = { restaurant: { poor: 10, average: 15, good: 18, excellent: 20 }, bar: { poor: 10, average: 15, good: 18, excellent: 20 }, delivery: { poor: 10, average: 15, good: 18, excellent: 20 }, salon: { poor: 10, average: 15, good: 18, excellent: 20 }, spa: { poor: 10, average: 15, good: 18, excellent: 20 }, hotel: { poor: 2, average: 3, good: 5, excellent: 10 } }
    const rate = tipRates[v.tbsServiceType] && tipRates[v.tbsServiceType][v.tbsQuality] || 15
    const tipAmount = v.tbsBill * (rate / 100)
    const total = v.tbsBill + tipAmount
    const perPerson = total / v.tbsPeople
    return { result: tipAmount, label: 'Recommended Tip', unit: '$', steps: [
      { label: 'Formula', value: 'Tip = Bill × Rate%. Rate depends on service type and quality' },
      { label: 'Service', value: v.tbsServiceType + ' — Quality: ' + v.tbsQuality },
      { label: 'Tip Rate', value: rate + '% (based on ' + v.tbsQuality + ' service)' },
      { label: 'Tip Amount', value: '$' + v.tbsBill.toFixed(2) + ' × ' + rate + '% = $' + tipAmount.toFixed(2) },
      { label: 'Total with Tip', value: '$' + v.tbsBill.toFixed(2) + ' + $' + tipAmount.toFixed(2) + ' = $' + total.toFixed(2) },
      { label: 'Per Person', value: '$' + total.toFixed(2) + ' ÷ ' + v.tbsPeople + ' = $' + perPerson.toFixed(2) },
      { label: 'Cash vs Card', value: rate === 10 ? 'Note: For poor service, consider speaking to the manager first' : '' },
    ] ,
    extras: [
      { label: 'Restaurant Standard', value: '15% average, 18% good, 20% excellent. Tip on pre-tax amount. Large parties (6+): auto-gratuity 18% is common' },
      { label: 'Bar Tipping', value: '$1-2 per drink for simple pours, 15-20% for craft cocktails. Tabs: 15-20% at close. Tip as you go for better service' },
      { label: 'Delivery Drivers', value: '15-20% of order total before fees. $3 minimum tip. In bad weather or for large orders, tip 20-25%. Drivers often rely on tips' },
      { label: 'Salon/Barber', value: '15-20% of service cost. $5 minimum for a $25 haircut. Tip the stylist directly in cash for best results' },
      { label: 'Spa Services', value: '15-20% of service. $100 massage = $15-20 tip. Check if gratuity is already included (common at resort spas)' },
      { label: 'Hotel Housekeeping', value: '$2-5/night, left daily with a note "Housekeeping." $5-10/night for luxury hotels. Leave in an envelope labeled "Thank you"' },
      { label: 'Other Services', value: 'Valet: $2-5. Coat check: $1-2/item. Concierge: $5-20 for special requests. Movers: $20-50/person per day' },
      { label: 'Tipping Abroad', value: 'Many countries include service (Europe: 5-10%, Japan: no tip, Australia/NZ: no tip expected). Research local customs before traveling' },
    ]}
  },
  description: 'Calculate the appropriate tip for any service type — restaurant, bar, delivery, salon, spa, or hotel housekeeping. Adjusts the tip percentage based on service quality and splits among any group size.',
  formula: 'Tip Amount = Bill × Tip Rate (%). Tip rates by service and quality: Restaurant/Bar/Delivery/Salon/Spa — Poor: 10%, Average: 15%, Good: 18%, Excellent: 20%. Hotel Housekeeping — Poor: $2, Average: $3, Good: $5, Excellent: $10 per night.',
  interpretation: 'For a $75 restaurant dinner with good service, tip $13.50 (18%), total $88.50, $44.25 per person. Service quality should be based on factors within the server\'s control: attentiveness, accuracy, and attitude — not kitchen delays or understaffing. When in doubt, 18% is a safe default. For exceptional service, 20-25% is always appreciated.'
}

export default calcDef
