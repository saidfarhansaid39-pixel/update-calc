import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), pounds: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalPrice', label: 'Total Price ($)', type: 'number', min: 0.01, step: '1' },
    { name: 'pounds', label: 'Net Weight (lb)', type: 'number', min: 0.1, step: '0.5' },
  ],
  defaults: { totalPrice: '7.99', pounds: '2' },
  presets: [
    { label: 'Ground Beef (80/20)', values: { totalPrice: '5.99', pounds: '1' } },
    { label: 'Whole Chicken', values: { totalPrice: '8.50', pounds: '4' } },
    { label: 'Beef Stew Meat', values: { totalPrice: '12.99', pounds: '2' } },
    { label: 'Bulk Frozen Chicken Breast', values: { totalPrice: '24.99', pounds: '10' } },
  ],
  compute: (v) => {
    const perLb = v.totalPrice / v.pounds
    const perOz = perLb / 16
    return { result: perLb, label: 'Price per Pound', unit: '$/lb',
      steps: [
        { label: 'Total Price', value: `$${v.totalPrice.toFixed(2)}` },
        { label: 'Net Weight', value: `${v.pounds} lb (${(v.pounds * 16).toFixed(0)} oz)` },
        { label: 'Price per Pound', value: `$${v.totalPrice.toFixed(2)} ÷ ${v.pounds} = $${perLb.toFixed(2)}/lb` },
        { label: 'Price per Ounce', value: `$${perLb.toFixed(2)} ÷ 16 = $${perOz.toFixed(3)}/oz` },
        { label: 'Price per 4 oz Serving', value: `$${(perOz * 4).toFixed(2)} per 4 oz serving` },
        { label: 'Price Category', value: perLb < 3 ? 'Budget-friendly' : perLb < 7 ? 'Moderate' : perLb < 12 ? 'Premium' : 'Luxury' },
        { label: 'Cost for Typical Recipe (1 lb)', value: `$${perLb.toFixed(2)}` },
        { label: 'Cost for Family Meal (2 lb)', value: `$${(perLb * 2).toFixed(2)}` },
      ],
      extras: [
        { label: '🥩 Edible Yield Matters', value: 'Bone-in meat yields 70-75% edible meat, boneless yields 95-100%. A $4/lb bone-in chicken thigh effectively costs $5.33/lb after removing the bone. Boneless at $5/lb is actually cheaper.' },
        { label: '💰 USDA Meat Price Averages (2024)', value: 'Ground beef (80/20): $5.20/lb. Chicken breast (boneless): $4.30/lb. Pork chops: $4.10/lb. Sirloin steak: $8.50/lb. Chuck roast: $6.10/lb.' },
        { label: '🛒 Bulk Buying Sweet Spots', value: '10-20 lb bulk packs of chicken or beef save 15-30% vs 1-lb packs. Vacuum seal and freeze portions. Most meat freezes well for 3-6 months at 0°F.' },
        { label: '🍔 Meat Shrinkage During Cooking', value: 'Meat loses 20-30% weight during cooking (moisture and fat render). A 1-lb raw steak becomes ~12 oz cooked. Factor this in when comparing raw vs pre-cooked options.' },
        { label: '🥬 Produce Pricing Reality', value: 'Produce per pound varies hugely: potatoes $0.80/lb, apples $1.50/lb, grapes $3.50/lb, berries $5-7/lb. In-season produce costs 30-50% less than off-season.' },
        { label: '📊 Grade and Quality Impact', value: 'USDA Prime beef costs 30-50% more than Choice, which costs 15-25% more than Select. For braising and stewing, Select/Choice is sufficient — you\'re paying for tenderness that cooking technique provides.' },
        { label: '♻️ Reduce Waste With Whole Cuts', value: 'Buying whole primal cuts and breaking them down saves $2-5/lb. A whole pork loin ($3/lb) yields chops, roasts, and stir-fry strips vs pre-cut chops at $6/lb.' },
        { label: '🏪 Butcher vs Grocery Store', value: 'Local butchers often have competitive per-pound prices on specialty cuts. Warehouse clubs (Costco, Sam\'s) offer bulk meat at 20-30% below grocery store prices per pound.' },
      ]
    }
  },
  description: 'Calculate the price per pound of meat, produce, or bulk items including per-ounce breakdown, serving cost estimates, and value categorization. Essential for grocery budgeting.',
  formula: 'Price/lb = Total Price ÷ Pounds | Price/oz = Price/lb ÷ 16 | Price per serving = Price/oz × serving size in oz',
  interpretation: 'Price per pound is the standard pricing unit for meat, deli items, and bulk produce. Always factor in edible yield: bone-in meat costs 25-35% more per edible pound after trimming. Cooking shrinkage (20-30%) further increases effective cost. USDA average meat prices (2024): ground beef $5.20/lb, chicken breast $4.30/lb, sirloin steak $8.50/lb. Warehouse clubs save 20-30% per pound on meat compared to grocery stores.'
}

export default calcDef
