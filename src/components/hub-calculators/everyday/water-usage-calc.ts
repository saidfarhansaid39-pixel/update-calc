import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wuShowerMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wuShowersPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wuFlushesPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wuLoadsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), wuPeople: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'wuShowerMin', label: 'Minutes per Shower', type: 'number', min: 0, step: '2' },
    { name: 'wuShowersPerDay', label: 'Showers per Day', type: 'number', min: 0, max: 5, step: '1' },
    { name: 'wuFlushesPerDay', label: 'Toilet Flushes/Day', type: 'number', min: 0, step: '1' },
    { name: 'wuLoadsPerWeek', label: 'Laundry Loads/Week', type: 'number', min: 0, step: '1' },
    { name: 'wuPeople', label: 'Number of People', type: 'number', min: 1, step: '1' },
  ],
  defaults: { wuShowerMin: '8', wuShowersPerDay: '1', wuFlushesPerDay: '5', wuLoadsPerWeek: '6', wuPeople: '3' },
  presets: [
    { label: 'Single Person Efficient', values: { wuShowerMin: '6', wuShowersPerDay: '1', wuFlushesPerDay: '3', wuLoadsPerWeek: '2', wuPeople: '1' } },
    { label: 'Family of 4 Average', values: { wuShowerMin: '8', wuShowersPerDay: '1', wuFlushesPerDay: '5', wuLoadsPerWeek: '8', wuPeople: '4' } },
    { label: 'Large Family Heavy Use', values: { wuShowerMin: '12', wuShowersPerDay: '2', wuFlushesPerDay: '8', wuLoadsPerWeek: '12', wuPeople: '5' } },
  ],
  compute: (v) => {
    const showerGpm = 2.1
    const flushGpf = 1.6
    const laundryGpl = 30
    const showerDaily = v.wuShowerMin * showerGpm * v.wuShowersPerDay * v.wuPeople
    const flushDaily = v.wuFlushesPerDay * flushGpf * v.wuPeople
    const laundryDaily = v.wuLoadsPerWeek * laundryGpl / 7
    const totalDaily = showerDaily + flushDaily + laundryDaily
    const totalMonthly = totalDaily * 30
    const totalAnnual = totalDaily * 365
    const pctShower = totalDaily > 0 ? (showerDaily / totalDaily) * 100 : 0
    const pctFlush = totalDaily > 0 ? (flushDaily / totalDaily) * 100 : 0
    const pctLaundry = totalDaily > 0 ? (laundryDaily / totalDaily) * 100 : 0
    return { result: totalDaily, label: 'Daily Water Usage', unit: 'gal', steps: [{ label: 'Shower Water Use', value: `${v.wuShowerMin} min × 2.1 GPM × ${v.wuShowersPerDay}/day × ${v.wuPeople} people = ${showerDaily.toFixed(0)} gal (${pctShower.toFixed(0)}%)` }, { label: 'Toilet Water Use', value: `${v.wuFlushesPerDay} flushes × 1.6 GPF × ${v.wuPeople} people = ${flushDaily.toFixed(0)} gal (${pctFlush.toFixed(0)}%)` }, { label: 'Laundry Water Use', value: `${v.wuLoadsPerWeek} loads/wk × 30 gal / 7 = ${laundryDaily.toFixed(0)} gal/day (${pctLaundry.toFixed(0)}%)` }, { label: 'Daily Total Water', value: `${totalDaily.toFixed(0)} gal` }, { label: 'Per Person Per Day', value: `${(totalDaily / v.wuPeople).toFixed(0)} gal/person/day` }, { label: 'Monthly Total', value: `${totalMonthly.toFixed(0)} gal` }, { label: 'Annual Total', value: `${totalAnnual.toFixed(0)} gal` }, { label: 'vs US Average (300 gal/day/family)', value: totalDaily > 300 ? `${(totalDaily - 300).toFixed(0)} gal above average` : `${(300 - totalDaily).toFixed(0)} gal below average` }] ,
    extras: [
      { label: 'Low-Flow Fixture Savings', value: 'Switching from a standard 2.5 GPM showerhead to 1.75 GPM saves 0.75 gal/min. For an 8-min daily shower: 6 gal saved per shower = 2,190 gal/year per person. A family of 4 saves 8,760 gal/year — enough to fill a 12 ft above-ground pool.' },
      { label: 'Toilet Efficiency Matters', value: 'Older toilets (pre-1994) use 3.5-5 GPF. Modern WaterSense toilets use 1.28 GPF. Upgrading from 3.5 to 1.28 GPF saves 2.22 gal/flush. For a family of 4 (20 flushes/day): 44.4 gal/day = 16,206 gal/year = $120-200/year savings.' },
      { label: 'Laundry Best Practices', value: 'Front-load washers use 13-15 gal/load vs top-load 30-40 gal. Washing full loads only saves 5-10 gal/load. Cold water washes save energy (90% of washer energy goes to heating water). High-efficiency detergents reduce rinse cycles.' },
      { label: 'Hidden Water Leaks', value: 'A leaky toilet can waste 200 gal/day silently. Faucet drip (1 drop/sec): 1,200 gal/year. Running toilet: 4,000+ gal/month. Check by reading your water meter before/after a 2-hour no-water period. Fix leaks promptly — most are DIY with $10 parts.' },
      { label: 'Outdoor Water Use', value: 'This calculator covers indoor use only. Average household adds 1,000 gal/month for outdoor watering in summer. Lawn irrigation accounts for 30% of total residential water use (9 billion gal/day nationwide). Rain barrels and drip irrigation cut outdoor use 50%.' },
      { label: 'Water Conservation ROI', value: 'Low-flow fixtures: $20-50 each, save $100-200/year in water + sewer costs. Rain barrel: $80-150, saves 1,300 gal/year. Smart irrigation controller: $150-250, saves 30-50% on outdoor water. Typical payback: 6-18 months for most upgrades.' },
      { label: 'Regional Water Cost Variation', value: 'US water rates vary from $2/1,000 gal (low-cost areas) to $15/1,000 gal (drought-prone regions). At $10/kgal, a family using 300 gal/day ($90/month) can reduce to 200 gal/day ($60/month) with efficient fixtures — saving $360/year.' },
    ]}
  },
  description: 'Estimate daily household water usage from showers, toilets, and laundry with per-category breakdown. Understand your water footprint and compare against US averages for effective conservation planning.',
  formula: 'DailyWater = (ShowerMin × 2.1 GPM × ShowersPerDay + FlushesPerDay × 1.6 GPF + LaundryLoadsPerWeek × 30 gal ÷ 7) × People. Category% = CategoryDaily ÷ TotalDaily × 100. Assumes standard 2.1 GPM showerhead, 1.6 GPF toilet, 30 gal/load washer.',
  interpretation: 'A family of 3 with standard habits (8-min showers, 5 flushes/person/day, 6 laundry loads/week) uses ~107 gal/day: showers 50 gal (47%), toilets 24 gal (22%), laundry 26 gal (24%). This is well below the US average of 300 gal/day for a family of 3, indicating efficient fixtures. Per person, this is ~36 gal/day vs the national average of 82 gal/day. Showers dominate because they combine duration, flow rate, and frequency. To reduce further: shorten showers by 2 min (saves 12.6 gal/day), upgrade to 1.28 GPF toilets (saves 4.8 gal/day), and wash only full loads of laundry.'
}

export default calcDef
