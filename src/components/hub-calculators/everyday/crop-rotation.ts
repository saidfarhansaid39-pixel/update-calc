import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gardenArea: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), currentFamily: z.string().min(1), lastYearFamily: z.string().min(1), yearsBetween: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'gardenArea', label: 'Garden Area (sq ft)', type: 'number', min: 10, step: '10' },
    { name: 'currentFamily', label: 'This Year\'s Crop Family', type: 'select', options: [{ label: 'Solanaceae (Tomato/Pepper)', value: 'solanaceae' }, { label: 'Brassicas (Cabbage/Broccoli)', value: 'brassica' }, { label: 'Cucurbits (Squash/Cucumber)', value: 'cucurbit' }, { label: 'Fabaceae (Beans/Peas)', value: 'fabaceae' }, { label: 'Alliums (Onion/Garlic)', value: 'allium' }, { label: 'Apiaceae (Carrot/Dill)', value: 'apiaceae' }] },
    { name: 'lastYearFamily', label: 'Last Year\'s Family', type: 'select', options: [{ label: 'Solanaceae (Tomato/Pepper)', value: 'solanaceae' }, { label: 'Brassicas (Cabbage/Broccoli)', value: 'brassica' }, { label: 'Cucurbits (Squash/Cucumber)', value: 'cucurbit' }, { label: 'Fabaceae (Beans/Peas)', value: 'fabaceae' }, { label: 'Alliums (Onion/Garlic)', value: 'allium' }, { label: 'Apiaceae (Carrot/Dill)', value: 'apiaceae' }] },
    { name: 'yearsBetween', label: 'Years Before Replanting Same Family', type: 'number', min: 1, max: 6, step: '1' },
  ],
  defaults: { gardenArea: '200', currentFamily: 'solanaceae', lastYearFamily: 'fabaceae', yearsBetween: '3' },
  presets: [
    { label: 'Beginner 4×4 Bed', values: { gardenArea: '64', currentFamily: 'solanaceae', lastYearFamily: 'brassica', yearsBetween: '3' } },
    { label: 'Established Vegetable Patch', values: { gardenArea: '400', currentFamily: 'fabaceae', lastYearFamily: 'solanaceae', yearsBetween: '4' } },
    { label: 'Community Garden Plot', values: { gardenArea: '600', currentFamily: 'cucurbit', lastYearFamily: 'cucurbit', yearsBetween: '2' } },
    { label: 'Three-Year Rotation', values: { gardenArea: '300', currentFamily: 'allium', lastYearFamily: 'apiaceae', yearsBetween: '3' } },
  ],
  compute: (v) => {
    const isSame = v.currentFamily === v.lastYearFamily
    const compatible = !isSame || v.yearsBetween >= 3
    const recommendation = isSame ? (v.yearsBetween >= 3 ? 'Adequate rotation' : 'Rotate out! Same family planted too soon') : 'Good rotation'
    const families = ['solanaceae', 'brassica', 'cucurbit', 'fabaceae', 'allium', 'apiaceae']
    const labels: Record<string, string> = { solanaceae: 'Nightshades (tomato, pepper, eggplant)', brassica: 'Cole crops (cabbage, broccoli, kale)', cucurbit: 'Gourds (squash, cucumber, melon)', fabaceae: 'Legumes (beans, peas, clover)', allium: 'Onion family (garlic, leek, shallot)', apiaceae: 'Umbel family (carrot, dill, parsley)' }
    const nextIdx = (families.indexOf(v.currentFamily) + 1) % families.length
    const nextFamily = families[nextIdx]
    const feederType: Record<string, string> = { solanaceae: 'Heavy feeder', brassica: 'Heavy feeder', cucurbit: 'Heavy feeder', fabaceae: 'Nitrogen fixer', allium: 'Light feeder', apiaceae: 'Light feeder' }
    return { result: compatible ? 1 : 0, label: compatible ? 'Rotation OK' : 'Risk of Disease', unit: '', steps: [{ label: 'Current Crop', value: labels[v.currentFamily] }, { label: 'Previous Crop', value: labels[v.lastYearFamily] }, { label: 'Rotation Status', value: recommendation }, { label: 'Nutrient Role', value: `${feederType[v.currentFamily]} — ${v.currentFamily === 'fabaceae' ? 'adds nitrogen for next crop' : 'depletes soil nutrients'}` }, { label: 'Disease Risk', value: isSame && v.yearsBetween < 3 ? 'High — soil pathogens may persist' : 'Low — proper rotation interval' }, { label: 'Next Recommended', value: labels[nextFamily] }, { label: 'Rotation Cycle', value: `${v.yearsBetween}-year cycle` }] ,
    extras: [
      { label: "Why Rotate", value: "Continuous same-family planting depletes specific nutrients and allows soil-borne pathogens (blight, clubroot, fusarium) to build up." },
      { label: "Three-Year Rule", value: "Most plant families need a minimum 3-year gap before replanting in the same spot. Solanaceae and brassicas benefit from 4+ years." },
      { label: "Nitrogen Cycling", value: "Follow heavy feeders (solanaceae, cucurbits) with nitrogen-fixing legumes to naturally replenish soil without synthetic fertilizer." },
      { label: "Brassica Care", value: "Brassicas need firm, fertile soil. Planting after legumes or green manure gives them ideal nitrogen-rich conditions." },
      { label: "Cover Crops", value: "In fallow rotation years, plant winter rye or clover as a cover crop to prevent erosion, suppress weeds, and add organic matter." },
      { label: "Companion Planting", value: "Interplant compatible species: basil with tomatoes deters hornworms; marigolds with brassicas repel cabbage moths." },
      { label: "Garden Mapping", value: "Draw a 4-year bed map to track which family goes where. Apps like Planter or GrowVeg automate rotation scheduling." },
      { label: "Soil Testing", value: "Test pH and NPK between rotation cycles. Tomatoes prefer pH 6.2-6.8; brassicas do well at pH 6.5-7.0. Adjust with lime or sulfur." },
    ]}
  },
  description: 'Plan crop rotation to prevent soil-borne diseases, balance nutrient depletion, and maximize garden yields. Learn which plant families can follow each other and the ideal rotation intervals for each group.',
  formula: 'Rotation Rule: Never plant the same family in the same bed for at least 3 consecutive years. Follow nitrogen-fixing crops (Fabaceae) with nitrogen-heavy feeders (Solanaceae, Brassicas).',
  interpretation: 'Plant families fall into three nutrient roles: heavy feeders (Solanaceae, Brassicas, Cucurbits) deplete soil rapidly; light feeders (Alliums, Apiaceae) are more moderate; and nitrogen fixers (Fabaceae) enrich the soil for subsequent crops. A 4-year rotation cycle with a cover-crop fallow year is the gold standard for organic soil health management.'
}

export default calcDef
