import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ purchaseDate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), milkType: z.string().min(1), storageTemp: z.string().min(1), sellByDays: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'purchaseDate', label: 'Days Since Purchase', type: 'number', min: 0, step: '1' },
    { name: 'milkType', label: 'Milk Type', type: 'select', options: [{ label: 'Whole Milk', value: 'whole' }, { label: '2% Reduced Fat', value: 'reduced' }, { label: 'Skim/Fat-Free', value: 'skim' }, { label: 'Lactose-Free', value: 'lactose' }, { label: 'Almond/Oat Milk', value: 'plant' }] },
    { name: 'storageTemp', label: 'Storage Temperature', type: 'select', options: [{ label: 'Refrigerated (≤40°F)', value: 'cold' }, { label: 'Room Temp (>40°F)', value: 'warm' }] },
    { name: 'sellByDays', label: 'Sell-By Days from Production', type: 'number', min: 1, step: '1' },
  ],
  defaults: { purchaseDate: '5', milkType: 'whole', storageTemp: 'cold', sellByDays: '14' },
  presets: [
    { label: 'Fresh Whole Milk', values: { purchaseDate: '2', milkType: 'whole', storageTemp: 'cold', sellByDays: '14' } },
    { label: 'Week-Old Almond Milk', values: { purchaseDate: '7', milkType: 'plant', storageTemp: 'cold', sellByDays: '21' } },
    { label: 'Left Out Overnight', values: { purchaseDate: '1', milkType: 'whole', storageTemp: 'warm', sellByDays: '14' } },
    { label: 'Lactose-Free Longevity', values: { purchaseDate: '14', milkType: 'lactose', storageTemp: 'cold', sellByDays: '28' } },
  ],
  compute: (v) => {
    const milkFreshness: Record<string, { fridgeDays: number; unopenedBonus: number; smellCheck: string }> = { whole: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled — trust your nose' }, reduced: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled — trust your nose' }, skim: { fridgeDays: 14, unopenedBonus: 5, smellCheck: 'Sour smell = spoiled — trust your nose' }, lactose: { fridgeDays: 21, unopenedBonus: 7, smellCheck: 'May last longer, but still trust your nose' }, plant: { fridgeDays: 10, unopenedBonus: 3, smellCheck: 'Lumpy/chunky texture = spoiled; sour smell is less reliable for plant milk' } }
    const mf = milkFreshness[v.milkType as keyof typeof milkFreshness] || milkFreshness.whole
    const maxFridgeDays = mf.fridgeDays + mf.unopenedBonus
    const daysRemaining = maxFridgeDays - v.purchaseDate
    const openedDaysAgo = Math.max(0, v.purchaseDate - v.sellByDays)
    const spoilageRisk = v.storageTemp === 'warm' ? 'HIGH — Milk above 40°F is in the danger zone and spoils rapidly within 2 hours' : daysRemaining > 0 ? `${daysRemaining} day(s) remaining within recommended window` : `${Math.abs(daysRemaining)} day(s) past recommended window — check carefully before consuming`
    return { result: daysRemaining, label: 'Days Left (estimated)', unit: 'days', steps: [
      { label: 'Milk Type', value: `${v.milkType}` },
      { label: 'Days Since Purchase', value: `${v.purchaseDate} days ago` },
      { label: 'Unopened Shelf Life', value: `${mf.fridgeDays + mf.unopenedBonus} days (${mf.fridgeDays} fridge + ${mf.unopenedBonus} unopened grace)` },
      { label: 'Opened Duration', value: `${openedDaysAgo} days ago (opened after sell-by)` },
      { label: 'Estimated Days Remaining', value: daysRemaining > 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days past` },
      { label: 'Storage Assessment', value: spoilageRisk },
      { label: 'Freshness Check Method', value: mf.smellCheck },
      { label: 'Freeze Option', value: daysRemaining <= 3 ? 'Freeze now — milk freezes well for up to 3 months' : 'Still fresh — no need to freeze yet' },
    ] ,
    extras: [
      { label: 'Shelf Life by Type', value: 'Dairy milk: 5-7 days past sell-by if ≤40°F. Lactose-free: 7-10 days past sell-by (ultra-pasteurized). Plant milk: 7-10 days after opening.' },
      { label: 'The Smell Test', value: 'The most reliable freshness test. If it smells sour, off, or like cheese, discard it — even if within the date on the carton.' },
      { label: 'Temperature Critical', value: 'Milk should be stored at ≤40°F (4°C). The refrigerator door is the warmest part — store milk on interior shelves, not the door.' },
      { label: 'Freezing Milk', value: 'Milk freezes well for 2-3 months. Leave 1-2 inches headspace for expansion. Thaw in fridge — texture may be slightly grainy, fine for cooking/smoothies.' },
      { label: 'Sell-By vs Use-By', value: 'Sell-by: for store inventory, milk is still good 5-7 days after. Use-by: manufacturer\'s best quality estimate. Neither is a safety date.' },
      { label: 'Cost of Waste', value: 'The average US household wastes ~$30/month on spoiled dairy. Proper storage and rotation cuts waste by half.' },
    ]}
  },
  description: 'Estimate how many days your milk has left before spoiling based on milk type, storage temperature, days since purchase, and sell-by date. Includes freshness checks and freezing guidance.',
  formula: 'DaysRemaining = (FridgeDays + UnopenedBonus) − DaysSincePurchase | Spoiled = DaysRemaining < 0 or Temperature > 40°F | Dairy fridge: ~14 days, Plant: ~10 days, Lactose-free: ~21 days',
  interpretation: 'Refrigerated dairy milk typically lasts 5-7 days past the sell-by date if stored at ≤40°F consistently. A carton of whole milk lasts ~14 days refrigerated after opening (19 days unopened). Plant-based milks (almond, oat) last 7-10 days after opening. Lactose-free milk lasts longest at ~21 days due to ultra-pasteurization. Always do a smell test — if it smells sour, discard it regardless of the date on the carton. Milk left above 40°F for 2+ hours should be discarded immediately.'
}

export default calcDef
