import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ pets: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), visitsPerDay: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ratePerVisit: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), days: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'pets', label: 'Number of Pets', type: 'number', min: 1, step: '1' },
    { name: 'visitsPerDay', label: 'Visits per Day', type: 'number', min: 1, step: '1' },
    { name: 'ratePerVisit', label: 'Rate per Visit ($)', type: 'number', min: 10, step: '5' },
    { name: 'days', label: 'Total Days', type: 'number', min: 1, step: '1' },
  ],
  defaults: { pets: '1', visitsPerDay: '2', ratePerVisit: '20', days: '5' },
  presets: [
    { label: 'Weekend Getaway (2 pets)', values: { pets: '2', visitsPerDay: '2', ratePerVisit: '22', days: '3' } },
    { label: 'Work Week (1 cat)', values: { pets: '1', visitsPerDay: '1', ratePerVisit: '18', days: '5' } },
    { label: 'Two-Week Vacation', values: { pets: '1', visitsPerDay: '3', ratePerVisit: '25', days: '14' } },
    { label: 'Holiday Weekend (premium)', values: { pets: '1', visitsPerDay: '2', ratePerVisit: '40', days: '4' } },
  ],
  compute: (v) => {
    const totalVisits = v.visitsPerDay * v.days
    const totalCost = totalVisits * v.ratePerVisit
    const costPerPet = totalCost / v.pets
    const dailyCost = v.visitsPerDay * v.ratePerVisit
    return { result: totalCost, label: 'Total Pet Sitting Cost', unit: '$',
      steps: [
        { label: 'Visits per Day', value: `${v.visitsPerVisit ?? v.visitsPerDay} visits` },
        { label: 'Total Visits', value: `${v.visitsPerDay}/day × ${v.days} days = ${totalVisits} visits` },
        { label: 'Total Cost Calculation', value: `${totalVisits} × $${v.ratePerVisit} = $${totalCost.toFixed(2)}` },
        { label: 'Daily Cost', value: `${v.visitsPerDay} × $${v.ratePerVisit} = $${dailyCost.toFixed(2)}/day` },
        { label: 'Cost per Pet', value: `$${totalCost.toFixed(2)} ÷ ${v.pets} = $${costPerPet.toFixed(2)}` },
        { label: 'Cost per Day per Pet', value: `$${(dailyCost / v.pets).toFixed(2)}` },
        { label: 'Average per Visit', value: `$${v.ratePerVisit.toFixed(2)}` },
        { label: 'Total Duration', value: `${v.days} day(s) = ${(v.days / 7).toFixed(1)} week(s)` },
      ],
      extras: [
        { label: '🐶 Average Pet Sitting Rates (2024)', value: 'Dog walks (30 min): $15-25. Cat visits (20 min): $12-20. Overnight stays: $40-75/night. Holiday rates: 1.5-2× standard. Most sitters charge per visit, not per pet — multiple pets may add $5-10/visit.' },
        { label: '💰 Tipping Your Pet Sitter', value: 'Standard tip: 15-20% of total, or $5-10/visit during holidays. For regular weekly walks, a holiday bonus of 1 week\'s pay is customary. Cash tips are preferred.' },
        { label: '📱 Pet Sitting Platforms', value: 'Rover and Wag! take 15-25% commission from sitters. Booking directly with a local sitter saves 15-25%. Always ask for references and insurance (bonded/insured sitters cost 10-20% more).' },
        { label: '🔑 Meet & Greet Before Booking', value: 'Always schedule a free meet & greet. The sitter should meet your pet, learn routines, get emergency contacts, and see where supplies are. Most quality sitters require this before first booking.' },
        { label: '📋 What a Visit Typically Includes', value: 'Feeding, fresh water, medication if needed, litter box scooping/walks, playtime, and a photo/text update. Additional services: mail collection, plant watering, trash bins — often included free.' },
        { label: '🏥 Emergency Planning', value: 'Provide your vet\'s contact info, emergency vet 24-hr clinic, and a signed authorization for emergency care. Many sitters require this before service. Have a backup person if sitter cancels.' },
        { label: '🎄 Holiday Booking Tips', value: 'Book 2-4 weeks ahead for holidays (Thanksgiving, Christmas, New Year\'s, July 4). Many sitters charge premium rates (1.5-2×) and require minimum booking days (e.g., 4-day minimum for Thanksgiving).' },
        { label: '🔄 Recurring vs One-Time', value: 'Recurring weekly visits are often 10-20% cheaper than one-off bookings. Some sitters offer discounted packages (10 visits for $180 vs $20 each). Regular sitters know your pet\'s routines and health baselines.' },
      ]
    }
  },
  description: 'Calculate the total cost of pet sitting services including daily visits, per-visit rates, multi-pet fees, and trip duration. Get per-pet and daily cost breakdowns.',
  formula: 'Total Visits = Visits/Day × Days | Total Cost = Total Visits × Rate/Visit | Cost per Pet = Total Cost ÷ Number of Pets | Daily Cost = Visits/Day × Rate/Visit',
  interpretation: 'Pet sitting costs vary significantly by location, number of pets, and services required. Average rates (2024): dog walks $15-25/30-min visit, cat visits $12-20, overnight $40-75. Most sitters charge per visit, not per pet, but add $5-10 for additional pets. Holiday rates are 1.5-2× standard. Booking platforms like Rover charge 15-25% commission — booking directly with a local sitter can save 15-25%. Always do a meet & greet before booking, and tip 15-20% (or $5-10/visit during holidays).'
}

export default calcDef
