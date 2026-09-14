import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ vb2Transport: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Lodging: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Food: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Activities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Souvenirs: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), vb2Travelers: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), vb2Days: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'vb2Transport', label: 'Transportation ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Lodging', label: 'Lodging ($)', type: 'number', min: 0, step: '200' },
    { name: 'vb2Food', label: 'Food & Drinks ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Activities', label: 'Activities/Excursions ($)', type: 'number', min: 0, step: '100' },
    { name: 'vb2Souvenirs', label: 'Souvenirs/Shopping ($)', type: 'number', min: 0, step: '50' },
    { name: 'vb2Travelers', label: 'Number of Travelers', type: 'number', min: 1, step: '1' },
    { name: 'vb2Days', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
  ],
  defaults: { vb2Transport: '800', vb2Lodging: '1500', vb2Food: '800', vb2Activities: '400', vb2Souvenirs: '200', vb2Travelers: '2', vb2Days: '7' },
  presets: [
    { label: 'Solo Backpacker', values: { vb2Transport: '300', vb2Lodging: '500', vb2Food: '350', vb2Activities: '200', vb2Souvenirs: '50', vb2Travelers: '1', vb2Days: '7' } },
    { label: 'Couples Resort Stay', values: { vb2Transport: '600', vb2Lodging: '2000', vb2Food: '1000', vb2Activities: '500', vb2Souvenirs: '300', vb2Travelers: '2', vb2Days: '5' } },
    { label: 'Family Road Trip', values: { vb2Transport: '500', vb2Lodging: '1200', vb2Food: '1000', vb2Activities: '600', vb2Souvenirs: '200', vb2Travelers: '4', vb2Days: '8' } },
  ],
  compute: (v) => {
    const subtotal = v.vb2Transport + v.vb2Lodging + v.vb2Food + v.vb2Activities + v.vb2Souvenirs
    const emergencyFund = subtotal * 0.1
    const total = subtotal + emergencyFund
    const perPerson = total / v.vb2Travelers
    const perDay = total / v.vb2Days
    const pctTransport = total > 0 ? (v.vb2Transport / total) * 100 : 0
    const pctLodging = total > 0 ? (v.vb2Lodging / total) * 100 : 0
    const pctFood = total > 0 ? (v.vb2Food / total) * 100 : 0
    return { result: total, label: 'Total Vacation Budget', unit: '$', steps: [{ label: 'Transportation', value: `$${v.vb2Transport.toFixed(2)} (${pctTransport.toFixed(0)}%)` }, { label: 'Lodging', value: `$${v.vb2Lodging.toFixed(2)} (${pctLodging.toFixed(0)}%)` }, { label: 'Food & Drinks', value: `$${v.vb2Food.toFixed(2)} (${pctFood.toFixed(0)}%)` }, { label: 'Activities & Excursions', value: `$${v.vb2Activities.toFixed(2)}` }, { label: 'Souvenirs & Shopping', value: `$${v.vb2Souvenirs.toFixed(2)}` }, { label: 'Emergency Fund (10%)', value: `+$${emergencyFund.toFixed(2)}` }, { label: 'Total Trip Cost', value: `$${total.toFixed(2)}` }, { label: 'Per Person / Per Day', value: `$${perPerson.toFixed(2)}/person, $${perDay.toFixed(2)}/day` }] ,
    extras: [
      { label: 'Standard Budget Allocation', value: 'Typical vacation budget: transport 25-35%, lodging 30-40%, food 15-25%, activities 10-15%, souvenirs 5-10%. Adjust based on trip type — road trips spend more on transport, resort stays spend more on lodging, cruises bundle most categories.' },
      { label: 'Per-Day Cost Benchmarks', value: 'Budget travel: $75-150/person/day. Mid-range: $150-300/person/day. Luxury: $300-800+/person/day. A 7-day mid-range trip for 2 people: $2,100-4,200 total. Regional variation: Southeast Asia $50-100/day, Europe $150-400/day, Caribbean $200-500/day.' },
      { label: 'Travel Insurance Value', value: 'Travel insurance costs 4-10% of total trip. Covers: trip cancellation ($50k+), medical evacuation ($100k+), lost baggage ($1,500-3,000), delay reimbursement. For international trips, medical insurance is essential — US health plans rarely cover overseas. Cruise insurance is highly recommended.' },
      { label: 'Saving for Vacation', value: 'Start a dedicated travel fund 6-12 months before. Save 15-20% of trip cost monthly. Use a high-yield savings account (4-5% APY). Set up automatic transfers. If trip costs $3,000 for 2 people: save $250-500/month for 6-12 months.' },
      { label: 'Money-Saving Travel Tips', value: 'Fly midweek (Tue-Wed) save 20-30%. Cook some meals (saves $20-40/day). Free walking tours (tip-based). City passes for attractions (save 20-40%). Use public transit vs taxis (saves $10-30/day). Eat street food for local flavor at half the restaurant cost.' },
      { label: 'Travel Credit Card Benefits', value: 'Premium travel cards (Chase Sapphire, Capital One Venture): 2-3× points on travel, $300-500 annual fee often offset by credits. Benefits: airport lounge access, TSA PreCheck/Global Entry credit ($100), travel insurance, no foreign transaction fees. Sign-up bonuses: 60,000-100,000 points = $600-1,000 in travel.' },
      { label: 'Post-Trip Budget Review', value: 'After your trip, compare actual spending to this budget. Common differences: activities cost 20-40% more than planned, souvenirs 50% more, food often on target or slightly over. Use the data to refine your next trip budget. Most travelers underspend on emergency fund.' },
    ]}
  },
  description: 'Calculate a complete vacation budget across transport, lodging, food, activities, and souvenirs with a 10% emergency fund. Get per-person, per-day, and percentage breakdowns for any trip type and group size.',
  formula: 'Total = Transport + Lodging + Food + Activities + Souvenirs + (Subtotal × 10%). PerPerson = Total ÷ Travelers. PerDay = Total ÷ Days. Category% = CategoryCost ÷ Total × 100.',
  interpretation: 'A 7-day trip for 2 people with $800 transport, $1,500 lodging, $800 food, $400 activities, $200 souvenirs: subtotal $3,700, emergency fund $370, total $4,070. That\'s $581/person or $581/day total. The breakdown: transport 20%, lodging 37%, food 20%, activities 10%, souvenirs 5%, emergency 9%. Lodging dominates at 37% — typical for destination trips. To reduce costs: choose mid-range lodging ($150 vs $200/night saves $350), eat two budget meals/day (saves $200), and limit souvenirs. The 10% emergency fund provides a realistic buffer for tips ($100-200), unexpected transport ($50-100), and last-minute activity add-ons ($100-300).'
}

export default calcDef
