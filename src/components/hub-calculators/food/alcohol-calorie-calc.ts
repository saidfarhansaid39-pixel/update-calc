import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'drinks', label: 'Drinks', type: 'number', min: 0, step: '0.5' },
      { name: 'type', label: 'Drink Type', type: 'select', options: [{ label: 'Beer 5% (150 kcal)', value: '150' }, { label: 'Wine 12% (125 kcal)', value: '125' }, { label: 'Cocktail (200 kcal)', value: '200' }, { label: 'Spirit 40% (97 kcal)', value: '97' }, { label: 'Light beer (100 kcal)', value: '100' }] }
    ],
    compute: (v) => {
      const cal = parseFloat(v.type); const t = v.drinks * cal; return { result: t, label: 'Calories from Alcohol', unit: 'kcal', steps: [{ label: 'Drinks', value: v.drinks + ' x ' + cal + ' kcal' }, { label: 'Total calories', value: t.toFixed(0) + ' kcal' }, { label: 'Daily % (2000 kcal)', value: (t / 2000 * 100).toFixed(0) + '%' }] }
    },
    description: 'Calories from alcoholic beverages. Alcohol provides 7 kcal/g of empty calories.',
    example: { label: '3 beers (150 kcal each)', value: '450 kcal' }
}

export default calcDef
