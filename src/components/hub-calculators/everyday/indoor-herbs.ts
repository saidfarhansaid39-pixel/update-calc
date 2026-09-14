import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ herbCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), pots: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), soilBags: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), seeds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), growLight: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'herbCount', label: 'Herb Varieties', type: 'number', min: 1, step: '1' },
    { name: 'pots', label: 'Pots Needed', type: 'number', min: 0, step: '1' },
    { name: 'soilBags', label: 'Potting Soil Bags', type: 'number', min: 0, step: '1' },
    { name: 'seeds', label: 'Seed Packets', type: 'number', min: 0, step: '1' },
    { name: 'growLight', label: 'Grow Lights', type: 'number', min: 0, step: '1' },
  ],
  defaults: { herbCount: "4", pots: "4", soilBags: "1", seeds: "4", growLight: "1" },
  presets: [
    { label: "Kitchen Counter Starter", values: { herbCount: "3", pots: "3", soilBags: "1", seeds: "3", growLight: "0" } },
    { label: "Sunny Windowsill", values: { herbCount: "5", pots: "5", soilBags: "1", seeds: "5", growLight: "0" } },
    { label: "Full Indoor Garden (LED)", values: { herbCount: "8", pots: "8", soilBags: "2", seeds: "8", growLight: "2" } },
    { label: "Herb Tower Setup", values: { herbCount: "6", pots: "1", soilBags: "1", seeds: "6", growLight: "1" } },
  ],
  compute: (v) => { const potCost = v.pots * 5; const soilCost = v.soilBags * 8; const seedCost = v.seeds * 4; const lightCost = v.growLight * 30; const total = potCost + soilCost + seedCost + lightCost; const monthlySavings = v.herbCount * 4 * 2.5; const breakEvenMonths = total > 0 ? total / monthlySavings : 0; const electricityMonthly = v.growLight * 0.05 * 12 * 30; const sixMonthCost = total + electricityMonthly * 6; return { result: total, label: 'Indoor Herb Setup Cost', unit: '$', steps: [{ label: 'Pots', value: `${v.pots} × $5 = $${potCost.toFixed(0)}` }, { label: 'Potting Soil', value: `${v.soilBags} × $8 = $${soilCost.toFixed(0)}` }, { label: 'Seed Packets', value: `${v.seeds} × $4 = $${seedCost.toFixed(0)}` }, { label: 'Grow Lights', value: `${v.growLight} × $30 = $${lightCost.toFixed(0)}` }, { label: 'Total Setup Cost', value: `$${total.toFixed(0)}` }, { label: 'Est. Monthly Herb Savings', value: `~$${monthlySavings.toFixed(0)} (vs store-bought)` }, { label: 'Break-Even Period', value: `${breakEvenMonths.toFixed(1)} months` }, { label: '6-Month w/ Electricity', value: `$${sixMonthCost.toFixed(0)} (incl. $${electricityMonthly.toFixed(0)}/mo electricity for lights)` }] ,
    extras: [
      { label: "Best Indoor Herbs for Beginners", value: "Basil (easiest, fastest), Chives (hardy, perennial), Mint (almost unkillable), Parsley (moderate), Cilantro (short-lived but quick), Thyme (slow but forgiving). Avoid: dill and sage (need more space/light)." },
      { label: "Light Requirements", value: "Most herbs need 6-8 hours of direct light daily. South-facing window is ideal. Without sufficient natural light, full-spectrum LED grow lights (18-24W per plant, 12-16 hrs/day) are essential for healthy growth." },
      { label: "Container Selection", value: "Use pots with drainage holes. Minimum size: 4-6 in diameter for individual herbs. Terra cotta is breathable (dries faster — good for rosemary/thyme). Plastic retains moisture (better for basil/mint). Self-watering pots reduce maintenance." },
      { label: "Potting Mix Matters", value: "Use a well-draining potting mix, not garden soil. Mix 3 parts potting soil + 1 part perlite for drainage. Add vermiculite for moisture retention if growing in dry climates. Avoid moisture-control mixes for Mediterranean herbs (rosemary, thyme, oregano)." },
      { label: "Watering Best Practices", value: "Water when the top 1 in of soil feels dry. Overwatering is the #1 killer of indoor herbs. Stick your finger in the soil — if it's damp, wait. Basil likes consistent moisture; rosemary and thyme prefer to dry out between waterings." },
      { label: "Fertilizing Schedule", value: "Feed with a balanced liquid fertilizer (5-5-5 or 10-10-10) at half-strength every 2-4 weeks during growing season. Reduce to every 6-8 weeks in winter. Organic options: fish emulsion, liquid kelp, or compost tea." },
      { label: "Harvesting for Maximum Yield", value: "Harvest by cutting stems above a leaf node (not individual leaves) to encourage bushier growth. Never take more than 1/3 of the plant at once. Regular harvesting actually increases production — pruning signals growth." },
      { label: "Winter Care", value: "Indoor herbs grow slower in winter due to shorter days and lower light. Reduce watering frequency. Place away from drafty windows. Supplemental grow lights become critical Nov-Feb. Chives and mint can go dormant — cut back and reduce water until spring." },
    ]} },
  description: 'Plan and budget your indoor herb garden setup. Calculate costs for pots, soil, seeds, and grow lights, plus the monthly savings vs store-bought herbs and break-even timeline.',
  formula: 'Setup Cost = (Pots × $5) + (Soil × $8) + (Seeds × $4) + (Lights × $30) | Break-Even = Total Cost ÷ (Varieties × 4 bunches × $2.50)',
  interpretation: 'Indoor herb gardening is one of the few kitchen investments that actually saves money over time. A typical 4-herb setup costs about $70-100 upfront (pots, soil, seeds, one grow light) and pays for itself in 2-4 months compared to buying fresh herbs at $2-4 per bunch at the grocery store. After break-even, you save roughly $25-50 per month depending on how many varieties you grow. The key success factors are adequate light (6+ hours daily), proper watering (less is more), and regular harvesting (which actually encourages growth). Basil, chives, and mint are the best bang-for-buck herbs to start with.'
}

export default calcDef
