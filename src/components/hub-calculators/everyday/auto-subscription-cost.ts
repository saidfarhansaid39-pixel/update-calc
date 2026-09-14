import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ asubStreaming: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubMusic: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubCloud: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubSoftware: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubBox: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asubGym: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'asubStreaming', label: 'Streaming ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubMusic', label: 'Music ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubCloud', label: 'Cloud Storage ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubSoftware', label: 'Software/Apps ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubBox', label: 'Subscription Boxes ($/mo)', type: 'number', min: 0, step: '5' },
    { name: 'asubGym', label: 'Gym/Membership ($/mo)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { asubStreaming: '50', asubMusic: '10', asubCloud: '10', asubSoftware: '15', asubBox: '20', asubGym: '50' },
  presets: [
    { label: 'Streaming-Heavy Household', values: { asubStreaming: '85', asubMusic: '10', asubCloud: '20', asubSoftware: '10', asubBox: '0', asubGym: '0' } },
    { label: 'Fitness-Focused', values: { asubStreaming: '15', asubMusic: '10', asubCloud: '5', asubSoftware: '5', asubBox: '0', asubGym: '80' } },
    { label: 'Minimalist', values: { asubStreaming: '10', asubMusic: '0', asubCloud: '0', asubSoftware: '0', asubBox: '0', asubGym: '30' } },
    { label: 'Full Digital Suite', values: { asubStreaming: '60', asubMusic: '10', asubCloud: '30', asubSoftware: '50', asubBox: '25', asubGym: '50' } },
  ],
  compute: (v) => {
    const monthlyTotal = v.asubStreaming + v.asubMusic + v.asubCloud + v.asubSoftware + v.asubBox + v.asubGym
    const annualTotal = monthlyTotal * 12
    return { result: monthlyTotal, label: 'Total Monthly Subscriptions', unit: '$', steps: [
      { label: 'Streaming Services', value: `$${v.asubStreaming.toFixed(2)}/mo` },
      { label: 'Music Services', value: `$${v.asubMusic.toFixed(2)}/mo` },
      { label: 'Cloud Storage', value: `$${v.asubCloud.toFixed(2)}/mo` },
      { label: 'Software & Apps', value: `$${v.asubSoftware.toFixed(2)}/mo` },
      { label: 'Subscription Boxes', value: `$${v.asubBox.toFixed(2)}/mo` },
      { label: 'Gym & Memberships', value: `$${v.asubGym.toFixed(2)}/mo` },
      { label: 'Monthly Total', value: `$${v.asubStreaming.toFixed(2)} + $${v.asubMusic.toFixed(2)} + $${v.asubCloud.toFixed(2)} + $${v.asubSoftware.toFixed(2)} + $${v.asubBox.toFixed(2)} + $${v.asubGym.toFixed(2)} = $${monthlyTotal.toFixed(2)}` },
      { label: 'Annual Total', value: `$${monthlyTotal.toFixed(2)} × 12 = $${annualTotal.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Streaming stacking alert", value: "Netflix ($15.49), Hulu ($9.99), Disney+ ($13.99), HBO Max ($15.99), Apple TV+ ($9.99), Peacock ($5.99) — subscribing to 4+ costs $50–80/mo. Rotate: subscribe to 1–2 at a time and binge, then switch. Save $300–600/year." },
      { label: "Music service overlap", value: "Apple Music ($10.99) vs Spotify ($10.99) vs YouTube Music ($9.99) vs Tidal ($10.99). Most offer student plans ($4.99–5.99) and family plans ($14.99–16.99 for 6 accounts). If you only listen passively, use the free ad-supported tier." },
      { label: "Cloud storage cost per GB", value: "iCloud 2TB ($9.99), Google Drive 2TB ($9.99), Dropbox 2TB ($11.99), OneDrive 1TB ($6.99 with Office). Check bundled storage: Office 365 ($69.99/yr) includes 1TB OneDrive + Office apps — often cheaper than standalone." },
      { label: "Software subscription creep", value: "Adobe CC ($54.99), Microsoft 365 ($6.99), Notion ($10), Todoist ($5), Grammarly ($12) — individual apps seem cheap but add up to $50–100/mo. Look for lifetime license alternatives: Affinity (one-time $55) replaces Adobe CC." },
      { label: "Subscription box value audit", value: "Beauty boxes ($15–25/mo), snack boxes ($20–35/mo), clothing rental ($50–160/mo). Many use fillers vs full-size products. Before renewing: is the discovery value worth the monthly cost, or would you rather buy exactly what you want?" },
      { label: "Gym membership utilization", value: "67% of gym memberships go unused (Statista). If you go <2×/week, switch to per-visit ($5–15) or class packages. ClassPass ($15–45/mo) offers flexibility across multiple studios without a full gym commitment." },
      { label: "Annual audit strategy", value: "Every January, list ALL subscriptions and ask: 'Did I use this in the last 30 days?' 'Would I re-subscribe today?' Cancel anything that fails both. Average person saves $25–50/month on their first audit. Use a subscription tracker app (e.g., Bobby, Subby)." },
      { label: "Annual billing discount", value: "Most services offer 15–25% off for paying annually vs monthly. Netflix: no discount. Spotify: $99/yr vs $131/yr (24% off). iCloud: $99/yr vs $120/yr (17% off). Headspace: $69.99/yr vs $119/yr (41% off). Annual billing saves $50–200/year across services." },
    ]}
  },
  description: 'Track and total all your monthly subscriptions — streaming, music, cloud storage, software, subscription boxes, and gym memberships. See your monthly burn rate and annual total instantly.',
  formula: 'MonthlyTotal = Streaming + Music + Cloud + Software + Boxes + Gym | Annual = Monthly × 12',
  interpretation: 'Average American spends $219/month ($2,628/year) on subscriptions. A streaming-heavy household can hit $125/month ($1,500/year). A minimalist with just Netflix and a budget gym spends $40/month ($480/year). Annual billing and rotation cycles can cut costs by 20–30%.'
}

export default calcDef
