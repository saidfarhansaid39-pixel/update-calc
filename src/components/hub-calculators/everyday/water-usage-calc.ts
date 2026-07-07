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
    return { result: totalDaily, label: 'Daily Water Usage', unit: 'gal', steps: [{ label: 'Showers', value: showerDaily.toFixed(0) + ' gal (' + pctShower.toFixed(0) + '%)' }, { label: 'Toilets', value: flushDaily.toFixed(0) + ' gal (' + pctFlush.toFixed(0) + '%)' }, { label: 'Laundry', value: laundryDaily.toFixed(0) + ' gal (' + pctLaundry.toFixed(0) + '%)' }, { label: 'Daily Total', value: totalDaily.toFixed(0) + ' gal' }, { label: 'Monthly Total', value: totalMonthly.toFixed(0) + ' gal' }, { label: 'Annual Total', value: totalAnnual.toFixed(0) + ' gal' }] }
  },
  description: 'Estimate daily household water usage from showers, toilets, and laundry. Understand your water footprint by category.',
  formula: 'Daily = (ShowerMin x 2.1 x Showers + Flushes x 1.6 + Loads x 30/7) x People',
  interpretation: 'Average person: 80-100 gal/day. Showers: 30-40%, Toilets: 25-30%, Laundry: 15-20%, Other: 10-20%. Low-flow showerheads save 2,900 gal/year. Modern toilets use 1.28 GPF vs 3.5+ GPF for old models.'
}

export default calcDef
