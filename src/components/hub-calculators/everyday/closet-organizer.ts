import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ closetWidth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), closetDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), sections: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), budgetPerSection: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), installType: z.string().min(1), materialGrade: z.string().min(1) }),
  fields: [
    { name: 'closetWidth', label: 'Closet Width (ft)', type: 'number', min: 2, step: '1' },
    { name: 'closetDepth', label: 'Closet Depth (ft)', type: 'number', min: 1, step: '0.5' },
    { name: 'sections', label: 'Number of Sections', type: 'number', min: 1, step: '1' },
    { name: 'budgetPerSection', label: 'Budget per Section ($)', type: 'number', min: 10, step: '25' },
    { name: 'installType', label: 'Installation Type', type: 'select', options: [{ label: 'DIY', value: 'diy' }, { label: 'Professional Install', value: 'pro' }, { label: 'Custom Built-In', value: 'custom' }] },
    { name: 'materialGrade', label: 'Material Grade', type: 'select', options: [{ label: 'Wire/Melamine (Budget)', value: 'budget' }, { label: 'Laminate (Mid-Range)', value: 'mid' }, { label: 'Wood Veneer (Premium)', value: 'premium' }] },
  ],
  defaults: { closetWidth: '6', closetDepth: '2', sections: '4', budgetPerSection: '75', installType: 'diy', materialGrade: 'mid' },
  presets: [
    { label: 'Small Reach-In Closet', values: { closetWidth: '4', closetDepth: '2', sections: '3', budgetPerSection: '50', installType: 'diy', materialGrade: 'budget' } },
    { label: 'Standard Walk-In Closet', values: { closetWidth: '8', closetDepth: '3', sections: '6', budgetPerSection: '100', installType: 'pro', materialGrade: 'mid' } },
    { label: 'Luxury Custom Walk-In', values: { closetWidth: '12', closetDepth: '5', sections: '10', budgetPerSection: '250', installType: 'custom', materialGrade: 'premium' } },
    { label: 'Guest Closet Quick Fix', values: { closetWidth: '3', closetDepth: '2', sections: '2', budgetPerSection: '35', installType: 'diy', materialGrade: 'budget' } },
  ],
  compute: (v) => {
    const area = v.closetWidth * v.closetDepth
    const installMultiplier = v.installType === 'diy' ? 1 : v.installType === 'pro' ? 1.35 : 2.5
    const materialMultiplier = v.materialGrade === 'budget' ? 0.7 : v.materialGrade === 'mid' ? 1 : 1.6
    const effectiveBudget = v.budgetPerSection * installMultiplier * materialMultiplier
    const totalCost = v.sections * effectiveBudget
    const costPerSqFt = totalCost / area
    const linearFt = v.closetWidth * v.sections / (v.closetWidth)
    const diySavings = v.installType !== 'diy' ? v.sections * v.budgetPerSection * (installMultiplier - 1) * materialMultiplier : 0
    const storageDensity = v.sections / area
    return { result: totalCost, label: 'Closet Organizer Cost', unit: '$', steps: [
      { label: 'Closet Footprint', value: `${v.closetWidth}ft × ${v.closetDepth}ft = ${area.toFixed(1)} sq ft` },
      { label: 'Sections Planned', value: `${v.sections} sections (${(v.sections / v.closetWidth).toFixed(1)}/ft of width)` },
      { label: 'Base Budget per Section', value: `$${v.budgetPerSection.toFixed(2)}` },
      { label: `Install Type (${v.installType})`, value: `${installMultiplier}× multiplier` },
      { label: `Material Grade (${v.materialGrade})`, value: `${materialMultiplier}× multiplier` },
      { label: 'Effective Cost per Section', value: `$${v.budgetPerSection.toFixed(2)} × ${installMultiplier.toFixed(2)} × ${materialMultiplier.toFixed(2)} = $${effectiveBudget.toFixed(2)}` },
      { label: 'Total Project Cost', value: `${v.sections} × $${effectiveBudget.toFixed(2)} = $${totalCost.toFixed(2)}` },
      { label: 'Cost per Sq Ft', value: `$${costPerSqFt.toFixed(2)}/sq ft (average: DIY $10-30, Pro $20-50, Custom $50-150)` },
    ] ,
    extras: [
      { label: 'DIY vs Pro vs Custom Cost Gap', value: v.installType === 'diy' ? `DIY saves 25-60% vs pro installation. Your $${totalCost.toFixed(0)} project would cost $${(totalCost * 1.35).toFixed(0)} with pro install or $${(totalCost * 2.5).toFixed(0)} as custom built-ins. DIY requires 4-8 hours and basic tools (drill, level, stud finder).` : v.installType === 'pro' ? `Professional installation adds 35% ($$${(totalCost - totalCost / installMultiplier).toFixed(0)}) but includes measuring, leveling, and adjustments. Custom built-ins at 2.5× would be $${(totalCost / installMultiplier * 2.5).toFixed(0)} — $$${((totalCost / installMultiplier * 2.5) - totalCost).toFixed(0)} more.` : `Custom built-ins at $${costPerSqFt.toFixed(2)}/sq ft are the premium option. They add 30-50% to home resale value ($$${(totalCost * 0.4).toFixed(0)} ROI on your $${totalCost.toFixed(0)} investment). Expect 1-3 weeks for design and installation.` },
      { label: 'Material Grade Trade-Offs', value: v.materialGrade === 'budget' ? 'Wire shelving ($10-20/sq ft): ventilated, adjustable, but looks utilitarian. Melamine ($15-25/sq ft): smooth finish, more durable, limited customization.' : v.materialGrade === 'mid' ? 'Laminate ($25-45/sq ft): moisture-resistant, many finishes, good weight capacity (50-75 lbs/shelf). The best value — 70% of the look of wood at 50% of the cost.' : 'Wood veneer ($50-150/sq ft): premium appearance, strongest (100+ lbs/shelf), customizable stains. Adds $3,000-8,000 to a walk-in closet but can recover 60-80% at resale.' },
      { label: 'Section Configuration Best Practices', value: `For a ${v.closetWidth}ft wide closet with ${v.sections} sections: use 2-3 sections for hanging (1 double-hang for shirts, 1 single-hang for dresses/coats), 1-2 for shelving (folded items, bins), and 1 for accessories (shoes, belts, ties). Optimal ratio: 50% hanging, 25% shelving, 25% accessories.` },
      { label: 'Storage Density Optimization', value: `Your ${storageDensity.toFixed(2)} sections/sq ft is ${storageDensity > 0.8 ? 'dense' : storageDensity > 0.4 ? 'moderate' : 'spacious'}. Maximize vertical space: add a second hanging rod (halves space per section but doubles capacity). Use shelf risers, door-mounted organizers, and corner units to gain 20-40% more usable storage.` },
      { label: 'Lighting & Accessory Upgrades', value: 'Add LED strip lighting ($30-100), pull-out pant racks ($40-80), tie/belt racks ($15-30), and drawer dividers ($10-25). These add 10-15% to your budget but improve usability by 40-60%. Motion-sensor lights are a game-changer for walk-in closets.' },
      { label: 'ROI & Home Value Impact', value: 'A well-organized closet system adds 40-60% ROI at resale. Real estate agents report: organized closets increase perceived home value by 2-5% and reduce time-on-market by 15-30%. Buyers cite closet space as a top-5 feature in 70% of home searches.' },
      { label: 'Taxonomy of Closet Types', value: `Reach-in (2-4ft wide): 3 sections max — 1 hanging, 1 shelf, 1 shoe. Standard walk-in (5-8ft): 5-6 sections ideal. Luxury walk-in (10ft+): 8-10+ sections with island. Your ${v.closetWidth}ft × ${v.closetDepth}ft is ${v.closetWidth > 10 ? 'a luxury' : v.closetWidth > 6 ? 'a standard walk-in' : 'a reach-in'} closet configuration.` },
      { label: 'Maintenance & Durability Expectations', value: `Wire/melamine lasts 5-10 years. Laminate: 10-20 years. Wood veneer: 20+ years (refinishable). All systems need annual tightening of screws and checking of wall anchors. Avoid overloading shelves beyond 75% capacity — this prevents sagging and wall damage.` },
    ]}
  },
  description: 'Plan and budget for a closet organization system based on closet dimensions, number of sections, install type (DIY, professional, custom), and material grade (budget wire/melamine, mid-range laminate, premium wood veneer). Get cost per sq ft, ROI estimates, and configuration recommendations.',
  formula: 'Effective cost/section = Budget × Install multiplier (DIY 1×, Pro 1.35×, Custom 2.5×) × Material multiplier (Budget 0.7×, Mid 1×, Premium 1.6×). Total = Sections × Effective cost/section. Cost/sq ft = Total ÷ (Width × Depth).',
  interpretation: 'DIY closet systems (Elfa, IKEA, ClosetMaid) cost $10-30/sq ft installed. Professional semi-custom (California Closets, Closets by Design) runs $20-50/sq ft. Custom built-ins cost $50-150/sq ft. A reach-in closet typically needs 3-4 sections; a walk-in needs 5-8 sections. Organized closets add 40-60% ROI at home resale. Mid-range laminate offers the best value — 70% of the premium look at 50% of the cost.'
}

export default calcDef
