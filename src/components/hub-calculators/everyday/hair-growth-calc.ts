import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), growthPerMonth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'months', label: 'Number of Months', type: 'number', min: 1, step: '1' },
    { name: 'growthPerMonth', label: 'Growth Rate (in/month)', type: 'number', min: 0.1, step: '0.1' },
  ],
  defaults: { months: "12", growthPerMonth: "0.5" },
  presets: [
    { label: "Shoulder to Bra Strap", values: { months: "14", growthPerMonth: "0.5" } },
    { label: "Pixie to Bob", values: { months: "8", growthPerMonth: "0.5" } },
    { label: "Biotin Boost", values: { months: "6", growthPerMonth: "0.7" } },
    { label: "Yearly Trim Goal", values: { months: "3", growthPerMonth: "0.5" } },
  ],
  compute: (v) => { const m = parseFloat(v.months)||0; const g = parseFloat(v.growthPerMonth)||0; const totalInches = m * g; const totalCm = totalInches * 2.54; const annualRate = g * 12; const weeksToGoal = totalInches > 0 ? (totalInches / g) * 4.33 : 0; return { result: totalInches, label: 'Total Hair Growth', unit: 'in', steps: [{ label: 'Growing Period', value: `${m} months (${(m/12).toFixed(1)} years)` }, { label: 'Monthly Rate', value: `${g.toFixed(1)} in/month` }, { label: 'Annual Projection', value: `${annualRate.toFixed(1)} in/year` }, { label: 'Total Inches Grown', value: `${totalInches.toFixed(2)} in` }, { label: 'Total Centimeters', value: `${totalCm.toFixed(1)} cm` }, { label: 'Weeks to This Length', value: `${weeksToGoal.toFixed(0)} weeks` }] ,
    extras: [
      { label: "Average Growth Rate", value: "0.5 in/month (6 in/year); scalp hair grows faster in summer" },
      { label: "Growth Boosters", value: "Biotin, collagen, protein intake, scalp massage, and regular trims" },
      { label: "Growth Limiters", value: "Stress, poor nutrition, heat damage, tight hairstyles, medical conditions" },
      { label: "Hair Cycle Phases", value: "Anagen (growth 2-7 yr) → Catagen (transition 2 wk) → Telogen (rest 3 mo)" },
      { label: "Max Length by Genetics", value: "Average terminal length: 24-36 in; some reach 48+ in with optimal health" },
      { label: "Trimming Trade-Off", value: "Trimming 0.25-0.5 in every 8-12 wk prevents split ends while retaining length" },
      { label: "Supplement Timeline", value: "Visible results from biotin/collagen take 3-6 months of consistent use" },
      { label: "Seasonal Variation", value: "Hair grows ~10% faster in summer due to increased blood circulation" },
    ]} },
  description: 'Project total hair growth over any period using your personal growth rate. Track length goals, compare to averages, and understand how biotin, trims, and seasons affect progress.',
  formula: 'Total Growth (in) = Months × Growth Rate per Month | Total (cm) = Total (in) × 2.54',
  interpretation: 'Average scalp hair grows 0.5 in/month (6 in/year). Achieving waist-length hair (24-28 in) typically takes 4-5 years from a short cut. The anagen (growth) phase lasts 2-7 years genetically — this sets your maximum possible length. Regular trims every 8-12 weeks prevent breakage and help retain length. Biotin and adequate protein intake can boost rate to ~0.7 in/month in some individuals, while stress, illness, and nutrient deficiencies can slow growth significantly.'
}

export default calcDef
