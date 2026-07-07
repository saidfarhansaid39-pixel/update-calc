import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'guests', label: 'Number of Guests', type: 'number', min: 1, step: '1' },
      { name: 'glassesPerGuest', label: 'Glasses Per Guest', type: 'number', min: 1, step: '0.5' },
      { name: 'wineType', label: 'Wine Type', type: 'select', options: [
        { label: 'Red wine (13% ABV)', value: '13' },
        { label: 'White wine (11% ABV)', value: '11' },
        { label: 'Rosé (12% ABV)', value: '12' },
        { label: 'Sparkling (12% ABV)', value: '12' },
      ] },
    ],
    compute: (v) => {
      const totalGlasses = v.guests * v.glassesPerGuest; const bottles = totalGlasses / 5; const totalMl = bottles * 750; const ethanolMl = totalMl * (v.wineType / 100); const calories = ethanolMl * 7
      return { result: bottles, label: 'Bottles Needed', unit: 'bottles', steps: [
        { label: 'Guests', value: `${v.guests}` },
        { label: 'Glasses per guest', value: `${v.glassesPerGuest}` },
        { label: 'Total glasses needed', value: `${totalGlasses}` },
        { label: 'Bottles (5 glasses/750mL bottle)', value: `${Math.ceil(bottles)} bottles (${bottles.toFixed(1)})` },
        { label: 'Alcohol calories', value: `~${calories.toFixed(0)} kcal` },
      ]}
    },
    description: 'Calculate wine quantities for any event. A standard 750mL bottle serves 5 glasses. Plan bottles needed based on guests and consumption pace.',
    example: { label: '10 guests, 2 glasses each', value: '4 bottles of wine' }
}

export default calcDef
