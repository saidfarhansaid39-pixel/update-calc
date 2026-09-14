import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ foodWeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ironPer100g: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cookwareType: z.string().min(1) }),
  defaults: { foodWeight: '200', ironPer100g: '2', cookwareType: 'castIron' },
  presets: [
    { label: 'Spinach in Cast Iron', values: { foodWeight: '180', ironPer100g: '2.7', cookwareType: 'castIron' } },
    { label: 'Tomato Sauce (Stainless)', values: { foodWeight: '250', ironPer100g: '0.5', cookwareType: 'stainless' } },
    { label: 'Beef Stir-Fry (Non-Stick)', values: { foodWeight: '300', ironPer100g: '2.6', cookwareType: 'nonstick' } },
  ],
  fields: [
    { name: 'foodWeight', label: 'Food Weight (g)', type: 'number', min: 1, step: '50' },
    { name: 'ironPer100g', label: 'Natural Iron (mg/100g)', type: 'number', min: 0, step: '0.5' },
    { name: 'cookwareType', label: 'Cookware Type', type: 'select', options: [{ label: 'Cast Iron', value: 'castIron' }, { label: 'Stainless Steel', value: 'stainless' }, { label: 'Non-Stick', value: 'nonstick' }, { label: 'Other', value: 'other' }] },
  ],
  compute: (v) => {
    const W = parseFloat(v.foodWeight)||0; const IR = parseFloat(v.ironPer100g)||0
    const naturalIron = (IR / 100) * W
    const cookwareFactors: Record<string, number> = { castIron: 0.5, stainless: 0.1, nonstick: 0, other: 0.05 }
    const addedIron = W * (cookwareFactors[v.cookwareType as keyof typeof cookwareFactors] || 0)
    const totalIron = naturalIron + addedIron
    return { result: totalIron, label: 'Total Iron Content', unit: 'mg', steps: [
      { label: '1. Natural Iron', value: `${IR} mg/100g ÷ 100 × ${W}g = ${naturalIron.toFixed(2)} mg` },
      { label: '2. Cookware Leach Rate', value: `${v.cookwareType === 'castIron' ? 'Cast iron: 0.5 mg/g' : v.cookwareType === 'stainless' ? 'Stainless: 0.1 mg/g' : v.cookwareType === 'nonstick' ? 'Non-stick: 0 mg/g (no leaching)' : 'Other: 0.05 mg/g'}` },
      { label: '3. Iron from Cookware', value: `${W}g × ${cookwareFactors[v.cookwareType as keyof typeof cookwareFactors]} mg/g = ${addedIron.toFixed(2)} mg` },
      { label: '4. Total Iron', value: `${naturalIron.toFixed(2)} + ${addedIron.toFixed(2)} = ${totalIron.toFixed(2)} mg` },
      { label: '5. RDI %', value: `${(totalIron / 18 * 100).toFixed(0)}% of women's RDI (18 mg), ${(totalIron / 8 * 100).toFixed(0)}% of men's RDI (8 mg)` },
    ] ,
    extras: [
      { label: 'Iron Absorption Factors', value: 'Heme iron (animal sources) absorbs 15-35%. Non-heme iron (plants) absorbs 2-20%. Pair plant iron with vitamin C (citrus, bell peppers) to boost absorption by 3-6×.' },
      { label: 'Acidic Foods & Cast Iron', value: 'Cooking acidic foods (tomato sauce, vinegar, lemon) in cast iron leaches 3-5× more iron than neutral foods. A single serving can add 2-5 mg iron.' },
      { label: 'Cast Iron Seasoning', value: 'Well-seasoned cast iron leaches less iron (0.2-0.3 mg/g) than new or poorly-seasoned (0.5-1.0 mg/g). Seasoning = polymerized oil layer that protects the pan.' },
      { label: 'High-Iron Foods', value: 'Spinach (2.7 mg/100g), beef liver (6.2 mg/100g), lentils (3.3 mg/100g), dark chocolate (12 mg/100g), fortified cereals (8-18 mg/serving).' },
      { label: 'Iron Deficiency', value: 'Affects 30% of women worldwide. Symptoms: fatigue, pale skin, shortness of breath, cold hands/feet. Cooking in cast iron can help reduce deficiency risk.' },
      { label: 'Iron Overload', value: 'Men and postmenopausal women are at risk of iron overload (hemochromatosis affects 1 in 200). Excess iron causes organ damage. Don\'t use cast iron if you have hemochromatosis.' },
      { label: 'Cooking Time Effect', value: 'Iron leaching increases with cooking time. A 30-min simmer leaches ~50% more than a 10-min sauté. Longer cooking (stews, braises) maximizes iron transfer.' },
      { label: 'Iron Supplement Caution', value: 'Iron supplements cause constipation, nausea, and black stools in 30-50% of users. Food-based iron from cast iron cooking avoids these side effects.' },
    ]}
  },
  description: 'Estimate total iron content in cooked food including natural iron and iron leached from cookware, especially cast iron. Helps with iron deficiency management.',
  formula: 'Total Iron (mg) = (IronPer100g / 100) × Weight(g) + Weight(g) × CookwareFactor. Cast iron: 0.5 mg/g, Stainless: 0.1 mg/g, Non-stick: 0 mg/g, Other: 0.05 mg/g. RDI: 8 mg (men), 18 mg (women).',
  interpretation: 'Cast iron cookware can add 1-3 mg iron per 100g of acidic food — significant for those with iron deficiency. Cooking spinach in cast iron can double the iron content vs non-stick. Pair with vitamin C for 3-6× better absorption. Limit if you have hemochromatosis (iron overload disorder).'
}

export default calcDef
