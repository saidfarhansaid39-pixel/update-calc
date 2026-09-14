import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wbc3GuestCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wbc3PerGuestCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wbc3Attire: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Photo: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Music: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Flowers: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wbc3Misc: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'wbc3GuestCount', label: 'Number of Guests', type: 'number', min: 1, step: '10' },
    { name: 'wbc3PerGuestCost', label: 'Cost per Guest ($)', type: 'number', min: 10, step: '25' },
    { name: 'wbc3Attire', label: 'Attire ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Photo', label: 'Photography/Video ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Music', label: 'Music/Entertainment ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Flowers', label: 'Flowers/Decor ($)', type: 'number', min: 0, step: '500' },
    { name: 'wbc3Misc', label: 'Miscellaneous ($)', type: 'number', min: 0, step: '500' },
  ],
  defaults: { wbc3GuestCount: '100', wbc3PerGuestCost: '200', wbc3Attire: '2000', wbc3Photo: '3000', wbc3Music: '1500', wbc3Flowers: '1500', wbc3Misc: '1000' },
  presets: [
    { label: 'Intimate Backyard Wedding', values: { wbc3GuestCount: '40', wbc3PerGuestCost: '80', wbc3Attire: '500', wbc3Photo: '1500', wbc3Music: '500', wbc3Flowers: '300', wbc3Misc: '500' } },
    { label: 'Moderate Ballroom Wedding', values: { wbc3GuestCount: '100', wbc3PerGuestCost: '200', wbc3Attire: '2000', wbc3Photo: '3000', wbc3Music: '1500', wbc3Flowers: '1500', wbc3Misc: '1000' } },
    { label: 'Large Traditional Wedding', values: { wbc3GuestCount: '160', wbc3PerGuestCost: '250', wbc3Attire: '4000', wbc3Photo: '5000', wbc3Music: '3000', wbc3Flowers: '2500', wbc3Misc: '2000' } },
  ],
  compute: (v) => {
    const guestTotal = v.wbc3GuestCount * v.wbc3PerGuestCost
    const total = guestTotal + v.wbc3Attire + v.wbc3Photo + v.wbc3Music + v.wbc3Flowers + v.wbc3Misc
    const pctGuests = total > 0 ? (guestTotal / total) * 100 : 0
    const pctAttire = total > 0 ? (v.wbc3Attire / total) * 100 : 0
    const pctPhoto = total > 0 ? (v.wbc3Photo / total) * 100 : 0
    const pctMusic = total > 0 ? (v.wbc3Music / total) * 100 : 0
    const pctFlowers = total > 0 ? (v.wbc3Flowers / total) * 100 : 0
    const pctMisc = total > 0 ? (v.wbc3Misc / total) * 100 : 0
    return { result: total, label: 'Total Wedding Cost', unit: '$', steps: [{ label: 'Guest Catering', value: `${v.wbc3GuestCount} × $${v.wbc3PerGuestCost} = $${guestTotal.toFixed(0)} (${pctGuests.toFixed(0)}%)` }, { label: 'Attire', value: `$${v.wbc3Attire.toFixed(0)} (${pctAttire.toFixed(0)}%)` }, { label: 'Photography/Video', value: `$${v.wbc3Photo.toFixed(0)} (${pctPhoto.toFixed(0)}%)` }, { label: 'Music/Entertainment', value: `$${v.wbc3Music.toFixed(0)} (${pctMusic.toFixed(0)}%)` }, { label: 'Flowers/Decor', value: `$${v.wbc3Flowers.toFixed(0)} (${pctFlowers.toFixed(0)}%)` }, { label: 'Miscellaneous', value: `$${v.wbc3Misc.toFixed(0)} (${pctMisc.toFixed(0)}%)` }, { label: 'Grand Total', value: `$${total.toFixed(0)}` }, { label: 'Cost per Guest', value: total > 0 && v.wbc3GuestCount > 0 ? `$${(total / v.wbc3GuestCount).toFixed(0)}/guest` : 'N/A' }] ,
    extras: [
      { label: 'Guest Count Impact', value: 'Guests are the biggest cost driver — reducing from 100 to 60 saves $8,000-12,000. The average per-guest cost in 2024 was $280. Each additional 10 guests adds $2,000-3,000 to the total budget.' },
      { label: 'Seasonal Pricing', value: 'Peak wedding season (May-October) costs 20-30% more for venues and vendors. Off-season (November-April) or Sunday/Friday weddings save 15-30%. Holiday weekends often have minimum spend requirements.' },
      { label: 'Category Cost Benchmarks', value: 'Typical US wedding budget breakdown: venue/catering 40-50%, photography 10-12%, attire 8-10%, flowers/decor 7-10%, music/entertainment 6-8%, invitations 2-3%, misc 5-10%. Adjust proportions based on your priorities.' },
      { label: 'Photo vs Video Investment', value: 'Photography is the one category couples rarely regret spending on. Average wedding photography: $2,500-5,000. Videography adds $1,500-3,000. Hiring for 8 hours vs full day saves $500-1,000. Engagement shoots often included.' },
      { label: 'DIY Savings Opportunities', value: 'DIY flowers save 30-50% over professional florists. Spotify playlists instead of live band save $1,000-3,000. Digital-only invitations save $500-1,000. Friend-officiant saves $300-800. Each DIY choice saves meaningful money.' },
      { label: 'Vendor Booking Timeline', value: 'Popular vendors book 9-12 months ahead. Venue: 12-18 months. Photographer: 10-14 months. Caterer: 8-12 months. Band/DJ: 8-10 months. Last-minute bookings (2-4 months out) may pay 15-25% premium for available vendors.' },
      { label: 'Honeymoon Budget Planning', value: 'Average honeymoon cost: $5,000 (domestic) to $8,000 (international). Budget 10-15% of total wedding cost. Book flights 3-4 months ahead for best rates. All-inclusive resorts simplify budgeting. Consider delaying honeymoon 1-3 months for off-season pricing.' },
    ]}
  },
  description: 'Calculate total wedding cost from guest count, per-person expenses, attire, photography, music, flowers, and miscellaneous items. Get a full percentage breakdown by category to understand where your money is going.',
  formula: 'Total = Guests × PerGuestCost + Attire + Photo + Music + Flowers + Misc. Category% = CategoryCost ÷ Total × 100. CostPerGuest = Total ÷ GuestCount. The guest-catering line typically represents 40-50% of total wedding spend.',
  interpretation: 'A 100-guest wedding at $200/guest with $2,000 attire, $3,000 photo, $1,500 music, $1,500 flowers, and $1,000 misc totals $29,000 — or $290/guest. Guest catering is the dominant cost at 69% of total. The national average wedding cost in 2024 was $30,000 (excluding honeymoon). Reducing guests from 100 to 60 with proportional cuts brings the total to ~$18,000, a 38% savings. The single most effective cost-control strategy is trimming the guest list — every guest removed saves $150-300 in direct costs and reduces venue size, staffing, and rental requirements.'
}

export default calcDef
