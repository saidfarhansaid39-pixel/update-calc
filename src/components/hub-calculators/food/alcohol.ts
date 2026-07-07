import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'drinks', label: 'Standard Drinks', type: 'number', min: 0, step: '0.5' },
      { name: 'abv', label: 'ABV %', type: 'select', options: [
        { label: 'Beer 5%', value: '5' }, { label: 'Wine 12%', value: '12' }, { label: 'Wine 14%', value: '14' },
        { label: 'Spirits 40%', value: '40' }, { label: 'Liqueur 20%', value: '20' }, { label: 'Cocktail ~15%', value: '15' },
      ] },
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
    ],
    compute: (v) => {
      const ethanol_g = v.drinks * 14; const bac_male = ethanol_g / (v.weight * 0.68) - 0.015; const bac = Math.max(0, bac_male)
      const calories = v.drinks * v.abv * 2.5
      return { result: bac, label: 'Estimated BAC', unit: '%', steps: [
        { label: 'Standard drinks', value: `${v.drinks}` },
        { label: 'ABV', value: `${v.abv}%` },
        { label: 'Ethanol consumed', value: `${ethanol_g.toFixed(0)} g` },
        { label: 'Estimated BAC', value: `${bac.toFixed(3)}%` },
        { label: 'Calories from alcohol', value: `~${calories.toFixed(0)} kcal` },
        bac > 0.08 ? { label: '⚠️ Over legal limit', value: '0.08% is the legal driving limit in most regions' } : { label: 'Legal status', value: 'Below 0.08% legal limit (driving may still be impaired at lower levels)' },
      ]}
    },
    description: 'Estimate blood alcohol content (BAC) based on consumption and body weight. BAC depends on many factors including food intake, metabolism, and time. Never drink and drive.',
    example: { label: '3 beers (5%), 70kg', value: 'BAC ~0.073% (~105 kcal)' }
}

export default calcDef
