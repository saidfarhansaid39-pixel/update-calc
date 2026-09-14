import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ rooms: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), binsPerRoom: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), shelving: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), labels: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hourlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'rooms', label: 'Rooms to Organize', type: 'number', min: 1, step: '1' },
    { name: 'binsPerRoom', label: 'Storage Bins per Room', type: 'number', min: 0, step: '1' },
    { name: 'shelving', label: 'Shelving Units', type: 'number', min: 0, step: '1' },
    { name: 'labels', label: 'Label Packs', type: 'number', min: 0, step: '1' },
    { name: 'hourlyRate', label: 'Organizer Hourly Rate ($)', type: 'number', min: 0, step: '5' },
    { name: 'hours', label: 'Hours of Labor', type: 'number', min: 0, step: '1' },
  ],
  defaults: { rooms: "5", binsPerRoom: "3", shelving: "2", labels: "3", hourlyRate: "65", hours: "10" },
  presets: [
    { label: "Small Bedroom Closet", values: { rooms: "1", binsPerRoom: "5", shelving: "1", labels: "1", hourlyRate: "50", hours: "4" } },
    { label: "Home Office + Closet", values: { rooms: "2", binsPerRoom: "4", shelving: "2", labels: "2", hourlyRate: "65", hours: "8" } },
    { label: "Full House Organization", values: { rooms: "6", binsPerRoom: "4", shelving: "4", labels: "4", hourlyRate: "75", hours: "24" } },
    { label: "Garage Workshop", values: { rooms: "1", binsPerRoom: "8", shelving: "3", labels: "2", hourlyRate: "60", hours: "12" } },
  ],
  compute: (v) => { const r = v.rooms; const bins = v.binsPerRoom * r; const binCost = bins * 8; const shelfCost = v.shelving * 45; const labelCost = v.labels * 6; const laborCost = v.hourlyRate * v.hours; const total = binCost + shelfCost + labelCost + laborCost; const diySavings = v.hourlyRate * v.hours; const perRoomCost = total / r; const suppliesPct = total > 0 ? ((binCost + shelfCost + labelCost) / total) * 100 : 0; const laborPct = total > 0 ? (laborCost / total) * 100 : 0; return { result: total, label: 'Total Organization Cost', unit: '$', steps: [{ label: 'Rooms to Organize', value: `${r}` }, { label: 'Storage Bins Needed', value: `${bins} × $8 = $${binCost.toFixed(0)}` }, { label: 'Shelving Units', value: `${v.shelving} × $45 = $${shelfCost.toFixed(0)}` }, { label: 'Label Packs', value: `${v.labels} × $6 = $${labelCost.toFixed(0)}` }, { label: 'Professional Labor', value: `${v.hours} hrs × $${v.hourlyRate}/hr = $${laborCost.toFixed(0)}` }, { label: 'Total Cost', value: `$${total.toFixed(0)}` }, { label: 'Cost per Room', value: `$${perRoomCost.toFixed(0)}/room` }, { label: 'DIY Would Save', value: `$${diySavings.toFixed(0)} (${laborPct.toFixed(0)}% is labor)` }] ,
    extras: [
      { label: "Professional Organizer Rates", value: "National average: $50-100/hr. Major metro areas (NYC, LA, SF): $75-150/hr. Most organizers offer a free 30-min consultation." },
      { label: "DIY vs Professional ROI", value: "DIY cost: supplies only ($50-300 for a room). Professional: supplies + $200-1,000+ labor per room. Pros complete in 1-2 days vs DIY taking 2-4 weekends." },
      { label: "Decluttering First Rule", value: "Sort everything into Keep, Donate, Trash, Relocate before buying any storage supplies. You'll typically eliminate 30-50% of items, reducing bins and shelving needed." },
      { label: "Best Budget Storage Brands", value: "Bins: Sterilite ($5-12) and IRIS ($8-20). Shelving: Rubbermaid FastTrack ($50-100), IKEA Kallax ($70-200). Labels: label maker ($20-40) + tape ($5-15)." },
      { label: "The KonMari Method", value: "Organize by category (clothing → books → papers → komono → sentimental), not by room. Visualize your ideal lifestyle before discarding anything." },
      { label: "Maintenance Systems", value: "The one-in-one-out rule prevents re-cluttering. Schedule 15-min daily tidy sessions. A well-organized home stays organized with 10 min/day maintenance vs hours of re-sorting." },
      { label: "Donation Tax Deductions", value: "Donated items in good condition are tax-deductible at fair market value. Use IRS Form 8283 for donations over $500. Apps like ItsDeductible help track value." },
      { label: "Common Organization Mistakes", value: "Buying bins before decluttering (waste of money) | Over-labeling (too rigid, hard to maintain) | Vertical space underutilized | Insufficient lighting in closets/pantries" },
    ]} },
  description: 'Estimate the full cost of organizing your home — from storage bins and shelving to professional organizer labor. Compare DIY vs professional and see the cost breakdown per room.',
  formula: 'Total = (Rooms × Bins/Room × $8) + (Shelving × $45) + (Labels × $6) + (Hours × Hourly Rate) | Cost per Room = Total ÷ Rooms',
  interpretation: 'A whole-house organization project for a typical 5-room home with a professional organizer costs $800-2,000 total — roughly $160-400 per room. Labor typically accounts for 60-80% of this cost. DIY organizing cuts the cost by the labor portion but requires significant time and discipline. The single most important step before spending any money on bins or shelving is to declutter first: remove everything, sort into Keep/Donate/Trash, and only then measure and buy storage solutions. Most homes need 30-50% less storage after proper decluttering.'
}

export default calcDef
