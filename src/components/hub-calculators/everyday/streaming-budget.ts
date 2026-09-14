import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ streamingServices: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerService: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hboCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), sportsPkg: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'streamingServices', label: 'Number of Basic Services', type: 'number', min: 1, step: '1' },
    { name: 'costPerService', label: 'Avg Cost per Service ($)', type: 'number', min: 5, step: '5' },
    { name: 'hboCost', label: 'Premium Add-on ($)', type: 'number', min: 0, step: '5' },
    { name: 'sportsPkg', label: 'Sports/Live TV ($)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { streamingServices: '3', costPerService: '12', hboCost: '15', sportsPkg: '10' },
  presets: [
    { label: 'Cord Cutter', values: { streamingServices: '3', costPerService: '12', hboCost: '0', sportsPkg: '0' } },
    { label: 'Premium Streamer', values: { streamingServices: '4', costPerService: '15', hboCost: '15', sportsPkg: '10' } },
    { label: 'Sports Fan', values: { streamingServices: '2', costPerService: '10', hboCost: '0', sportsPkg: '80' } },
    { label: 'Budget Conscious', values: { streamingServices: '1', costPerService: '10', hboCost: '0', sportsPkg: '0' } },
  ],
  compute: (v) => {
    const basicTotal = v.streamingServices * v.costPerService
    const monthlyTotal = basicTotal + v.hboCost + v.sportsPkg
    const annualTotal = monthlyTotal * 12
    const cableAvg = 120
    const savingsVsCable = cableAvg - monthlyTotal
    return { result: monthlyTotal, label: 'Monthly Streaming Cost', unit: '$', steps: [{ label: 'Basic Services', value: `${v.streamingServices} × $${v.costPerService.toFixed(2)} = $${basicTotal.toFixed(2)}` }, { label: 'Premium Add-ons', value: `+$${v.hboCost.toFixed(2)}` }, { label: 'Sports/Live TV', value: `+$${v.sportsPkg.toFixed(2)}` }, { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)}` }, { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` }, { label: savingsVsCable >= 0 ? 'Savings vs Cable' : 'More than Cable', value: savingsVsCable >= 0 ? `Save $${savingsVsCable.toFixed(2)}/mo` : `$${Math.abs(savingsVsCable).toFixed(2)}/mo more than cable` }] ,
    extras: [
      { label: 'Cable Comparison Baseline', value: 'Average cable TV costs $120/mo (2024). Streaming 3-4 services averages $50-80/mo — saving $40-70/mo vs traditional cable' },
      { label: 'Service Rotation Strategy', value: 'Cycling 1-2 services per month instead of keeping all active saves 40-60% annually. Most major shows remain in libraries' },
      { label: 'Free Ad-Supported TV (FAST)', value: 'Pluto TV, Tubi, Freevee, Peacock Free, Roku Channel, Sling Free — 300+ free channels with ads, no subscription needed' },
      { label: 'Price Hike Trend', value: 'Major streaming services raised prices 15-25% in 2023-2024. Netflix: $6.99→$11.99 (ads-free). Disney+: $7.99→$13.99' },
      { label: 'Phone Carrier Bundles', value: 'T-Mobile: Netflix on Us, Apple TV+. Verizon: Disney+ Bundle. AT&T: HBO Max included. Check your wireless plan for free services' },
      { label: 'Library Card Streaming', value: 'Kanopy and Hoopla offer free movies/TV with a library card. Most US libraries participate — up to 10 free streams/month' },
      { label: 'Student/Military Discounts', value: 'Students save 50%+ on Spotify+Hulu, Apple Music, YouTube Premium, Amazon Prime. Military/VA discounts available on most platforms' },
    ]}
  },
  description: 'Calculate your total monthly and annual streaming budget including basic services, premium add-ons, and sports packages, with comparison to cable TV costs.',
  formula: 'Monthly = (BasicServices × AvgCostPerService) + PremiumAddOns + SportsPackage. Annual = Monthly × 12. CableBaseline = $120/mo.',
  interpretation: 'The average US cord-cutter saves $40-70/mo compared to cable. However, subscribing to 5+ services can approach cable costs ($100+/mo). Key strategies: rotate services monthly (save 40-60%), leverage phone carrier bundles (T-Mobile, Verizon, AT&T offer free services), use library card streaming (Kanopy, Hoopla), and combine FAST (free ad-supported) services for casual viewing. Before cutting cable entirely, verify local sports availability — streaming sports packages (YouTube TV $72.99, Sling Orange+Blue $55) can be as expensive as basic cable.'
}

export default calcDef
