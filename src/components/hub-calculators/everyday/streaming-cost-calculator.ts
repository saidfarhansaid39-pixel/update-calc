import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ services: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), monthPrices: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), annualDiscount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), monthsSubscribed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sharingWith: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'services', label: 'Number of Services', type: 'number', min: 1, step: '1' },
    { name: 'monthPrices', label: 'Avg Monthly Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'annualDiscount', label: 'Annual Discount (%)', type: 'number', min: 0, max: 50, step: '5' },
    { name: 'monthsSubscribed', label: 'Months Subscribed per Year', type: 'number', min: 1, max: 12, step: '1' },
    { name: 'sharingWith', label: 'People Sharing Account', type: 'number', min: 1, step: '1' },
  ],
  defaults: { services: '4', monthPrices: '15', annualDiscount: '0', monthsSubscribed: '12', sharingWith: '3' },
  presets: [
    { label: 'Family Streaming Share', values: { services: '4', monthPrices: '15', annualDiscount: '0', monthsSubscribed: '12', sharingWith: '3' } },
    { label: 'Annual Plan Saver', values: { services: '3', monthPrices: '13', annualDiscount: '15', monthsSubscribed: '12', sharingWith: '2' } },
    { label: 'Rotating Services', values: { services: '3', monthPrices: '12', annualDiscount: '0', monthsSubscribed: '4', sharingWith: '2' } },
    { label: 'Solo Streamer', values: { services: '2', monthPrices: '15', annualDiscount: '10', monthsSubscribed: '12', sharingWith: '1' } },
  ],
  compute: (v) => {
    const monthlyFull = v.services * v.monthPrices
    const annualFull = monthlyFull * v.monthsSubscribed
    const discountSavings = annualFull * (v.annualDiscount / 100)
    const afterDiscount = annualFull - discountSavings
    const perPerson = afterDiscount / v.sharingWith
    return { result: perPerson, label: 'Annual Cost per Person', unit: '$', steps: [{ label: 'Full Monthly', value: `$${monthlyFull.toFixed(2)}` }, { label: 'Annual (${v.monthsSubscribed} mo)', value: `$${annualFull.toFixed(2)}` }, { label: 'Annual Discount', value: `-$${discountSavings.toFixed(2)}` }, { label: 'Total per Year', value: `$${afterDiscount.toFixed(2)}` }, { label: 'Per Person (${v.sharingWith} ways)', value: `$${perPerson.toFixed(2)}` }] ,
    extras: [
      { label: 'Password Sharing Crackdown', value: 'Netflix (2023), Disney+ (2024), and others restrict sharing outside household. Family plans are the legitimate alternative' },
      { label: 'Family Plan Comparison', value: 'Spotify Family: $16.99/6 people ($2.83/person). Netflix Premium: $22.99/4 screens. Apple One: $37.95/6 services for family' },
      { label: 'Rotating Strategy', value: 'Subscribe to 1-2 services at a time, rotate monthly. Save 40-60% vs keeping all active year-round. Most content stays in libraries' },
      { label: 'Annual Billing Savings', value: 'Most services offer 10-20% off with annual billing. Netflix: no annual option. Disney+: $139.99/yr vs $15.99/mo (save $51.89/yr)' },
      { label: 'Student Discounts', value: 'Spotify Premium Student: $5.99 (includes Hulu). Apple Music Student: $5.99. YouTube Premium Student: $7.99. Amazon Prime Student: $7.49/mo' },
      { label: 'Free Ad-Supported Tiers', value: 'Peacock Free, Pluto TV, Tubi, Freevee, Roku Channel — all free ad-supported options that can reduce your service count' },
      { label: 'Military/First Responder', value: 'Verizon +play, T-Mobile Netflix on Us, AT&T HBO Max — check if your phone carrier includes free streaming service credits' },
    ]}
  },
  description: 'Calculate annual streaming cost per person when sharing accounts with family or friends. Includes annual discount options and rotating subscription strategies.',
  formula: 'PerPersonCost = (Services × AvgPrice × MonthsSubscribed × (1 − AnnualDiscount%)) ÷ PeopleSharing. Annual savings from sharing increase with each additional person.',
  interpretation: 'Sharing 4 services ($15 each) among 3 people costs $20/person/month vs $60 alone — saving 67%. Password sharing restrictions are increasing: Netflix now charges $7.99/month for extra members outside your household. Family plans (Spotify $16.99/6, Apple One $37.95/6) are becoming the most cost-effective option. A rotating strategy — subscribing to 1-2 services at a time — saves 40-60% annually while giving you access to most content throughout the year.'
}

export default calcDef
