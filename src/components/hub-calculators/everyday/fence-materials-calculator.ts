import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ fenceLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fenceHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), postSpacingFt: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), numGates: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'fenceLength', label: 'Fence Length (ft)', type: 'number', min: 10, step: '10' },
    { name: 'fenceHeight', label: 'Fence Height (ft)', type: 'number', min: 3, max: 12, step: '1' },
    { name: 'postSpacingFt', label: 'Post Spacing (ft)', type: 'number', min: 4, max: 12, step: '1' },
    { name: 'numGates', label: 'Number of Gates', type: 'number', min: 0, step: '1' },
  ],
  defaults: { fenceLength: '150', fenceHeight: '6', postSpacingFt: '8', numGates: '1' },
  presets: [
    { label: 'Privacy Fence (150 ft)', values: { fenceLength: '150', fenceHeight: '6', postSpacingFt: '8', numGates: '1' } },
    { label: 'Pool Safety Fence (80 ft)', values: { fenceLength: '80', fenceHeight: '4', postSpacingFt: '6', numGates: '1' } },
    { label: 'Farm/Ranch (300 ft)', values: { fenceLength: '300', fenceHeight: '5', postSpacingFt: '10', numGates: '2' } },
    { label: 'Front Yard Ornamental (50 ft)', values: { fenceLength: '50', fenceHeight: '3', postSpacingFt: '6', numGates: '0' } },
  ],
  compute: (v) => {
    const posts = Math.ceil(v.fenceLength / v.postSpacingFt) + 1 + v.numGates * 2
    const railsPerSection = Math.ceil(v.fenceHeight / 2) * 2
    const railsTotal = railsPerSection * v.fenceLength
    const pickets = Math.ceil(v.fenceLength * 12 / 5.5)
    const concrete = Math.ceil(posts * 1.5)
    const picketGap = v.fenceLength * 12 - pickets * 5.5
    const picketGapIn = picketGap / (pickets - 1)
    const postSpacingActual = v.fenceLength / (posts - 1 - v.numGates * 2)
    const totalPicketSqFt = pickets * v.fenceHeight * (5.5 / 12)
    const totalFenceSqFt = v.fenceLength * v.fenceHeight
    const pctCoverage = (totalPicketSqFt / totalFenceSqFt) * 100
    return { result: posts, label: 'Total Posts Needed', unit: '', steps: [
      { label: 'Fence Length', value: `${v.fenceLength} ft` },
      { label: 'Fence Height', value: `${v.fenceHeight} ft` },
      { label: 'Post Spacing', value: `${v.postSpacingFt} ft` },
      { label: 'Fence Posts', value: `${posts}` },
      { label: 'Rail Sections', value: `${railsPerSection} rows × ${v.fenceLength} ft = ${railsTotal.toFixed(0)} ft` },
      { label: 'Pickets Needed', value: `${pickets} (${picketGapIn.toFixed(1)} in gap, ${pctCoverage.toFixed(0)}% coverage)` },
      { label: 'Concrete Bags (60 lb)', value: `${concrete}` },
      { label: 'Total Sq Ft Coverage', value: `${totalFenceSqFt} sq ft fence, ${totalPicketSqFt.toFixed(0)} sq ft wood` },
    ] ,
    extras: [
      { label: "Material Cost Range", value: "Per linear foot: PT pine $2-3, cedar $3-5, vinyl $5-8, aluminum $8-12, wrought iron $15-30. Per linear foot installed: PT pine $25-35, cedar $30-45, vinyl $35-55, aluminum $40-60, wrought iron $50-80. A 150 ft PT pine privacy fence installed: $3,750-5,250. DIY material cost: $1,200-2,000 — save 50-65% with self-install." },
      { label: "Post Setting Best Practices", value: "Hole diameter: 3× post width (12 in for 4×4). Depth: 1/3 post height + 6 in gravel base. Concrete mix: 1 bag of 60 lb Quikrete per post. Let concrete cure 24-48 hrs before attaching rails. Use post level — check in both directions. Brace posts with 2×4s at 45° angles during curing. Setting posts is the most critical step — re-doing is 3× the cost of doing it right." },
      { label: "Picket Gap Optimization", value: "Standard 0.5 in gap gives ~86% coverage — sufficient privacy. Board-on-board (0 in gap, staggered sides): 100% coverage, uses 15-20% more pickets. Shadowbox (alternating sides, 2 in gap): 60% coverage, wind-resistant. For privacy, choose board-on-board or standard with reduced gap (0.25-0.375 in). For wind-prone areas, keep gap ≥0.5 in." },
      { label: "Gate Weight & Hardware", value: "Walk gate (3-4 ft): 30-60 lbs, use 2 heavy-duty strap hinges with 3.5 in screws. Drive gate (10-16 ft): 150-400 lbs, requires 6×6 or 8×8 posts, heavy-duty gate hinges with bearing, and a wheel kit for gates >12 ft. Gate sag is the #1 fence complaint — install a diagonal cable turnbuckle ($15-25) from bottom hinge to top latch side. Auto-latch gate kit: $30-80." },
      { label: "HOA & Permit Considerations", value: "70% of HOAs regulate fence height (max 4-6 ft), material (wood vs vinyl), color (natural vs white/black), and side (good side facing neighbor). Fines: $50-500/month until compliant. Permit costs: $50-200. Property survey: $350-800. Setback from property line: 6-12 in typical. Building without permit risks stop-work order + double permit fee + forced removal." },
      { label: "Wood Preservative & Stain Guide", value: "Pressure-treated: wait 3-6 months before staining (fresh PT too wet). Cedar: can stain immediately or let weather to silver-gray (2+ years). Stain types: transparent (1-2 yr life) $20-40/gal, semi-transparent (2-4 yr) $30-50/gal, solid (3-5 yr) $35-60/gal. Coverage: 150-200 sq ft/gal. 150 ft fence = ~450 sq ft = 2.5-3 gal per coat. Two coats recommended. DIY stain cost: $150-300." },
      { label: "Corner & End Post Requirements", value: "Corner posts and end posts bear 2-3× the lateral load of line posts. Use 6×6 instead of 4×4 for corners, or use 4×4 with 2×4 corner bracing. Concrete corner posts 25% deeper. For gates, end posts must be 6×6 (or 4×4 doubled). A 150 ft fence typically has 4 corner posts (or 2 ends + 2 corners) — all should be beefier than line posts." },
      { label: "Seasonal Timing & Concrete Curing", value: "Best fence installation: late spring (April-June) or early fall (Sept-Oct). Avoid: frozen ground (post holes collapse, concrete won't cure below 40°F), rainy season (muddy worksite, wet wood), and extreme heat (concrete dries too fast). Concrete needs: 50-80°F for optimal cure. Curing time: 24 hrs to walk, 7 days to full load. Use fast-setting concrete in colder weather." },
    ]}
  },
  description: 'Plan every material for your fence project — posts, rails, pickets, and concrete — plus coverage percentage, square footage, and actual post spacing based on your dimensions and number of gates.',
  formula: 'Posts = Ceil(Length/Spacing) + 1 + Gates×2 | Pickets = Ceil(Length × 12/5.5) | Rails = Ceil(Height/2)×2 × Length | Concrete = Ceil(Posts × 1.5) | Coverage = Pickets × Height × 5.5/12 / (Length × Height) × 100',
  interpretation: 'For a 150 ft, 6 ft privacy fence on standard 8 ft spacings, you need 20 posts (including 2 gate posts), 1,800 linear ft of rails in 3 rows, ~328 pickets covering 86% of the fence face, and 30 bags of concrete. The hidden variable is actual post spacing — with 3 spacing sections and 1 gate, your true spacing is 7.5 ft, not the nominal 8 ft. Always recalculate: (Length - gate width) / (line posts - 1). A common underestimated cost is hardware (screws, nails, hinges, latches) which adds 8-12% to material budget.'
}

export default calcDef
