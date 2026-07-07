import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'guests', label: 'Number of Guests', type: 'number', min: 1, step: '1' },
      { name: 'beersPerGuest', label: 'Beers Per Guest', type: 'number', min: 1, step: '0.5' },
      { name: 'packageType', label: 'Package Type', type: 'select', options: [
        { label: '12 oz bottles/cans (12-pack)', value: '12' },
        { label: '16 oz pints', value: '16' },
        { label: 'Keg (1/6 bbl — 55 beers)', value: '55' },
        { label: 'Keg (1/4 bbl — 82 beers)', value: '82' },
        { label: 'Keg (1/2 bbl — 165 beers)', value: '165' },
      ] },
    ],
    compute: (v) => {
      const totalBeers = v.guests * v.beersPerGuest; const perPack = parseInt(v.packageType); const packsNeeded = Math.ceil(totalBeers / perPack); const calories = totalBeers * 150
      return { result: totalBeers, label: 'Total Beers', unit: 'beers', steps: [
        { label: 'Guests', value: `${v.guests}` },
        { label: 'Beers per guest', value: `${v.beersPerGuest}` },
        { label: 'Total beers needed', value: `${totalBeers}` },
        { label: perPack >= 55 ? 'Kegs needed' : 'Packs needed', value: `${packsNeeded} (${perPack}-unit ${perPack >= 55 ? 'keg' : 'pack'})` },
        { label: 'Calories', value: `~${calories.toFixed(0)} kcal` },
      ]}
    },
    description: 'Calculate beer quantities for parties and events. Determine total beers, optimal packaging (bottles, cans, or kegs), and calorie estimates.',
    example: { label: '20 guests, 3 beers each', value: '60 beers = 1 half-barrel keg' }
}

export default calcDef
