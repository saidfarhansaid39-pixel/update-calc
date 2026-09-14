import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wed2Guests: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wed2TotalBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wed2Venue: z.string().min(1), wed2CateringPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wed2PhotoPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wed2Guests', label: 'Number of Guests', type: 'number', min: 1, step: '10' },
    { name: 'wed2TotalBudget', label: 'Total Budget ($)', type: 'number', min: 1000, step: '1000' },
    { name: 'wed2Venue', label: 'Venue Style', type: 'select', options: [{ label: 'Ballroom/Hotel', value: 'ballroom' }, { label: 'Barn/Rustic', value: 'barn' }, { label: 'Garden/Outdoor', value: 'garden' }, { label: 'Beach', value: 'beach' }, { label: 'Church/Religious', value: 'church' }] },
    { name: 'wed2CateringPct', label: 'Catering (% of budget)', type: 'number', min: 0, max: 70, step: '5' },
    { name: 'wed2PhotoPct', label: 'Photo/Video (% of budget)', type: 'number', min: 0, max: 30, step: '2' },
  ],
  defaults: { wed2Guests: '100', wed2TotalBudget: '30000', wed2Venue: 'ballroom', wed2CateringPct: '30', wed2PhotoPct: '10' },
  presets: [
    { label: 'Elegant Barn Wedding', values: { wed2Guests: '80', wed2TotalBudget: '25000', wed2Venue: 'barn', wed2CateringPct: '35', wed2PhotoPct: '12' } },
    { label: 'City Ballroom Affair', values: { wed2Guests: '120', wed2TotalBudget: '40000', wed2Venue: 'ballroom', wed2CateringPct: '30', wed2PhotoPct: '10' } },
    { label: 'Beach Destination', values: { wed2Guests: '40', wed2TotalBudget: '20000', wed2Venue: 'beach', wed2CateringPct: '25', wed2PhotoPct: '15' } },
  ],
  compute: (v) => {
    const venuePcts: Record<string, number> = { ballroom: 40, barn: 35, garden: 30, beach: 25, church: 20 }
    const venuePct = venuePcts[v.wed2Venue] || 30
    const venueBudget = v.wed2TotalBudget * (venuePct / 100)
    const cateringBudget = v.wed2TotalBudget * (v.wed2CateringPct / 100)
    const photoBudget = v.wed2TotalBudget * (v.wed2PhotoPct / 100)
    const attire = v.wed2TotalBudget * 0.08
    const flowers = v.wed2TotalBudget * 0.07
    const music = v.wed2TotalBudget * 0.06
    const misc = v.wed2TotalBudget * 0.04
    const accounted = venueBudget + cateringBudget + photoBudget + attire + flowers + music
    const remaining = v.wed2TotalBudget - accounted - misc
    const perGuest = v.wed2TotalBudget / v.wed2Guests
    return { result: perGuest, label: 'Cost per Guest', unit: '$', steps: [{ label: 'Venue Style', value: `${v.wed2Venue} (${venuePct}% of budget)` }, { label: 'Venue Budget', value: `${venuePct}% × $${v.wed2TotalBudget.toFixed(0)} = $${venueBudget.toFixed(0)}` }, { label: 'Catering Budget', value: `${v.wed2CateringPct}% × $${v.wed2TotalBudget.toFixed(0)} = $${cateringBudget.toFixed(0)}` }, { label: 'Photo/Video', value: `${v.wed2PhotoPct}% × $${v.wed2TotalBudget.toFixed(0)} = $${photoBudget.toFixed(0)}` }, { label: 'Attire (8%) + Flowers (7%) + Music (6%)', value: `$${attire.toFixed(0)} + $${flowers.toFixed(0)} + $${music.toFixed(0)} = $${(attire + flowers + music).toFixed(0)}` }, { label: 'Misc/Contingency (4%)', value: `$${misc.toFixed(0)}` }, { label: 'Cost per Guest', value: `$${v.wed2TotalBudget.toFixed(0)} ÷ ${v.wed2Guests} = $${perGuest.toFixed(0)}/guest` }, { label: 'Unallocated Balance', value: `$${remaining.toFixed(0)} ($${remaining > 0 ? 'available for upgrades' : 'over budget — reduce some categories'}` }] ,
    extras: [
      { label: 'Venue Cost by Type', value: 'Ballroom/hotel venues typically consume 40% of budget (includes food/beverage minimums). Barn/rustic: 35% (often DIY-friendly). Garden/outdoor: 30% (weather contingency needed). Beach: 25% (permits + travel). Church: 20% (donation-based).' },
      { label: 'Industry Budget Benchmarks', value: 'The Knot 2024 Real Weddings Study: average US wedding $30,000. Breakdown: venue 35%, catering 30%, photo 10%, attire 8%, flowers 7%, music 6%, misc 4%. Per-guest cost ranges $200-400 depending on region and formality.' },
      { label: 'Per-Guest Cost Drivers', value: 'Catering ($80-200/guest), bar ($15-40/guest), rentals ($10-30/guest), favors ($3-10/guest). Each additional 10 guests adds $1,000-3,000 to the total. Reducing guests is the single most effective budget lever — going from 120 to 80 saves $8,000-16,000.' },
      { label: 'Season & Day Savings', value: 'Off-season (Nov-Apr): venues 15-30% cheaper. Friday/Sunday weddings: 10-20% discount vs Saturday. Morning/brunch weddings: 20-40% less than evening receptions. Holiday weekends: avoid — vendors charge premiums.' },
      { label: 'DIY vs Professional', value: 'DIY flowers save 30-50% ($500-1,500). Spotify playlist instead of DJ saves $1,000-2,000. Friend-photographer saves $2,000-4,000 but risks quality. Professional coordinator ($1,500-3,000) often pays for itself in vendor negotiation savings.' },
      { label: 'Contingency Fund Importance', value: 'Always keep 5-10% of budget as contingency. Common overruns: overtime vendor fees ($500-2,000), weather plan B ($500-2,000), last-minute guest additions ($100-300 each), decor upgrades ($200-1,000).' },
      { label: 'Payment Schedule Tips', value: 'Typical vendor deposits: 25-50% at booking, 25-50% mid-way, 25% final 2 weeks before. Never pay 100% upfront. Use credit cards with wedding protections. Have 50% of budget liquid 6 months before, 90% liquid 1 month before.' },
    ]}
  },
  description: 'Plan your wedding budget by allocating funds across venue, catering, photography, attire, flowers, music, and contingency based on total budget and venue style. Get per-guest cost and category-level breakdowns.',
  formula: 'VenueBudget = TotalBudget × VenueStyle%. Attire = Total × 8%, Flowers = Total × 7%, Music = Total × 6%, Misc = Total × 4%. Remaining = Total - (Venue + Catering + Photo + Attire + Flowers + Music + Misc). PerGuest = Total ÷ Guests.',
  interpretation: 'A $30,000 budget for 100 guests at a ballroom venue (40%) yields: venue $12,000, catering $9,000 (30%), photo $3,000 (10%), attire $2,400 (8%), flowers $2,100 (7%), music $1,800 (6%), misc $1,200 (4%) — totaling $31,500, which is $1,500 over budget (5% overage). Per-guest cost is $300. To stay within budget, reduce catering to 28% or trim the guest count to 95. The industry standard is 50% of budget for venue + catering combined. Off-season and Sunday weddings can reduce venue costs by 20-30%, significantly improving budget alignment.'
}

export default calcDef
